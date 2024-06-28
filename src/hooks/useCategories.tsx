import { useQuery } from "@triplit/react";
import { useMemo } from "react";

import { client } from "@db/client";

export function useCategories({ includeSystem = false } = {}) {
  const query = client.query("categories").order("name", "ASC");
  if (!includeSystem) query.where("system_code", "=", null);

  const { results, ...rest } = useQuery(client, query);

  const computedFields = useMemo(() => {
    const now = [];
    const later = [];
    const fundedCategories = [];
    const underfundedCategories = [];
    const emptyCategories = [];
    const systemCategories = [];

    for (const category of results?.values() || []) {
      if (category.for_now !== 0) now.push(category);
      if (category.for_later !== 0) later.push(category);
      if (category.for_now > category.activity) fundedCategories.push(category);
      if (category.for_now < category.activity)
        underfundedCategories.push(category);
      if (category.for_now === category.activity || category.for_now === 0)
        emptyCategories.push(category);
      if (category.system_code) systemCategories.push(category);
    }

    return {
      now,
      later,
      fundedCategories,
      underfundedCategories,
      emptyCategories,
      systemCategories,
    };
  }, [results]);

  return { results, ...computedFields, ...rest };
}
