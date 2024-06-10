import { describe, expect, it } from "vitest";
import { computeCurrentSnapshot } from "./computeCurrentSnapshot";

describe("computeCurrentSnapshot", () => {
    it("should calculate the correct snapshot when there are no transactions or assignments", () => {
        const currentDate = new Date("2022-01-01");

        const snapshot = computeCurrentSnapshot([], [], currentDate);

        expect(snapshot.assigned).toBe(0);
        expect(snapshot.activity).toBe(0);
        expect(snapshot.available).toBe(0);
    });

    it("should calculate the correct snapshot when there are transactions and assignments", () => {
        const transactions = [
            { id: "1", account_id: "1", category_id: "1", date: new Date(2022, 0, 1), amount: -100 },
            { id: "2", account_id: "1", category_id: "1", date: new Date(2022, 0, 10), amount: -200 },
            { id: "3", account_id: "1", category_id: "1", date: new Date(2022, 1, 1), amount: -300 },
        ];

        const assignments = [
            { id: "1", category_id: "1", amount: 500, month: 0, year: 2022 },
            { id: "2", category_id: "1", amount: 400, month: 1, year: 2022 },
        ];

        const currentDate = new Date("2022-02-05");

        const snapshot = computeCurrentSnapshot(transactions, assignments, currentDate);

        expect(snapshot.assigned).toBe(400);
        expect(snapshot.activity).toBe(-300);
        expect(snapshot.available).toBe(300);
    });

    // Add more test cases as needed
});