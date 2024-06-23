import { LinkProps, Outlet, createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";

import { Heading, Subheading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";

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
        <Outlet />
      </div>
    </div>
  );
}
