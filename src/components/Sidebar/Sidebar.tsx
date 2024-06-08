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

export function Sidebar() {
  const { budget } = useCurrentBudget();
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
      <SidebarFooter>
        <Profile />
      </SidebarFooter>
    </BaseSidebar>
  );
}
