import { useEntity } from "@triplit/react";
import { useTriplitClient } from "./useTriplitClient";

export function useAccount(id: string) {
  const { client } = useTriplitClient();
  return useEntity(client, "accounts", id);
}
