import { useQuery } from "@triplit/react";
import { useTriplitClient } from "./useTriplitClient";

export function useAccounts() {
  const { client } = useTriplitClient();
  return useQuery(client, client.query("accounts"));
}
