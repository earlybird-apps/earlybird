import {
  ArrowUpTrayIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline";
import { createFileRoute } from "@tanstack/react-router";

import { Currency } from "@/components/Currency";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { useCategoriesV2 } from "@/hooks/useCategoriesV2";

export const Route = createFileRoute("/budget/total")({
  component: BudgetTotal,
});
function BudgetTotal() {
  const { results: categories, fetching } = useCategoriesV2();

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
      <Divider className="my-2" />
      <ul className="flex flex-col gap-y-2">
        {categories &&
          Array.from(categories.values()).map((category) => (
            <li key={category.id} className="border p-4 rounded-lg">
              <div className="grid grid-cols-2 lg:grid-cols-5 items-center gap-y-4">
                <div className="font-medium col-span-1">{category.name}</div>
                <div className="col-span-1 text-end lg:text-start">
                  <Currency
                    className="font-extrabold"
                    value={
                      category.for_later + category.for_now + category.activity
                    }
                  />
                </div>
                <div className="hidden lg:col-span-1 lg:flex gap-x-4 text-sm text-gray-700 justify-between">
                  <Currency
                    className="font-medium"
                    value={category.for_now + category.activity}
                  />
                </div>
                <div className="hidden lg:col-span-1 lg:flex gap-x-4 text-sm text-gray-700 justify-between">
                  <Currency
                    className="font-medium"
                    value={category.for_later}
                  />
                </div>
                <div className="col-span-2 lg:hidden flex gap-x-4 text-sm text-gray-700 justify-between">
                  <div className="text-center flex gap-2 lg:flex-col lg:capitalize">
                    <span>
                      <Currency
                        className="font-medium"
                        value={category.for_now + category.activity}
                      />
                    </span>
                    <span>now</span>
                  </div>
                  <div className="text-center flex gap-2 lg:flex-col lg:capitalize">
                    <span>
                      <Currency
                        className="font-medium"
                        value={category.for_later}
                      />
                    </span>
                    <span>later</span>
                  </div>
                </div>
                <div className="hidden lg:col-span-1 lg:flex ms-auto">
                  <Button outline className="border-e-0 rounded-e-none">
                    <ArrowsRightLeftIcon />
                  </Button>
                  <Button outline className="border-s-0 rounded-s-none">
                    <ArrowUpTrayIcon />
                  </Button>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </>
  );
}
