import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

import { CategoryItemList } from "@/components/CategoryItem";
import { NoCategories } from "@/components/NoCategories";
import { Divider } from "@/components/ui/divider";
import { useBudgetSettings } from "@/hooks/useBudgetSettings";
import { useCategories } from "@/hooks/useCategories";

export const Route = createFileRoute("/budget/")({
  component: BudgetNow,
});

function BudgetNow() {
  const { now, results: categories, fetching } = useCategories();
  const { showEmpty } = useBudgetSettings();

  const unassigned = useMemo(
    () =>
      Array.from(categories?.values() || []).filter(
        (c) => !now?.some((nc) => nc.id === c.id),
      ),
    [categories, now],
  );

  if (fetching) return <div>Loading...</div>;

  return (
    <>
      <div className="flex justify-between text-gray-700 text-sm m-2">
        <span className="p-1">Category</span>
        <span className="p-1 me-14 lg:me-12">Available</span>
      </div>
      {now.length > 0 ? (
        <CategoryItemList categories={now} display="now" />
      ) : (
        <NoCategories />
      )}
      {showEmpty && (
        <>
          <Divider soft className="my-8" />
          <CategoryItemList categories={unassigned} display="now" />
        </>
      )}
    </>
  );
}
