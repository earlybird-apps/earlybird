import { createRootRoute, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { SidebarLayout } from "@/components/ui/sidebar-layout";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/ui/navbar";
import { TriplitContextProvider } from "@/hooks/useTriplitClient";
import { CurrentBudgetContextProvider } from "@/hooks/useCurrentBudget";

export const Route = createRootRoute({
  component: () => (
    <TriplitContextProvider>
      <CurrentBudgetContextProvider>
        <SidebarLayout sidebar={<Sidebar />} navbar={<Navbar></Navbar>}>
          <Outlet />
        </SidebarLayout>
      </CurrentBudgetContextProvider>
      {/* {process.env.NODE_ENV === "development" && <TanStackRouterDevtools />} */}
    </TriplitContextProvider>
  ),
});
