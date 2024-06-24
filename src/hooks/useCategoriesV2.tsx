import { useQuery } from "@triplit/react";
import { useMemo } from "react";

import { client } from "@db/client";

export function useCategoriesV2() {
  const { results, ...rest } = useQuery(
    client,
    client.query("categoriesV2").order("name", "ASC"),
  );

  const { now, later } = useMemo(() => {
    if (!results) return { now: undefined, later: undefined };
    const now = [];
    const later = [];
    for (const category of results.values()) {
      if (category.for_now !== 0) {
        now.push(category);
      }
      if (category.for_later !== 0) {
        later.push(category);
      }
    }

    return { now, later };
  }, [results]);

  return { results, now, later, ...rest };
}
