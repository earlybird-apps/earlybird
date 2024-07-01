import { PlusCircleIcon, WalletIcon } from "@heroicons/react/20/solid";
import { useConnectionStatus } from "@triplit/react";

import { Dialogs } from "@/constants";
import { useTriplitClient } from "@/hooks/useTriplitClient";

import { Badge } from "../ui/badge";
import {
  Sidebar as BaseSidebar,
  SidebarBody,
  SidebarDivider,
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
  return (
    <BaseSidebar>
      <SidebarHeader>
        <SidebarSection>
          <SidebarItem href="/budget">
            <WalletIcon />
            <SidebarLabel>Budget</SidebarLabel>
          </SidebarItem>
          <SidebarItem
            href=""
            search={(prev) => ({ ...prev, dialog: Dialogs.NewTransaction })}
          >
            <PlusCircleIcon />
            <SidebarLabel>Transaction</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
      </SidebarHeader>
      <SidebarBody>
        <Accounts />
        <SidebarDivider />
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
