import { CheckBadgeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { LinkProps, Outlet, createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { format } from "date-fns";
import { useState } from "react";
import { z } from "zod";

import { AddMoneyDialog } from "@/components/AddMoneyDialog";
import { Currency } from "@/components/Currency";
import { NewCategoryDialog } from "@/components/NewCategoryDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heading, Subheading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Switch } from "@/components/ui/switch";
import { useBudgetSettings } from "@/hooks/useBudgetSettings";
import { useReadyToBudget } from "@/hooks/useReadyToBuget";

export const Route = createFileRoute("/budget")({
  component: Budget,
  validateSearch: (search) =>
    z
      .object({
        view: z.union([z.literal("now"), z.literal("later")]).optional(),
        showAddMoney: z.boolean().optional(),
        categoryId: z.string().optional(),
      })
      .parse(search),
});

const links: { route: LinkProps["to"]; label: string }[] = [
  {
    route: "/budget",
    label: "Now",
  },
  {
    route: "/budget/later",
    label: "Later",
  },
  {
    route: "/budget/total",
    label: "Total",
  },
];

function ReadyToBudget() {
  const { result: readyToBudget, fetching } = useReadyToBudget();
  if (fetching || readyToBudget === undefined) return null; //TODO: Loading state

  return readyToBudget === 0 ? (
    <span className="flex items-center gap-x-2 text-xs">
      <CheckBadgeIcon className="w-4" />
      All Assigned
    </span>
  ) : (
    <Badge
      color={readyToBudget > 0 ? "green" : "red"}
      className={clsx("flex flex-wrap", readyToBudget < 0 && "animate-pulse")}
    >
      <Currency value={readyToBudget} />
      <span>{readyToBudget > 0 ? "ready to budget" : "over budgeted"}</span>
    </Badge>
  );
}

function Budget() {
  const { showEmpty, setShowEmpty } = useBudgetSettings();
  const [showNewCategory, setShowNewCategory] = useState(false);
  const { showAddMoney, categoryId, view } = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <div className="flex flex-col space-y-4">
      <nav className="flex justify-between items-center sticky top-0 h-14 bg-white z-10">
        <Heading className="hidden lg:block">
          {format(new Date(), "MMMM do, yyyy")}
        </Heading>
        <Subheading className="lg:hidden">
          {format(new Date(), "MMMM, yyyy")}
        </Subheading>
        <ul className="gap-x-4 text-sm font-medium overflow-auto -mb-px flex border rounded-full p-1 bg-gray-50 items-center">
          {links.map((item) => (
            <li key={item.route}>
              <Link
                href={item.route}
                activeOptions={{ exact: true }}
                className="flex px-3 py-1"
                activeProps={{
                  className: "border font-semibold rounded-full bg-white",
                }}
              >
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div>
        <div className="flex mb-5 py-4 gap-x-4 text-sm text-gray-700 sticky top-14 bg-white border-b  z-10">
          <div className="flex gap-x-4 items-center me=auto">
            <Switch checked={showEmpty} onChange={setShowEmpty} />
            <span>Show empty</span>
          </div>
          <span className="ms-auto items-center my-auto">
            <ReadyToBudget />
          </span>
          <Button outline onClick={() => setShowNewCategory(true)}>
            <PencilSquareIcon />
            <span className="sr-only">Add Category</span>
          </Button>
        </div>
        <Outlet />
      </div>
      <NewCategoryDialog open={showNewCategory} onClose={setShowNewCategory} />
      <AddMoneyDialog
        display={view!} //TODO handle ! better
        open={showAddMoney === true}
        categoryId={categoryId!} //TODO handle ! better
        onClose={() =>
          navigate({
            search: { showAddMoney: undefined, categoryId: undefined },
          })
        }
      />
    </div>
  );
}
