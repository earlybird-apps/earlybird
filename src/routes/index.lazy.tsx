import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { SidebarLayout } from "@/components/ui/sidebar-layout";
import { Sidebar, SidebarHeader } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { BudgetsDropdown } from "@/components/BudgetsDropdown";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <SidebarLayout
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <BudgetsDropdown />
          </SidebarHeader>
        </Sidebar>
      }
      navbar={<Navbar></Navbar>}
    >
      <Outlet />
    </SidebarLayout>
  );
}
