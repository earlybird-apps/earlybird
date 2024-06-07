import { createRootRoute, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { SidebarLayout } from "@/components/ui/sidebar-layout";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/ui/navbar";

export const Route = createRootRoute({
  component: () => (
    <>
      <SidebarLayout sidebar={<Sidebar />} navbar={<Navbar></Navbar>}>
        <Outlet />
      </SidebarLayout>
      {/* {process.env.NODE_ENV === "development" && <TanStackRouterDevtools />} */}
    </>
  ),
});
