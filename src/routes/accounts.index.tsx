import { createFileRoute } from "@tanstack/react-router";

import { EmptyState } from "@/components/EmptyState";
import { TransactionTable } from "@/components/TransactionTable";
import { useTransactions } from "@/hooks/transactions";

export const Route = createFileRoute("/accounts/")({
  component: AllAccounts,
});

function AllAccounts() {
  const { results: transactions, fetching } = useTransactions();

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
