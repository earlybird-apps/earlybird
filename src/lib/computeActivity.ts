import { Transaction } from "@db/types";
import { isBefore, isSameMonth, lastDayOfMonth } from "date-fns";


type ComputedActivity = {
    givenMonth: number,
    total: number,
};


type DateOptions = {
    targetMonth: number,
    targetYear: number,
    limitDate: Date,
}

export const computeActivity = (transactions: Pick<Transaction, "date" | "amount">[], dateOptions: DateOptions): ComputedActivity => {
    if (transactions.length === 0) return { total: 0, givenMonth: 0 };

    const targetDate = lastDayOfMonth(new Date(dateOptions.targetYear, dateOptions.targetMonth, 1));
    let monthActivity = 0;
    let totalActivity = 0;
    transactions.forEach(({ date, amount }) => {
        if (date > dateOptions.limitDate) return;
        // Now we can safely assume that date is on or before the limit date
        if (isSameMonth(date, targetDate)) {
            monthActivity += amount;
            totalActivity += amount;
        } else if (isBefore(date, targetDate)) {
            totalActivity += amount;
        }
    });

    return {
        total: totalActivity,
        givenMonth: monthActivity,
    }
}