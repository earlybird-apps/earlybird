import { client } from "@db/client";
import { useQueryOne } from "@triplit/react";

export function useCategory(categoryId: string) {
  return useQueryOne(client, client.query("categories").id(categoryId));
}
