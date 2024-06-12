import { client } from "@db/client";
import { useEffect, useState } from "react";
import { and, or } from "@triplit/db";
import { CategorySnapshot } from "@/types";
import { Assignment, Transaction } from "@db/types";

import { computeAssigned } from "@/lib/computeAssigned";
import { computeActivity } from "@/lib/computeActivity";

interface QuerySnapshotProps {
  categoryId: string;
  month: number;
  year: number;
  currentDate: Date;
}

const fetchTransactions = (props: {
  categoryId: string;
  currentDate: Date;
}) => {
  const transactionQuery = client
    .query("transactions")
    .where("category_id", "=", props.categoryId)
    .where("date", "<=", props.currentDate);

  return client.fetch(transactionQuery.build());
};

const fetchAssignments = (props: {
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

  return client.fetch(assignmentQuery.build());
};

export const useCategorySnapshot = ({
  month,
  year,
  categoryId,
  currentDate,
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
      available: computedAssignments.total + computedActivity.total,
    });
    setLoading(false);
  }, [transactions, assignments, month, year, currentDate]);

  useEffect(() => {
    if (!year || !month || !currentDate || !categoryId) return;

    setLoading(true);

    const transactionPromise = fetchTransactions({ categoryId, currentDate });
    const assignmentPromise = fetchAssignments({ categoryId, year, month });

    Promise.all([transactionPromise, assignmentPromise]).then(
      ([resTransactions, resAssignments]) => {
        setTransactions(Array.from(resTransactions?.values()));
        setAssignments(Array.from(resAssignments?.values()));
      }
    );
  }, [categoryId, year, month, currentDate]);

  return {
    loading,
    snapshot,
  };
};
