import { useQuery } from "@triplit/react";
import { useTriplitClient } from "./useTriplitClient";
import { useCurrentBudget } from "./useCurrentBudget";

export const useCategories = () => {
  const { client } = useTriplitClient();
  const { budget } = useCurrentBudget();

  return useQuery(
    client,
    client.query("categories").where("budget_id", "=", budget?.id || "")
    // TODO: Handle undefined id
  );
};
