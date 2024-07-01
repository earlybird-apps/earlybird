import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@triplit/react";
import { useMemo } from "react";

import { client } from "@db/client";

import { Currency } from "@/components/Currency";
import { EmptyState } from "@/components/EmptyState";
import { TransactionTable } from "@/components/TransactionTable";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { useTransactions } from "@/hooks/transactions";

export const Route = createFileRoute("/accounts/")({
  component: AllAccounts,
});

function AllAccounts() {
  const { results: accounts } = useQuery(client, client.query("accounts"));

  const totalBalance = useMemo(
    () =>
      Array.from(accounts?.values() || []).reduce(
        (acc, account) => acc + account.balance,
        0,
      ),

    [accounts],
  );

  const { results: transactions, fetching } = useTransactions();

  if (fetching) return <div>Loading...</div>;

  return (
    <>
      <div className="flex w-full flex-wrap items-end justify-between gap-4">
        <Heading>All Accounts</Heading>
        <Badge>
          <Currency className="text-lg" value={totalBalance} />
        </Badge>
      </div>
      {transactions && transactions.size > 0 ? (
        <TransactionTable
          includeAccount
          transactions={Array.from(transactions.values())}
        />
      ) : (
        <EmptyState
          title="No transactions"
          description="No accounts have transactions yet."
        />
      )}
    </>
  );
}
