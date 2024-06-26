import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

import { CategoryItem } from "@/components/CategoryItem";
import { Divider } from "@/components/ui/divider";
import { useBudgetSettings } from "@/hooks/useBudgetSettings";
import { useCategoriesV2 } from "@/hooks/useCategoriesV2";

export const Route = createFileRoute("/budget/")({
  component: BudgetNow,
});

function BudgetNow() {
  const { now, results: categories, fetching } = useCategoriesV2();
  const { showEmpty } = useBudgetSettings();

  const unassigned = useMemo(() => {
    return categories
      ? Array.from(categories.values()).filter(
          (c) => !now?.some((nc) => nc.id === c.id),
        )
      : undefined;
  }, [categories, now]);

  //   TODO: Move this to root level and pass down?
  if (fetching) return <div>Loading...</div>;
  if (!categories || categories.size === 0) return <div>No categories</div>;
  //   TODO ^
  return (
    <>
      <div className="flex justify-between text-gray-700 text-sm m-2">
        <span className="p-1">Category</span>
        <span className="p-1">Available</span>
      </div>
      <ul className="flex flex-col gap-y-2">
        {now?.map((category) => (
          <li key={category.id}>
            <CategoryItem category={category} display="now" />
          </li>
        ))}
      </ul>
      {showEmpty && (
        <>
          <Divider soft className="my-8" />
          <ul className="flex flex-col gap-y-2">
            {unassigned?.map((category) => (
              <li key={category.id}>
                <CategoryItem category={category} display="now" />
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
