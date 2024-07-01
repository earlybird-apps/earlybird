import { useTransactions } from "@/hooks/transactions";

import { EmptyState } from "./EmptyState";
import { TransactionTable } from "./TransactionTable";

export function AccountTransactions(props: { id: string }) {
  const { results: transactions, fetching } = useTransactions({
    accountIds: [props.id],
  });

  if (fetching) return <div>Loading...</div>;

  return transactions && transactions.size > 0 ? (
    <TransactionTable transactions={Array.from(transactions.values())} />
  ) : (
    <EmptyState
      title="No transactions"
      description="This account has no transactions yet."
    />
  );
}
