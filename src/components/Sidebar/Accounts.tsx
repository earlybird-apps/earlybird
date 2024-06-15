import { useAccounts } from "@/hooks/useAccounts";
import { ArrowPathIcon } from "@heroicons/react/16/solid";
import {
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "../ui/sidebar";
import { useCurrentBudget } from "@/hooks/useCurrentBudget";
import { Currency } from "../Currency";
import { PlusIcon } from "@heroicons/react/24/outline";

export function Accounts() {
  const { budget } = useCurrentBudget();
  const { results: accounts, fetching } = useAccounts({ budgetId: budget?.id });

  return (
    <SidebarSection className="lg:border lg:rounded-xl lg:p-2 lg:bg-slate-50">
      <SidebarHeading>
        <span className="flex justify-between">
          Accounts {fetching && <ArrowPathIcon className="w-3 animate-spin" />}
        </span>
      </SidebarHeading>
      {accounts &&
        Array.from(accounts).map(([id, account]) => (
          <SidebarItem key={id} href="/account/$id" params={{ id: account.id }}>
            <SidebarLabel>{account.name}</SidebarLabel>
            <Currency value={account.balance} className="ms-auto" />
          </SidebarItem>
        ))}
      <SidebarItem>
        <SidebarLabel className="text-gray-700 text-xs">
          Add Account
        </SidebarLabel>
        <PlusIcon className="w-3 h-3" />
      </SidebarItem>
    </SidebarSection>
  );
}
