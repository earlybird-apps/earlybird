import { endOfMonth, isSameMonth } from "date-fns";
import { Assignment, Transaction } from "@db/types";

export function computeCurrentSnapshot(
    transactions: Transaction[],
    assignments: Assignment[],
    currentDate: Date
) {
    let monthAssigned = 0;
    let monthActivity = 0;
    let totalSpend = 0;
    let totalAssigned = 0;

    transactions.forEach(({ date, amount }) => {
        console.log("checking", date, amount, currentDate)
        console.log("is before or same", date <= currentDate)
        console.log("is same month", isSameMonth(date, currentDate))
        // if <= current date, add to totalSpend
        if (date <= currentDate) totalSpend += amount;
        // if in the month, add to activity
        if (date <= currentDate && isSameMonth(date, currentDate)) monthActivity += amount;

    });

    assignments.forEach(({ amount, month, year }) => {
        const assignmentDate = new Date(year, month, 1);
        if (isSameMonth(assignmentDate, currentDate)) monthAssigned += amount;
        if (assignmentDate <= endOfMonth(currentDate)) totalAssigned += amount;
    });

    return {
        assigned: monthAssigned,
        activity: monthActivity,
        available: totalSpend + totalAssigned,
    }
}
