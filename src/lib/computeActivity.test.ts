import { describe, expect, it } from "vitest";
import { computeActivity } from "./computeActivity";

describe("computeActivity", () => {
    describe("alwayts", () => {
        it("should return values of 0 when the transactions array is empty", () => {
            expect(computeActivity([], { targetMonth: 0, targetYear: 2024, limitDate: new Date() })).toEqual({ givenMonth: 0, total: 0 });
        });

        it("should ignore transactions dated after the limit date", () => {
            const transactions = [{
                id: "1",
                account_id: "1",
                category_id: "1",
                date: new Date(2022, 1, 1),
                amount: 1,
            }, {
                id: "2",
                account_id: "1",
                category_id: "1",
                date: new Date(2022, 2, 1),
                amount: 1,
            }, {
                id: "3",
                account_id: "1",
                category_id: "1",
                date: new Date(2022, 3, 1),
                amount: 1,
            }];
            expect(computeActivity(transactions, { targetMonth: 2, targetYear: 2022, limitDate: new Date(2022, 2, 10) })).toEqual({ givenMonth: 1, total: 2 });
        });

        it("should return values of 0 when all transactions are dated after the limit date", () => {
            const transactions = [{
                id: "1",
                account_id: "1",
                category_id: "1",
                date: new Date(2022, 2, 1),
                amount: -100,
            }, {
                id: "2",
                account_id: "1",
                category_id: "1",
                date: new Date(2022, 3, 1),
                amount: -200,
            }, {
                id: "3",
                account_id: "1",
                category_id: "1",
                date: new Date(2022, 4, 1),
                amount: -300,
            }];
            expect(computeActivity(transactions, { targetMonth: 1, targetYear: 2022, limitDate: new Date(2022, 1, 1) })).toEqual({ givenMonth: 0, total: 0 });
        });
    });

    describe("target date is the same month as the limit date (current month)", () => {
        const targetMonth = 2;
        const targetYear = 2022;
        const limitDate = new Date(targetYear, targetMonth, 30);
        const dateOptions = { targetYear, targetMonth, limitDate };
        it("should sum transactions on the same day as the limit date", () => {
            const transactions = [{
                id: "1",
                account_id: "1",
                category_id: "1",
                date: limitDate,
                amount: 1,
            }, {
                id: "2",
                account_id: "1",
                category_id: "1",
                date: limitDate,
                amount: 1,
            }, {
                id: "3",
                account_id: "1",
                category_id: "1",
                date: limitDate,
                amount: 1,
            }];

            expect(computeActivity(transactions, dateOptions)).toEqual({ givenMonth: 3, total: 3 });
        });

        it("should compute givenMonth activity as the sum of transactions in the given month but before the limit date", () => {
            const transactions = [{
                id: "1",
                account_id: "1",
                category_id: "1",
                date: new Date(targetYear, targetMonth, 1),
                amount: 1,
            }, {
                id: "2",
                account_id: "1",
                category_id: "1",
                date: new Date(targetYear, targetMonth, 10),
                amount: 1,
            }, {
                id: "3",
                account_id: "1",
                category_id: "1",
                date: new Date(targetYear, targetMonth + 1, 20),
                amount: 1,
            }];
            expect(computeActivity(transactions, dateOptions)).toMatchObject({ givenMonth: 2 });
        });

        it("should compute givenMonth activity 0 when all transactions are dated after the limit date", () => {
            const transactions = [{
                id: "1",
                account_id: "1",
                category_id: "1",
                date: new Date(targetYear, targetMonth, 31),
                amount: 1,
            }, {
                id: "2",
                account_id: "1",
                category_id: "1",
                date: new Date(targetYear, targetMonth, 31),
                amount: 1,
            }, {
                id: "3",
                account_id: "1",
                category_id: "1",
                date: new Date(targetYear, targetMonth, 31),
                amount: 1,
            }];
            expect(computeActivity(transactions, dateOptions)).toMatchObject({ givenMonth: 0 });
        });

        it("should compute total activity as the sum of transactions in or before the given month but before or onthe limit date", () => {
            const transactions = [{
                id: "1",
                account_id: "1",
                category_id: "1",
                date: new Date(targetYear, targetMonth, 1),
                amount: 1,
            }, {
                id: "2",
                account_id: "1",
                category_id: "1",
                date: new Date(targetYear, targetMonth - 1, 10),
                amount: 1,
            }, {
                id: "3",
                account_id: "1",
                category_id: "1",
                date: new Date(targetYear, targetMonth + 1, 20),
                amount: 1,
            }];
            expect(computeActivity(transactions, dateOptions)).toMatchObject({ total: 2 });
        });
    });

    describe("target date is before the limit date (previous month)", () => {
        const targetMonth = 2;
        const targetYear = 2022;
        const limitDate = new Date(targetYear, targetMonth + 1, 30);
        const dateOptions = { targetYear, targetMonth, limitDate };

        it("should only sum transactions in the given month", () => {
            const transactions = [{
                id: "1",
                account_id: "1",
                category_id: "1",
                date: new Date(targetYear, targetMonth - 1, 1),
                amount: 1,
            }, {
                id: "2",
                account_id: "1",
                category_id: "1",
                date: new Date(targetYear, targetMonth, 10),
                amount: 1,
            }, {
                id: "3",
                account_id: "1",
                category_id: "1",
                date: limitDate,
                amount: 1,
            }];

            expect(computeActivity(transactions, dateOptions)).toEqual({ givenMonth: 1, total: 2 });
        });
    });

    describe("target date is after the limit date (future month)", () => {
        const targetMonth = 2;
        const targetYear = 2022;
        const limitDate = new Date(targetYear, targetMonth - 1, 20);
        const dateOptions = { targetYear, targetMonth, limitDate };

        it("should return activity of 0 for the given month", () => {
            const transactions = [{
                id: "1",
                account_id: "1",
                category_id: "1",
                date: new Date(targetYear, targetMonth, 1),
                amount: 1,
            }, {
                id: "2",
                account_id: "1",
                category_id: "1",
                date: new Date(targetYear, targetMonth, 10),
                amount: 1,
            }, {
                id: "3",
                account_id: "1",
                category_id: "1",
                date: limitDate,
                amount: 1,
            }];

            expect(computeActivity(transactions, dateOptions)).toMatchObject({ givenMonth: 0 });
        });

        it("should return total activity summing only up to the limit date", () => {
            const transactions = [{
                id: "1",
                account_id: "1",
                category_id: "1",
                date: new Date(targetYear, targetMonth, 1),
                amount: 1,
            }, {
                id: "2",
                account_id: "1",
                category_id: "1",
                date: new Date(targetYear, targetMonth, 10),
                amount: 1,
            }, {
                id: "3",
                account_id: "1",
                category_id: "1",
                date: limitDate,
                amount: 1,
            }];

            expect(computeActivity(transactions, dateOptions)).toMatchObject({ total: 1 });
        });
    });

});

/*
when computing historical info
activity should equal the sum of all transactions in the given month
total activity should equal the sum of all transactions before the given month, inclusive
---

when computing current info
activity should equal the sum of all transactions in the given month and before the current date
total activity should equal the sum of all transactions before the current date, inclusive
---

when computing future info
activity should equal the sum of all transactions in the given month and before the current date (which should be 0 for future months, logically)
total activity should equal the sum of all transactions before the current date, inclusive
*/

