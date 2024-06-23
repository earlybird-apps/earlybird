import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  FlagIcon,
} from "@heroicons/react/24/outline";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useReducer } from "react";

import { Currency } from "@/components/Currency";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Switch } from "@/components/ui/switch";
import { useCategoriesV2 } from "@/hooks/useCategoriesV2";

export const Route = createFileRoute("/budget/later")({
  component: BudgetLater,
});

function BudgetLater() {
  const [showUnassigned, toggleUnassigned] = useReducer(
    (state) => !state,
    false,
  );
  const { later, results: categories, fetching } = useCategoriesV2();

  const unassigned = useMemo(() => {
    if (!later || !categories) return 0;
    return categories.size - later.length;
  }, [later, categories]);

  const displayCategories = useMemo(() => {
    if (showUnassigned === true)
      return categories ? Array.from(categories.values()) : undefined;
    if (showUnassigned === false) return later;
  }, [showUnassigned, categories, later]);

  //   TODO: Move this to root level and pass down?
  if (fetching) return <div>Loading...</div>;
  if (!categories || categories.size === 0) return <div>No categories</div>;
  //   TODO ^
  return (
    <>
      <div className="flex py-4 gap-x-4 text-sm text-gray-700 justify-between">
        <div className="flex gap-x-4 items-center">
          <Switch checked={showUnassigned} onChange={toggleUnassigned} />
          <span>Show empty</span>
          <Badge className="px-2">{unassigned}</Badge>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 m-2 text-gray-700 text-sm">
        <span className="p-1 col-span-1">Category</span>
        <span className="p-1 col-span-1 text-end lg:text-start">Saved</span>
      </div>
      <Divider className="my-2" />
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
