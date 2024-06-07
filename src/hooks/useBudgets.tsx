import { useQuery } from "@triplit/react";
import { useTriplitClient } from "./useTriplitClient";

export function useBudgets() {
  const { client } = useTriplitClient();
  return useQuery(client, client.query("budgets"));
}
