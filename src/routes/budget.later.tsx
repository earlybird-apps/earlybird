import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

import { CategoryItemList } from "@/components/CategoryItem";
import { NoCategories } from "@/components/NoCategories";
import { Divider } from "@/components/ui/divider";
import { useBudgetSettings } from "@/hooks/useBudgetSettings";
import { useCategories } from "@/hooks/useCategories";

export const Route = createFileRoute("/budget/later")({
  component: BudgetLater,
});

function BudgetLater() {
  const { showEmpty } = useBudgetSettings();
  const { later, results: categories, fetching } = useCategories();
  const unassigned = useMemo(
    () =>
      Array.from(categories?.values() || []).filter(
        (c) => !later?.some((lc) => lc.id === c.id),
      ),
    [categories, later],
  );

  if (fetching) return <div>Loading...</div>;

  return (
    <>
      <div className="flex justify-between text-gray-700 text-sm m-2">
        <span className="p-1">Category</span>
        <span className="p-1 me-14 lg:me-12">Saved</span>
      </div>
      {later.length > 0 ? (
        <CategoryItemList categories={later} display="later" />
      ) : (
        <NoCategories />
      )}
      {showEmpty && (
        <>
          <Divider soft className="my-8" />
          <CategoryItemList categories={unassigned} display="later" />
        </>
      )}
    </>
  );
}
