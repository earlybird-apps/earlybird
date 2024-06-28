import { useQuery } from "@triplit/react";
import { useMemo } from "react";

import { client } from "@db/client";

export function useCategories() {
  const { results, ...rest } = useQuery(
    client,
    client.query("categories").order("name", "ASC"),
  );

  const computedFields = useMemo(() => {
    const now = [];
    const later = [];
    const fundedCategories = [];
    const underfundedCategories = [];
    const emptyCategories = [];

    for (const category of results?.values() || []) {
      if (category.for_now !== 0) now.push(category);
      if (category.for_later !== 0) later.push(category);
      if (category.for_now > category.activity) fundedCategories.push(category);
      if (category.for_now < category.activity)
        underfundedCategories.push(category);
      if (category.for_now === category.activity || category.for_now === 0)
        emptyCategories.push(category);
    }

    return {
      now,
      later,
      fundedCategories,
      underfundedCategories,
      emptyCategories,
    };
  }, [results]);

  return { results, ...computedFields, ...rest };
}
