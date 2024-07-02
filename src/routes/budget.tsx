import { CheckBadgeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { format } from "date-fns";

import { Currency } from "@/components/Currency";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heading, Subheading } from "@/components/ui/heading";
import { Dialogs } from "@/constants";
import { useReadyToBudget } from "@/hooks/useReadyToBuget";

export const Route = createFileRoute("/budget")({
  component: Budget,
});

// const links: { route: LinkProps["to"]; label: string }[] = [
//   {
//     route: "/budget",
//     label: "Now",
//   },
//   {
//     route: "/budget/later",
//     label: "Later",
//   },
//   {
//     route: "/budget/total",
//     label: "Total",
//   },
// ];

function ReadyToBudget() {
  const { result: readyToBudget, fetching } = useReadyToBudget();
  if (fetching) return <div>Loading...</div>;
  if (readyToBudget === undefined) {
    console.error("readyToBudget is undefined");
    return null;
  }

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
  return (
    <div className="flex flex-col space-y-4">
      <nav className="flex justify-between items-center sticky top-0 h-14 bg-white z-10">
        <Heading className="hidden lg:block">
          {format(new Date(), "MMMM do, yyyy")}
        </Heading>
        <Subheading className="lg:hidden">
          {format(new Date(), "MMMM, yyyy")}
        </Subheading>
        {/* <ul className="gap-x-4 text-sm font-medium overflow-auto -mb-px flex border rounded-full p-1 bg-gray-50 items-center">
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
        </ul> */}
      </nav>
      <div className="flex gap-x-4 text-sm text-gray-700 sticky top-14 bg-white z-10 justify-between">
        <span className="items-center my-auto">
          <ReadyToBudget />
        </span>
        <Button
          outline
          href=""
          search={(prev) => ({ ...prev, dialog: Dialogs.NewCategory })}
        >
          <PencilSquareIcon />
          <span className="sr-only">Add Category</span>
        </Button>
      </div>
      <Outlet />
    </div>
  );
}
