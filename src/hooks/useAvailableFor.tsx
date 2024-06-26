import { useMemo } from "react";

import { Category } from "@db/types";

export function useAvailableFor(category: Category) {
  return useMemo(() => {
    const now = category.for_now + category.activity;
    const later = category.for_later;
    const total = now + later;
    return { now, later, total };
  }, [category.activity, category.for_now, category.for_later]);
}
