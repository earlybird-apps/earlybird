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
  const { results, fetching } = useAccounts({ budgetId: budget?.id });
  const accounts = Array.from(results?.values() || []);

  return (
    <SidebarSection>
      <SidebarHeading>
        <span className="flex justify-between">
          Accounts {fetching && <ArrowPathIcon className="w-3 animate-spin" />}
        </span>
      </SidebarHeading>
      {!fetching && accounts.length === 0 && (
        <SidebarItem disabled>
          <SidebarLabel>No accounts</SidebarLabel>
        </SidebarItem>
      )}
      {accounts.map((account) => (
        <SidebarItem
          key={account.id}
          href="/account/$id"
          params={{ id: account.id }}
        >
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
