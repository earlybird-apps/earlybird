import { useMemo } from "react";

import { computeActivity } from "@/lib/computeActivity";
import { computeAssigned } from "@/lib/computeAssigned";

import { useAssignments } from "./useAssignments";
import { useTransactions } from "./useTransactions";

interface QuerySnapshotProps {
  categoryId: string;
  month: number;
  year: number;
  currentDate: Date;
}

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
      available: (totalAssigned ?? 0) + (totalActivity ?? 0),
    },
  };
};
