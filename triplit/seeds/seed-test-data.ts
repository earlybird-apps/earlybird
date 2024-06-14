import { BulkInsert } from "@triplit/client";
import { schema } from "../schema.js";

const user = {
  id: "n9Q5Hkks3OCuLDQAtI0IV",
  name: "Nick",
};

export default function seed(): BulkInsert<typeof schema> {
  return {
    users: [user],
    budgets: [{
      id: "1",
      name: "Slow Growth",
      user_id: user.id,
    }, {
      id: "2",
      name: "Empty",
      user_id: user.id,
    }],
    accounts: [{
      id: "1",
      name: "Checking",
      balance: 1000,
      budget_id: "1",
    },
    {
      id: "2",
      name: "Savings",
      balance: 5000,
      budget_id: "1",
    }],
    transactions: [{
      amount: 1200,
      account_id: "1",
      category_id: "1",
      date: new Date(2024, 5, 1),
      memo: "Initial deposit"
    },
    {
      amount: -200,
      account_id: "1",
      category_id: "1",
      date: new Date(2024, 5, 6),
      memo: "Trader Joe's"
    },
    {
      amount: 4000,
      account_id: "2",
      category_id: "2",
      date: new Date(2024, 5, 1),
      memo: "Initial deposit"
    },
    {
      amount: 1000,
      account_id: "2",
      category_id: "2",
      date: new Date(2024, 5, 8),
      memo: "Return of funds"
    }],
    categories: [{
      id: "1",
      name: "Groceries",
      budget_id: "1",
    },
    {
      id: "2",
      name: "Utilities",
      budget_id: "1",
    },
    {
      id: "3",
      name: "Savings",
      budget_id: "1",
    }],
    assignments: [{
      category_id: "1",
      amount: 80,
      month: 5,
      year: 2024,
    },
    {
      category_id: "2",
      amount: 100,
      month: 5,
      year: 2024,
    },
    {
      category_id: "3",
      amount: 500,
      month: 5,
      year: 2024,
    }],
  };
}
