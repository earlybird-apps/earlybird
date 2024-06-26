import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

import { Category } from "@db/types";

import { CategoryItem } from "@/components/CategoryItem";
import { Divider } from "@/components/ui/divider";
import { useBudgetSettings } from "@/hooks/useBudgetSettings";
import { useCategories } from "@/hooks/useCategories";

export const Route = createFileRoute("/budget/total")({
  component: BudgetTotal,
});
function BudgetTotal() {
  const { results: categories, fetching } = useCategories();
  const { showEmpty } = useBudgetSettings();

  const { unassigned, assigned } = useMemo(() => {
    if (!categories) return { unassigned: undefined, assigned: undefined };
    const unassigned: Category[] = [];
    const assigned: Category[] = [];
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
      <div className="flex justify-between text-gray-700 text-sm m-2">
        <span className="p-1">Category</span>
        <span className="p-1">Balance</span>
      </div>
      <ul className="flex flex-col gap-2">
        {assigned?.map((category) => (
          <li key={category.id}>
            <CategoryItem category={category} display="total" />
          </li>
        ))}
      </ul>
      {showEmpty && (
        <>
          <Divider soft className="my-8" />
          <ul className="flex flex-col gap-2">
            {unassigned?.map((category) => (
              <li key={category.id}>
                <CategoryItem category={category} display="total" />
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
