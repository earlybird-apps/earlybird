import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@triplit/react";

import { client } from "@db/client";

import { EmptyState } from "@/components/EmptyState";
import { TransactionTable } from "@/components/TransactionTable";

export const Route = createFileRoute("/accounts/")({
  component: AllAccounts,
});

function AllAccounts() {
  const { results: transactions, fetching } = useQuery(
    client,
    client.query("transactions").include("account").include("category"),
  );

  if (fetching) return <div>Loading...</div>;

  return transactions && transactions.size > 0 ? (
    <TransactionTable
      includeAccount
      transactions={Array.from(transactions.values())}
    />
  ) : (
    <EmptyState
      title="No transactions"
      description="No accounts have transactions yet."
    />
  );
}
