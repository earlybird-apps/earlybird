import { Square3Stack3DIcon, WalletIcon } from "@heroicons/react/24/outline";
import { useConnectionStatus } from "@triplit/react";

import { useTriplitClient } from "@/hooks/useTriplitClient";

import { Badge } from "../ui/badge";
import {
  Sidebar as BaseSidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "../ui/sidebar";
import { Accounts } from "./Accounts";
import { Profile } from "./Profile";
import { Transactions } from "./Transactions";

export function Sidebar() {
  const { client } = useTriplitClient();
  const status = useConnectionStatus(client);
  // TODO: move data fetching out of here
  return (
    <BaseSidebar>
      <SidebarHeader>
        <SidebarSection>
          <SidebarItem href="/budget">
            <WalletIcon />
            <SidebarLabel>Budget</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/accounts">
            <Square3Stack3DIcon />
            <SidebarLabel>Accounts</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
      </SidebarHeader>
      <SidebarBody>
        <Accounts />
        <Transactions />
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
