import { useQuery } from "@triplit/react";
import { client } from "@db/client";

interface QueryTransactionsProps {
  categoryId?: string;
  budgetId?: string;
  accountIds?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  includeAccount?: boolean;
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

  return useQuery(client, query);
};
