import { Outlet, createRootRoute } from "@tanstack/react-router";

import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/ui/navbar";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { SidebarLayout } from "@/components/ui/sidebar-layout";
import { CurrentBudgetContextProvider } from "@/hooks/useCurrentBudget";
import { TriplitContextProvider } from "@/hooks/useTriplitClient";

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
