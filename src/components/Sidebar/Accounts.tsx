import { useAccounts } from "@/hooks/useAccounts";
import { ArrowPathIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { SidebarHeading, SidebarItem } from "../ui/sidebar";
import { useCurrentBudget } from "@/hooks/useCurrentBudget";
import { Currency } from "../Currency";

export function Accounts() {
  const { budget } = useCurrentBudget();
  const { results, fetching } = useAccounts({ budgetId: budget?.id });
  const accounts = Array.from(results?.values() || []);

  return (
    <>
      <SidebarHeading>
        <span className="flex justify-between">
          Accounts{" "}
          <ArrowPathIcon
            className={clsx(fetching ? "w-3 animate-spin" : "hidden")}
          />
        </span>
      </SidebarHeading>
      {!fetching && accounts.length === 0 && (
        <SidebarItem disabled>No accounts</SidebarItem>
      )}
      {accounts.map((account) => (
        <SidebarItem
          key={account.id}
          href="/account/$id"
          params={{ id: account.id }}
        >
          <span>{account.name}</span>
          <Currency value={account.balance} className="ms-auto" />
        </SidebarItem>
      ))}
    </>
  );
}
