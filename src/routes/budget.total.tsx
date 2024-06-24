import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

import { CategoryV2 } from "@db/types";

import { TotalCategoryItem } from "@/components/CategoryItems";
import { Divider } from "@/components/ui/divider";
import { useBudgetSettings } from "@/hooks/useBudgetSettings";
import { useCategoriesV2 } from "@/hooks/useCategoriesV2";

export const Route = createFileRoute("/budget/total")({
  component: BudgetTotal,
});
function BudgetTotal() {
  const { results: categories, fetching } = useCategoriesV2();
  const { showEmpty } = useBudgetSettings();

  const { unassigned, assigned } = useMemo(() => {
    if (!categories) return { unassigned: undefined, assigned: undefined };
    const unassigned: CategoryV2[] = [];
    const assigned: CategoryV2[] = [];
    Array.from(categories.values()).forEach((c) => {
      if (c.for_later === 0 && c.for_now === 0) {
        unassigned.push(c);
      } else {
        assigned.push(c);
      }
    });
    return { unassigned, assigned };
  }, [categories]);
  //   TODO: Move this to root level and pass down?
  if (fetching) return <div>Loading...</div>;
  if (!categories || categories.size === 0) return <div>No categories</div>;
  //   TODO ^
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-5 m-2 text-gray-700 text-sm">
        <span className="p-1 col-span-1">Category</span>
        <span className="p-1 col-span-1 text-end lg:text-start">Balance</span>
        <span className="p-1 col-span-1 hidden lg:block">Now</span>
        <span className="p-1 col-span-1 hidden lg:block">Later</span>
      </div>
      <ul className="flex flex-col gap-y-2">
        {assigned?.map((category) => (
          <li key={category.id}>
            <TotalCategoryItem category={category} />
          </li>
        ))}
      </ul>
      {showEmpty && (
        <>
          <Divider soft className="my-8" />
          <ul className="flex flex-col gap-y-2">
            {unassigned?.map((category) => (
              <li key={category.id}>
                <TotalCategoryItem category={category} />
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
