import { useQueryOne } from "@triplit/react";

import { client } from "@db/client";

export function useCategory(categoryId: string) {
  return useQueryOne(client, client.query("categories").id(categoryId));
}
