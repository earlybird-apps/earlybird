import { useTriplitClient } from "./useTriplitClient";

type MoveMoneyPayload = {
  amount: number;
  toCategoryId: string;
  fromCategoryId: string | null;
};

export function useMutateCategory() {
  const { client } = useTriplitClient();

  const moveMoney = async (data: MoveMoneyPayload) => {
    await client.transact(async (tx) => {
      tx.update("categories", data.toCategoryId, async (category) => {
        category.assigned += data.amount;
      });
      if (data.fromCategoryId) {
        await tx.update("categories", data.fromCategoryId, async (category) => {
          category.assigned -= data.amount;
        });
      }
    });
  };

  return { addMoney: moveMoney };
}
