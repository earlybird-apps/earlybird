import { useQueryOne } from "@triplit/react";

import { Account } from "@db/types";

import { SystemCategories } from "@/constants";

import { useTriplitClient } from "../useTriplitClient";

export function useMutateAccounts() {
  const { client } = useTriplitClient();
  const { result: budget } = useQueryOne(client, client.query("budgets"));

  const insert = async (data: Omit<Account, "id" | "budget_id">) =>
    client.transact(async (tx) => {
      const categoryPromise = tx.fetchOne(
        client
          .query("categories")
          .where(
            "system_code",
            "=",
            SystemCategories.StartingBalance.system_code,
          )
          .build(),
      );
      const accountPromise = await tx.insert("accounts", {
        ...data,
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        budget_id: budget?.id!,
      });

      Promise.all([accountPromise, categoryPromise]).then(
        ([account, category]) =>
          tx.insert("transactions", {
            account_id: account.id,
            amount: data.balance,
            date: new Date(),
            memo: "Starting Balance",
            category_id: category?.id,
          }),
      );
    });

  return { insert };
}
