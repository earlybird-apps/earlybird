import { Square3Stack3DIcon } from "@heroicons/react/24/outline";
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

export function Sidebar() {
  return (
    <BaseSidebar>
      <SidebarHeader>
        <Budgets />
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
      <SidebarFooter>
        <Profile />
      </SidebarFooter>
    </BaseSidebar>
  );
}
