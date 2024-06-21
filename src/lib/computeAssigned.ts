import { isBefore, isSameMonth } from "date-fns";

import { Assignment } from "@db/types";

type ComputedAssignment = {
  givenMonth: number;
  total: number;
};

type DateOptions = {
  month: number;
  year: number;
};

export const computeAssigned = (
  assignments: Assignment[],
  dateOptions: DateOptions,
): ComputedAssignment => {
  if (assignments.length === 0) return { givenMonth: 0, total: 0 };

  const targetMonth = new Date(dateOptions.year, dateOptions.month, 1);
  let monthAssignment = 0;
  let totalAssignment = 0;

  assignments.forEach(({ month, year, amount }) => {
    const assignmentDate = new Date(year, month, 1);
    if (isSameMonth(assignmentDate, targetMonth)) {
      monthAssignment += amount;
      totalAssignment += amount;
    } else if (isBefore(assignmentDate, targetMonth)) {
      totalAssignment += amount;
    }
  });

  return { givenMonth: monthAssignment, total: totalAssignment };
};
