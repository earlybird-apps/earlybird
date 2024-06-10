import { useQuery } from "@triplit/react";
import { client } from "@db/client";
import { lastDayOfMonth } from "date-fns";

interface QueryTransactionsProps {
  categoryId: string;
  month: number;
  year: number;
}

export const useTransactions = (props: QueryTransactionsProps) => {
  const startOfMonth = new Date(props.year, props.month, 1);
  const endOfMonth = lastDayOfMonth(startOfMonth);
  return useQuery(
    client,
    client
      .query("transactions")
      .where("category_id", "=", props.categoryId)
      .where(["date", ">=", startOfMonth], ["date", "<=", endOfMonth])
  );
};
