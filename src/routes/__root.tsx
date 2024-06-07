import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { SidebarLayout } from "@/components/ui/sidebar-layout";
import {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { BudgetsDropdown } from "@/components/BudgetsDropdown";
import { Square3Stack3DIcon } from "@heroicons/react/24/outline";
import { useAccounts } from "@/hooks/useAccounts";
import { ArrowPathIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";

const Accounts = () => {
  const { results, fetching } = useAccounts();
  return (
    <>
      <SidebarHeading>
        <span className="flex justify-between">
          Accounts{" "}
          <ArrowPathIcon
            className={clsx(fetching ? "w-3 animate-spin" : "hidden")}
          />
        </span>
      </SidebarHeading>

      {Array.from(results || []).map(([id, account]) => (
        <SidebarItem key={id} href="/accounts">
          {account.name}
        </SidebarItem>
      ))}

      <SidebarItem href="/accounts">Savings</SidebarItem>
    </>
  );
};

export const Route = createRootRoute({
  component: () => (
    <>
      <SidebarLayout
        sidebar={
          <Sidebar>
            <SidebarHeader>
              <BudgetsDropdown />
              <SidebarSection>
                <SidebarItem href="/accounts">
                  <Square3Stack3DIcon />
                  <SidebarLabel>All Accounts</SidebarLabel>
                </SidebarItem>
              </SidebarSection>
            </SidebarHeader>
            <SidebarBody>
              <Accounts />
            </SidebarBody>
          </Sidebar>
        }
        navbar={<Navbar></Navbar>}
      >
        <Outlet />
      </SidebarLayout>
      {process.env.NODE_ENV === "development" && <TanStackRouterDevtools />}
    </>
  ),
});
