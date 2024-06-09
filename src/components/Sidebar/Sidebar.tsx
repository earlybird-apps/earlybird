import { Square3Stack3DIcon, WalletIcon } from "@heroicons/react/24/outline";
import {
  Sidebar as BaseSidebar,
  SidebarHeader,
  SidebarSection,
  SidebarItem,
  SidebarLabel,
  SidebarBody,
  SidebarFooter,
} from "../ui/sidebar";
import { Accounts } from "./Accounts";
import { Budgets } from "./Budgets";
import { Profile } from "./Profile";
import { useCurrentBudget } from "@/hooks/useCurrentBudget";
import { useConnectionStatus } from "@triplit/react";
import { Badge } from "../ui/badge";
import { useTriplitClient } from "@/hooks/useTriplitClient";

export function Sidebar() {
  const { budget } = useCurrentBudget();
  const { client } = useTriplitClient();
  const status = useConnectionStatus(client);
  // TODO: move data fetching out of here
  return (
    <BaseSidebar>
      <SidebarHeader>
        <Budgets />
        <SidebarSection>
          <SidebarItem
            href="/$budgetId"
            params={{ budgetId: budget?.id }}
            disabled={!budget}
          >
            <WalletIcon />
            <SidebarLabel>Budget</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/accounts">
            <Square3Stack3DIcon />
            <SidebarLabel>All Accounts</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
      </SidebarHeader>
      <SidebarBody>
        <Accounts />
      </SidebarBody>
      <SidebarFooter className="space-y-3">
        {status === "CLOSED" && (
          <Badge className="justify-center">Working offline</Badge>
        )}
        <Profile />
      </SidebarFooter>
    </BaseSidebar>
  );
}
