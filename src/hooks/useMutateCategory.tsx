import { useTriplitClient } from "./useTriplitClient";

export function useMutateCategory() {
  const { client } = useTriplitClient();

  const moveMoney = async (data: { amount: number; categoryId: string }) => {
    await client.update("categories", data.categoryId, async (category) => {
      category.assigned += data.amount;
    });
  };

  return { addMoney: moveMoney };
}
