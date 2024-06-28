import { useQuery } from "@triplit/react";
import { useMemo } from "react";

import { client } from "@db/client";

export function useCategories({ includeSystem = false } = {}) {
  const query = client.query("categories").order("name", "ASC");
  if (!includeSystem) query.where("system_code", "=", null);

  const { results, ...rest } = useQuery(client, query);

  const computedFields = useMemo(() => {
    const all = [];
    const assigned = [];
    const funded = [];
    const underfunded = [];
    const empty = [];
    const system = [];

    for (const category of results?.values() || []) {
      all.push(category);
      if (category.system_code !== null) {
        system.push(category);
        continue;
      }
      if (category.assigned !== 0) assigned.push(category);
      if (category.assigned > category.activity) funded.push(category);
      if (category.assigned < category.activity) underfunded.push(category);
      if (category.assigned === category.activity || category.assigned === 0)
        empty.push(category);
    }

    return {
      all,
      assigned,
      funded,
      underfunded,
      empty,
      system,
    };
  }, [results]);

  return { results, ...computedFields, ...rest };
}
