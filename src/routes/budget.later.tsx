import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

import { LaterCategoryItem } from "@/components/CategoryItems";
import { Divider } from "@/components/ui/divider";
import { useBudgetSettings } from "@/hooks/useBudgetSettings";
import { useCategoriesV2 } from "@/hooks/useCategoriesV2";

export const Route = createFileRoute("/budget/later")({
  component: BudgetLater,
});

function BudgetLater() {
  const { later, results: categories, fetching } = useCategoriesV2();
  const { showEmpty } = useBudgetSettings();
  const unassigned = useMemo(() => {
    return categories
      ? Array.from(categories.values()).filter(
          (c) => !later?.some((lc) => lc.id === c.id),
        )
      : undefined;
  }, [categories, later]);

  //   TODO: Move this to root level and pass down?
  if (fetching) return <div>Loading...</div>;
  if (!categories || categories.size === 0) return <div>No categories</div>;
  //   TODO ^
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 m-2 text-gray-700 text-sm">
        <span className="p-1 col-span-1">Category</span>
        <span className="p-1 col-span-1 text-end lg:text-start">Saved</span>
      </div>
      <ul className="flex flex-col gap-y-2">
        {later?.map((category) => (
          <li key={category.id}>
            <LaterCategoryItem category={category} />
          </li>
        ))}
      </ul>
      {showEmpty && (
        <>
          <Divider soft className="my-8" />
          <ul className="flex flex-col gap-y-2">
            {unassigned?.map((category) => (
              <li key={category.id}>
                <LaterCategoryItem category={category} />
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
