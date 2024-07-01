import { PlusIcon } from "@heroicons/react/24/outline";

import { Dialogs } from "@/constants";
import { useAccounts } from "@/hooks/accounts";

import { Currency } from "../Currency";
import { SidebarItem, SidebarLabel, SidebarSection } from "../ui/sidebar";

export function Accounts() {
  const { results: accounts } = useAccounts();

  return (
    <SidebarSection className="lg:rounded-xl lg:border lg:bg-slate-50 lg:p-2">
      <SidebarItem href="/accounts" activeOptions={{ exact: true }}>
        <SidebarLabel className="font-semibold">All Accounts</SidebarLabel>
      </SidebarItem>
      {accounts &&
        Array.from(accounts).map(([id, account]) => (
          <SidebarItem
            key={id}
            href="/accounts/$id"
            params={{ id: account.id }}
          >
            <SidebarLabel>{account.name}</SidebarLabel>
            <Currency value={account.balance} className="ms-auto" />
          </SidebarItem>
        ))}
      <SidebarItem
        href=""
        search={(prev) => ({ ...prev, dialog: Dialogs.NewAccount })}
      >
        <SidebarLabel className="text-xs text-gray-700">
          Add Account
        </SidebarLabel>
        <PlusIcon className="h-3 w-3" />
      </SidebarItem>
    </SidebarSection>
  );
}
