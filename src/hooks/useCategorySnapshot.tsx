import { client } from "@db/client";
import { useMemo } from "react";
import { and, or } from "@triplit/db";

import { computeAssigned } from "@/lib/computeAssigned";
import { computeActivity } from "@/lib/computeActivity";
import { useTransactions } from "./useTransactions";
import { useQuery } from "@triplit/react";

interface QuerySnapshotProps {
  categoryId: string;
  month: number;
  year: number;
  currentDate: Date;
}

const useAssignments = (props: {
  categoryId: string;
  year: number;
  month: number;
}) => {
  const assignmentQuery = client
    .query("assignments")
    .where("category_id", "=", props.categoryId)
    .where(
      or([
        ["year", "<", props.year],
        and([
          ["year", "=", props.year],
          ["month", "<=", props.month],
        ]),
      ])
    );

  return useQuery(client, assignmentQuery);
};

export const useCategorySnapshot = ({
  month,
  year,
  categoryId,
  currentDate,
}: QuerySnapshotProps) => {
  const { results: transactions, fetching: fetchingTransactions } =
    useTransactions({
      categoryId,
      dateRange: { end: currentDate },
    });

  const { results: assignments, fetching: fetchingAssignments } =
    useAssignments({
      categoryId,
      year,
      month,
    });

  const { givenMonth: activity, total: totalActivity } = useMemo(() => {
    if (!transactions) return { givenMonth: undefined, total: undefined };
    return computeActivity(Array.from(transactions.values()), {
      targetYear: year,
      targetMonth: month,
      limitDate: currentDate,
    });
  }, [transactions, month, year, currentDate]);

  const { givenMonth: assigned, total: totalAssigned } = useMemo(() => {
    if (!assignments) return { givenMonth: undefined, total: undefined };
    return computeAssigned(Array.from(assignments.values()), {
      year,
      month,
    });
  }, [assignments, month, year]);

  return {
    fetching: fetchingTransactions || fetchingAssignments,
    snapshot: {
      assigned: assigned,
      activity: activity,
      available:
        totalActivity && totalAssigned
          ? totalAssigned + totalActivity
          : undefined,
    },
  };
};
