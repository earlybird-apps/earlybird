import { useTriplitClient } from "./useTriplitClient";

type FromPocket = "RTB" | "LATER" | "NOW";
type ToPocket = "LATER" | "NOW";

export function useMutateCategory() {
  const { client } = useTriplitClient();

  const moveMoney = async (data: {
    fromPocket: FromPocket;
    toPocket: ToPocket;
    amount: number;
    categoryId: string;
  }) => {
    await client.update("categories", data.categoryId, async (category) => {
      switch (data.toPocket) {
        case "NOW":
          category.for_now += data.amount;
          break;
        case "LATER":
          category.for_later += data.amount;
          break;
      }

      switch (data.fromPocket) {
        case "LATER":
          category.for_later -= data.amount;
          break;
        case "NOW":
          category.for_now -= data.amount;
          break;
        case "RTB":
          break;
      }
    });
  };

  return { addMoney: moveMoney };
}
