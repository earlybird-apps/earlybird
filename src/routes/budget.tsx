import { PlusIcon } from "@heroicons/react/24/outline";
import { LinkProps, Outlet, createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Heading, Subheading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Switch } from "@/components/ui/switch";
import { useBudgetSettings } from "@/hooks/useBudgetSettings";

export const Route = createFileRoute("/budget")({
  component: Budget,
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

function Budget() {
  const { showEmpty, setShowEmpty } = useBudgetSettings();

  return (
    <div className="flex flex-col space-y-4">
      <nav className="flex justify-between items-center">
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
        <div className="flex py-4 gap-x-4 text-sm text-gray-700 justify-between">
          <div className="flex gap-x-4 items-center">
            <Switch checked={showEmpty} onChange={setShowEmpty} />
            <span>Show empty</span>
            {/* <Badge className="px-2">{unassigned}</Badge> */}
          </div>
          <Button outline>
            <PlusIcon />
            Add Category
          </Button>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
