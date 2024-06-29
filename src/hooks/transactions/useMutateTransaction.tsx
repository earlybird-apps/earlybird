import { Transaction } from "@db/types";

import { useTriplitClient } from "../useTriplitClient";

export function useMutateTransaction() {
  const { client } = useTriplitClient();
  const insert = async (
    data: Omit<Transaction, "id" | "category_id" | "memo"> & {
      category_id: string;
      memo?: string;
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

  return { insert };
}
