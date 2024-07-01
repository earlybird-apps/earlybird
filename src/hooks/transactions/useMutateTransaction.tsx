import { Transaction } from "@db/types";

import { useTriplitClient } from "../useTriplitClient";

export function useMutateTransaction() {
  const { client } = useTriplitClient();
  const insert = async (
    data: Omit<Transaction, "id"> & {
      category_id: string;
    },
  ) =>
    client.transact(async (tx) => {
      await tx.insert("transactions", data);
      await tx.update("accounts", data.account_id, async (account) => {
        account.balance = account.balance + data.amount;
      });
      await tx.update("categories", data.category_id, async (category) => {
        category.activity = category.activity + data.amount;
      });
    });

  const update = async (data: Transaction) =>
    client.transact(async (tx) => {
      let originalCategory: string | undefined;
      await tx.update("transactions", data.id, (transaction) => {
        originalCategory = transaction.category_id;

        transaction.account_id = data.account_id;
        transaction.amount = data.amount;
        transaction.category_id = data.category_id;
        transaction.date = data.date;
        transaction.memo = data.memo;
      });

      if (
        originalCategory &&
        data.category_id &&
        originalCategory !== data.category_id
      ) {
        await tx.update("categories", originalCategory, async (category) => {
          category.activity = category.activity - data.amount;
        });
        await tx.update("categories", data.category_id, async (category) => {
          category.activity = category.activity + data.amount;
        });
      }
    });

  return { insert, update };
}
