import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { z } from "zod";

import { MoveMoneyDialog } from "@/components/MoveMoneyDialog";
import { NewAccountDialog } from "@/components/NewAccountDialog";
import { NewCategoryDialog } from "@/components/NewCategoryDialog";
import { NewTransactionDialog } from "@/components/NewTransactionDialog";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/ui/navbar";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { SidebarLayout } from "@/components/ui/sidebar-layout";
import { Dialogs } from "@/constants";
import { TriplitContextProvider } from "@/hooks/useTriplitClient";

export const Route = createRootRoute({
  component: () => (
    <TriplitContextProvider>
      <Toaster />
      <SidebarLayout sidebar={<Sidebar />} navbar={<Navbar></Navbar>}>
        <Outlet />
      </SidebarLayout>
      <AppDialogs />
      {/* {process.env.NODE_ENV === "development" && <TanStackRouterDevtools />} */}
    </TriplitContextProvider>
  ),
  validateSearch: (search) =>
    z
      .object({
        dialog: z.nativeEnum(Dialogs).optional(),
        category: z.string().optional(),
      })
      .parse(search),
});

function AppDialogs() {
  const navigate = Route.useNavigate();
  const { dialog, category } = Route.useSearch();

  const closeDialog = (fields = {}) => {
    navigate({ search: { dialog: undefined, ...fields } });
  };

  return (
    <>
      <NewTransactionDialog
        open={dialog === Dialogs.NewTransaction}
        onClose={closeDialog}
      />
      <NewAccountDialog
        open={dialog === Dialogs.NewAccount}
        onClose={closeDialog}
      />
      <NewCategoryDialog
        open={dialog === Dialogs.NewCategory}
        onClose={closeDialog}
      />
      {category && (
        <MoveMoneyDialog
          open={dialog === Dialogs.MoveMoney}
          categoryId={category}
          onClose={() => closeDialog({ category: undefined })}
        />
      )}
    </>
  );
}
