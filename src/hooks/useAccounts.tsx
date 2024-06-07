import { client } from "../../triplit/client";
import { useQuery } from "@triplit/react";

const query = client.query("accounts");

export function useAccounts() {
  return useQuery(client, query);
}
