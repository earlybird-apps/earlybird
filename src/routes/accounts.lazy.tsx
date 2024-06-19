import { Currency } from "@/components/Currency";
import { EmptyState } from "@/components/EmptyState";
import { TransactionTable } from "@/components/TransactionTable";
import { Divider } from "@/components/ui/divider";
import { Heading, Subheading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { useAccounts } from "@/hooks/useAccounts";
import { useCurrentBudget } from "@/hooks/useCurrentBudget";
import { useTransactions } from "@/hooks/useTransactions";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createLazyFileRoute("/accounts")({
  component: Accounts,
});

function Accounts() {
  const { budget } = useCurrentBudget();
  const { results: accounts } = useAccounts({ budgetId: budget?.id });
  const { results: transactions } = useTransactions({ budgetId: budget?.id });

  const totalBalance = useMemo(() => {
    return accounts
      ? Array.from(accounts.values())?.reduce(
          (acc, account) => acc + account.balance,
          0
        )
      : undefined;
  }, [accounts]);

  return (
    <div className="gap-y-8 flex flex-col">
      <div className="flex flex-col gap-y-2">
        <Heading>Accounts</Heading>
        {totalBalance && (
          <div className="text-sm text-gray-700">
            <span className="uppercase">Total Balance:</span>{" "}
            <Currency value={totalBalance} />
          </div>
        )}
        {accounts && accounts.size === 0 && (
          <EmptyState
            title="No accounts"
            description="Get started by adding a new account."
            buttonText="New Account"
          />
        )}
        {accounts && accounts.size > 0 && (
          <ul role="list">
            {Array.from(accounts).map(([id, account]) => (
              <Link key={id} href="/account/$id" params={{ id }}>
                <li className="p-3 sm:px-0 flex justify-between">
                  <span>{account.name}</span>
                  <Currency value={account.balance} />
                </li>
              </Link>
            ))}
          </ul>
        )}
        <Divider />
      </div>
      {transactions && transactions.size > 0 && (
        <div>
          <Subheading>Transactions</Subheading>
          <TransactionTable
            includeAccount
            transactions={Array.from(transactions.values())}
          />
        </div>
      )}
    </div>
  );
}
