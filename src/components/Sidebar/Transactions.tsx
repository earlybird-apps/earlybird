import { useTransactions } from "@/hooks/useTransactions";
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

export function Transactions() {
  const { budget } = useCurrentBudget();
  const { transactions, fetching } = useTransactions({
    budgetId: budget?.id,
    limit: 3,
    includeAccount: true,
  });

  return (
    <SidebarSection className="lg:border lg:rounded-xl lg:p-2 lg:bg-slate-50">
      <SidebarHeading>
        <span className="flex justify-between">
          Recent Transactions{" "}
          {fetching && <ArrowPathIcon className="w-3 animate-spin" />}
        </span>
      </SidebarHeading>
      {transactions?.map((transaction) => (
        <SidebarItem
          key={transaction.id}
          href="/account/$id"
          params={{ id: transaction.account_id }}
        >
          <div className="flex flex-col justify-between w-full align-middle gap-1">
            <div className="flex flex-row justify-between">
              <SidebarLabel>{transaction.account.name}</SidebarLabel>
              <Currency value={transaction.amount} className="" />
            </div>
            <span className="text-xs text-gray-600 ms-auto font-light">
              {transaction.date.toLocaleDateString()}
            </span>
          </div>
        </SidebarItem>
      ))}
      <SidebarItem>
        <SidebarLabel className="text-gray-700 text-xs">
          Add Transaction
        </SidebarLabel>
        <PlusIcon className="w-3 h-3" />
      </SidebarItem>
    </SidebarSection>
  );
}
