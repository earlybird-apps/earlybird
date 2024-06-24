import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  FlagIcon,
} from "@heroicons/react/24/outline";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

import { Currency } from "@/components/Currency";
import { Button } from "@/components/ui/button";
import { useBudgetSettings } from "@/hooks/useBudgetSettings";
import { useCategoriesV2 } from "@/hooks/useCategoriesV2";

export const Route = createFileRoute("/budget/later")({
  component: BudgetLater,
});

function BudgetLater() {
  const { later, results: categories, fetching } = useCategoriesV2();
  const { showEmpty } = useBudgetSettings();

  const displayCategories = useMemo(() => {
    if (showEmpty === true)
      return categories ? Array.from(categories.values()) : undefined;
    if (showEmpty === false) return later;
  }, [showEmpty, categories, later]);

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
        {displayCategories &&
          displayCategories.map((category) => (
            <li key={category.id} className="border p-4 rounded-lg">
              <div className="grid grid-cols-2 lg:grid-cols-4 items-center gap-y-4">
                <div className="font-medium col-span-1">{category.name}</div>
                <div className="col-span-1 text-end lg:text-start">
                  <Currency
                    className="font-extrabold"
                    value={category.for_later}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 flex gap-x-4 text-xs text-gray-700 justify-between">
                  {category.later_goal && (
                    <div className="flex flex-col w-full gap-y-2">
                      <div className="rounded-full bg-gray-200 w-full h-2">
                        <div
                          className="h-2 rounded-full bg-emerald-600"
                          style={{
                            width:
                              (category.for_later / category.later_goal) * 100 +
                              "%",
                          }}
                        />
                      </div>
                      <div className="flex justify-between">
                        <span>Goal</span>
                        <Currency
                          className="ms-auto"
                          value={category.later_goal}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="hidden lg:col-span-1 lg:flex ms-auto">
                  <Button outline className="border-e-0 rounded-e-none">
                    <ArrowUpTrayIcon />
                  </Button>
                  <Button outline className="border-s-0 rounded-s-none">
                    <ArrowDownTrayIcon />
                  </Button>
                  <Button outline className="ms-2">
                    <FlagIcon />
                  </Button>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </>
  );
}
