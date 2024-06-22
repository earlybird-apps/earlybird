import { useQuery } from "@triplit/react";

import { client } from "@db/client";

import { EmptyState } from "./EmptyState";
import { TransactionTable } from "./TransactionTable";

export function AccountTransactions(props: { id: string }) {
  const { results: transactions, fetching } = useQuery(
    client,
    client
      .query("transactions")
      .include("account")
      .include("category")
      .where("account_id", "=", props.id),
  );

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
