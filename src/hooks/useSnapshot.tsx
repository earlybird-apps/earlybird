// TODO: This is veeeery similar to useCategorySnapshot. DRY out some stuff
import { client } from "@db/client";
import { useEffect, useState } from "react";
import { and, or } from "@triplit/db";
import { CategorySnapshot } from "@/types";
import { Assignment, Transaction } from "@db/types";

import { computeAssigned } from "@/lib/computeAssigned";
import { computeActivity } from "@/lib/computeActivity";

interface QuerySnapshotProps {
  month: number;
  year: number;
  currentDate: Date;
  budgetId: string;
}

// TODO: Enforce Budget accounts!
const fetchTransactions = (props: { currentDate: Date; budgetId: string }) => {
  const transactionQuery = client
    .query("transactions")
    .where("date", "<=", props.currentDate)
    .where("account.budget_id", "=", "$query.budgetId")
    .vars({ budgetId: props.budgetId });

  return client.fetch(transactionQuery.build());
};

// TODO: Enforce Budget accounts!
const fetchAssignments = (props: {
  year: number;
  month: number;
  budgetId: string;
}) => {
  const assignmentQuery = client
    .query("assignments")
    .where(
      or([
        ["year", "<", props.year],
        and([
          ["year", "=", props.year],
          ["month", "<=", props.month],
        ]),
      ])
    )
    .where("category.budget_id", "=", "$query.budgetId")
    .vars({ budgetId: props.budgetId });

  return client.fetch(assignmentQuery.build());
};

export const useSnapshot = ({
  month,
  year,
  currentDate,
  budgetId,
}: QuerySnapshotProps) => {
  const [loading, setLoading] = useState(true);
  const [snapshot, setSnapshot] = useState<CategorySnapshot | undefined>(
    undefined
  );
  const [transactions, setTransactions] = useState<Transaction[]>();
  const [assignments, setAssignments] = useState<Assignment[]>();

  useEffect(() => {
    if (!transactions || !assignments || !year || !month || !currentDate)
      return;

    const computedAssignments = computeAssigned(assignments, { year, month });
    const computedActivity = computeActivity(transactions, {
      targetYear: year,
      targetMonth: month,
      limitDate: currentDate,
    });
    setSnapshot({
      assigned: computedAssignments.givenMonth,
      activity: computedActivity.givenMonth,
      available: computedActivity.total - computedAssignments.total,
    });
    setLoading(false);
  }, [transactions, assignments, month, year, currentDate]);

  useEffect(() => {
    if (!year || !month || !currentDate) return;

    setLoading(true);

    const transactionPromise = fetchTransactions({ currentDate, budgetId });
    const assignmentPromise = fetchAssignments({ year, month, budgetId });

    Promise.all([transactionPromise, assignmentPromise]).then(
      ([resTransactions, resAssignments]) => {
        setTransactions(Array.from(resTransactions?.values()));
        setAssignments(Array.from(resAssignments?.values()));
      }
    );
  }, [year, month, currentDate, budgetId]);

  return {
    loading,
    snapshot,
  };
};
