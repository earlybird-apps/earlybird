import { ArrowPathIcon } from "@heroicons/react/16/solid";
import { PlusIcon } from "@heroicons/react/24/outline";

import { useAccounts } from "@/hooks/accounts";

import { Currency } from "../Currency";
import {
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "../ui/sidebar";

export function Accounts() {
  const { results: accounts, fetching } = useAccounts();

  return (
    <SidebarSection className="lg:rounded-xl lg:border lg:bg-slate-50 lg:p-2">
      <SidebarHeading>
        <span className="flex justify-between">
          Accounts {fetching && <ArrowPathIcon className="w-3 animate-spin" />}
        </span>
      </SidebarHeading>
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
      <SidebarItem>
        <SidebarLabel className="text-xs text-gray-700">
          Add Account
        </SidebarLabel>
        <PlusIcon className="h-3 w-3" />
      </SidebarItem>
    </SidebarSection>
  );
}
