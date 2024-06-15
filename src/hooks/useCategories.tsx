import { useQuery } from "@triplit/react";
import { useTriplitClient } from "./useTriplitClient";

export const useCategories = ({ budgetId }: { budgetId: string }) => {
  const { client } = useTriplitClient();

  return useQuery(
    client,
    client.query("categories").where("budget_id", "=", budgetId)
  );
};
