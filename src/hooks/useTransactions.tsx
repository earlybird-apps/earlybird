import { useQuery } from "@triplit/react";
import { client } from "@db/client";
import { useMemo } from "react";
import { Transaction } from "@db/types";

interface QueryTransactionsProps {
  categoryId?: string;
  budgetId?: string;
  accountIds?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  includeAccount?: boolean;
  includeCategory?: boolean;
  limit?: number;
}

export const useTransactions = (props: QueryTransactionsProps) => {
  const query = client.query("transactions");

  if (props.categoryId) query.where("category_id", "=", props.categoryId);
  if (props.budgetId) query.where("account.budget_id", "=", props.budgetId);
  if (props.accountIds) query.where("account_id", "in", props.accountIds);
  if (props.limit) query.limit(props.limit);
  if (props.dateRange)
    query.where(
      ["date", ">=", props.dateRange.start],
      ["date", "<=", props.dateRange.end]
    );
  if (props.includeAccount === true) query.include("account");
  if (props.includeCategory === true) query.include("category");

  const { results, ...rest } = useQuery(client, query);

  const transactions: Transaction[] | undefined = useMemo(
    () => results && Array.from(results.values()),
    [results]
  );

  return {
    ...rest,
    results,
    transactions,
  };
};
