import { client } from "../../triplit/client";
import { useQuery } from "@triplit/react";

const query = client.query("budgets");

export function useBudgets() {
  return useQuery(client, query);
}
