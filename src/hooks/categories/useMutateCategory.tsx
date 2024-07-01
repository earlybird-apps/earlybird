import { useQueryOne } from "@triplit/react";

import { useTriplitClient } from "../useTriplitClient";

type MoveMoneyPayload = {
  amount: number;
  toCategoryId: string | null;
  fromCategoryId: string | null;
};

export function useMutateCategory() {
  const { client } = useTriplitClient();
  const { result: budget } = useQueryOne(client, client.query("budgets"));

  const moveMoney = async (data: MoveMoneyPayload) => {
    await client.transact(async (tx) => {
      if (data.toCategoryId) {
        await tx.update("categories", data.toCategoryId, async (category) => {
          category.assigned += data.amount;
        });
      }
      if (data.fromCategoryId) {
        await tx.update("categories", data.fromCategoryId, async (category) => {
          category.assigned -= data.amount;
        });
      }
    });
  };

  const insert = async (data: { name: string }) => {
    await client.insert("categories", {
      name: data.name,
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      budget_id: budget?.id!, // ! = Let this fail and throw an error if budget is undefined
    });
  };

  return { moveMoney, insert };
}
