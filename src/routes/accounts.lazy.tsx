import { createLazyFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

import { Currency } from "@/components/Currency";
import { EmptyState } from "@/components/EmptyState";
import { TransactionTable } from "@/components/TransactionTable";
import { Divider } from "@/components/ui/divider";
import { Heading, Subheading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { useAccounts } from "@/hooks/useAccounts";
import { useTransactions } from "@/hooks/useTransactions";

export const Route = createLazyFileRoute("/accounts")({
  component: Accounts,
});

function Accounts() {
  const { results: accounts } = useAccounts();
  const { results: transactions } = useTransactions();

  const totalBalance = useMemo(() => {
    return accounts
      ? Array.from(accounts.values())?.reduce(
          (acc, account) => acc + account.balance,
          0,
        )
      : undefined;
  }, [accounts]);

  return (
    <div className="flex flex-col gap-y-8">
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
                <li className="flex justify-between p-3 sm:px-0">
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
