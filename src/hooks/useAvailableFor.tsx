import { useMemo } from "react";

import { CategoryV2 } from "@db/types";

export function useAvailableFor(category: CategoryV2) {
  return useMemo(() => {
    const now = category.for_now + category.activity;
    const later = category.for_later;
    const total = now + later;
    return { now, later, total };
  }, [category.activity, category.for_now, category.for_later]);
}
