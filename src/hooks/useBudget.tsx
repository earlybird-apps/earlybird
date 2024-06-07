import { useEntity } from "@triplit/react";
import { useTriplitClient } from "./useTriplitClient";

export function useBudget(id: string) {
  const { client } = useTriplitClient();
  return useEntity(client, "budgets", id);
}
