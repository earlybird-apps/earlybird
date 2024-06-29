import { useQuery } from "@triplit/react";

import { useTriplitClient } from "../useTriplitClient";

export function useAccounts(props: { budgetId?: string } = {}) {
  const { client } = useTriplitClient();
  const query = client.query("accounts");
  if (props.budgetId) query.where("budget_id", "=", props.budgetId);
  return useQuery(client, query);
}
