import { ArrowPathIcon } from "@heroicons/react/16/solid";
import { PlusIcon } from "@heroicons/react/24/outline";

import { useTransactions } from "@/hooks/useTransactions";

import { Currency } from "../Currency";
import {
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "../ui/sidebar";

export function Transactions() {
  const { results, fetching } = useTransactions({
    limit: 3,
    includeAccount: true,
  });

  return (
    <SidebarSection className="lg:rounded-xl lg:border lg:bg-slate-50 lg:p-2">
      <SidebarHeading>
        <span className="flex justify-between">
          Recent Transactions{" "}
          {fetching && <ArrowPathIcon className="w-3 animate-spin" />}
        </span>
      </SidebarHeading>
      {results &&
        Array.from(results.values()).map((transaction) => (
          <SidebarItem
            key={transaction.id}
            href="/account/$id"
            params={{ id: transaction.account_id }}
          >
            <div className="flex w-full flex-col justify-between gap-1 align-middle">
              <div className="flex flex-row justify-between">
                <SidebarLabel>{transaction.account?.name}</SidebarLabel>
                <Currency value={transaction.amount} className="" />
              </div>
              <span className="ms-auto text-xs font-light text-gray-600">
                {transaction.date.toLocaleDateString()}
              </span>
            </div>
          </SidebarItem>
        ))}
      <SidebarItem>
        <SidebarLabel className="text-xs text-gray-700">
          Add Transaction
        </SidebarLabel>
        <PlusIcon className="h-3 w-3" />
      </SidebarItem>
    </SidebarSection>
  );
}
