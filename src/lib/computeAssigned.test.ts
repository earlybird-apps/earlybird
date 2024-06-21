import { describe, expect, it } from "vitest";

import { computeAssigned } from "./computeAssigned";

describe("computeAssigned", () => {
  // assigned should equal
  // total assigned should equal the sum of all assignments before the given month, inclusive
  it("should compute assigned as the sum of all assignments in the given month", () => {
    const assignments = [
      {
        id: "1",
        category_id: "1",
        amount: 1,
        month: 1,
        year: 2024,
      },
      {
        id: "2",
        category_id: "1",
        amount: 1,
        month: 1,
        year: 2024,
      },
      {
        id: "3",
        category_id: "1",
        amount: 1,
        month: 1,
        year: 2024,
      },
    ];
    expect(computeAssigned(assignments, { month: 1, year: 2024 })).toEqual({
      givenMonth: 3,
      total: 3,
    });
  });

  it("should compute total assigned as the sum of all assignments in or before the given months", () => {
    const assignments = [
      {
        id: "1",
        category_id: "1",
        amount: 1,
        month: 0,
        year: 2024,
      },
      {
        id: "2",
        category_id: "1",
        amount: 1,
        month: 1,
        year: 2024,
      },
      {
        id: "3",
        category_id: "1",
        amount: 1,
        month: 2,
        year: 2024,
      },
    ];
    expect(computeAssigned(assignments, { month: 2, year: 2024 })).toEqual({
      givenMonth: 1,
      total: 3,
    });
  });

  it("should return values of 0 when given an empty array, ", () => {
    expect(computeAssigned([], { month: 1, year: 2024 })).toEqual({
      givenMonth: 0,
      total: 0,
    });
  });

  it("should return values of 0 when all assignments are after the given date", () => {
    const assignments = [
      {
        id: "1",
        category_id: "1",
        amount: 500,
        month: 2,
        year: 2024,
      },
      {
        id: "2",
        category_id: "1",
        amount: 400,
        month: 3,
        year: 2024,
      },
      {
        id: "3",
        category_id: "1",
        amount: 300,
        month: 4,
        year: 2024,
      },
    ];
    expect(computeAssigned(assignments, { month: 1, year: 2024 })).toEqual({
      givenMonth: 0,
      total: 0,
    });
  });

  it("should ignore assignments that are after the given date", () => {
    const assignments = [
      {
        id: "1",
        category_id: "1",
        amount: 500,
        month: 2,
        year: 2024,
      },
      {
        id: "2",
        category_id: "1",
        amount: 400,
        month: 3,
        year: 2024,
      },
      {
        id: "3",
        category_id: "1",
        amount: 300,
        month: 4,
        year: 2024,
      },
      {
        id: "4",
        category_id: "1",
        amount: 10,
        month: 1,
        year: 2024,
      },
      {
        id: "5",
        category_id: "1",
        amount: 10,
        month: 0,
        year: 2024,
      },
    ];
    expect(computeAssigned(assignments, { month: 1, year: 2024 })).toEqual({
      givenMonth: 10,
      total: 20,
    });
  });

  it("should return a value for total assignment and 0 for the givenMonth when all assignments predate the givenMonth", () => {
    const assignments = [
      {
        id: "1",
        category_id: "1",
        amount: 1,
        month: 0,
        year: 2024,
      },
      {
        id: "2",
        category_id: "1",
        amount: 1,
        month: 0,
        year: 2024,
      },
      {
        id: "3",
        category_id: "1",
        amount: 1,
        month: 0,
        year: 2024,
      },
    ];
    expect(computeAssigned(assignments, { month: 1, year: 2024 })).toEqual({
      givenMonth: 0,
      total: 3,
    });
  });

  it("should return negative values for assignments when all values are negative", () => {
    const assignments = [
      {
        id: "1",
        category_id: "1",
        amount: -1,
        month: 0,
        year: 2024,
      },
      {
        id: "2",
        category_id: "1",
        amount: -1,
        month: 1,
        year: 2024,
      },
      {
        id: "3",
        category_id: "1",
        amount: -1,
        month: 1,
        year: 2024,
      },
    ];
    expect(computeAssigned(assignments, { month: 1, year: 2024 })).toEqual({
      givenMonth: -2,
      total: -3,
    });
  });

  it("should return negative values for assignments when negative values sum greater than positive ones", () => {
    const assignments = [
      {
        id: "1",
        category_id: "1",
        amount: -1,
        month: 0,
        year: 2024,
      },
      {
        id: "2",
        category_id: "1",
        amount: 1,
        month: 1,
        year: 2024,
      },
      {
        id: "3",
        category_id: "1",
        amount: -2,
        month: 1,
        year: 2024,
      },
    ];
    expect(computeAssigned(assignments, { month: 1, year: 2024 })).toEqual({
      givenMonth: -1,
      total: -2,
    });
  });
});
