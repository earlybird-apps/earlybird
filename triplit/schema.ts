import { ClientSchema, Schema as S } from "@triplit/client";

/**
 * Define your schema here.
 * For more information on schemas, see the docs: https://www.triplit.dev/docs/schemas
 */
export const schema = {
  budgets: {
    schema: S.Schema({
      id: S.Id(),
      name: S.String(),
      user_id: S.String(),
      categories: S.RelationMany("categories", {
        where: [["budget_id", "=", "$id"]],
      }),
    }),
    rules: {
      read: {
        "owner-is-user": {
          description: "Users can only view budgets they own",
          filter: [["user_id", "=", "$session.SESSION_USER_ID"]],
        },
      },
      write: {
        "owner-is-user": {
          description: "Users can only edit their own budgets",
          filter: [["user_id", "=", "$session.SESSION_USER_ID"]],
        },
      },
    },
  },
  accounts: {
    schema: S.Schema({
      id: S.Id(),
      name: S.String(),
      balance: S.Number({ default: 0 }),
      budget_id: S.String(),
      budget: S.RelationById("budgets", "$budget_id"),
      transactions: S.RelationMany("transactions", {
        where: [["account_id", "=", "$id"]],
      }),
    }),
    rules: {
      read: {
        "owner-is-user": {
          description: "Users can only view accounts they own",
          filter: [["budget.user_id", "=", "$session.SESSION_USER_ID"]],
        },
      },
      write: {
        "owner-is-user": {
          description: "Users can only edit their own accounts",
          filter: [["budget.user_id", "=", "$session.SESSION_USER_ID"]],
        },
      },
    },
  },
  transactions: {
    schema: S.Schema({
      id: S.Id(),
      amount: S.Number(),
      date: S.Date(),
      account_id: S.String(),
      memo: S.Optional(S.String()),
      account: S.RelationById("accounts", "$account_id"),
      category_id: S.Optional(S.String()),
      category: S.RelationById("categories", "$category_id"),
    }),
    rules: {
      read: {
        "owner-is-user": {
          description: "Users can only view transactions for accounts they own",
          filter: [["account.budget.user_id", "=", "$session.SESSION_USER_ID"]],
        },
      },
      write: {
        "owner-is-user": {
          description: "Users can only edit transactions for accounts they own",
          filter: [["account.budget.user_id", "=", "$session.SESSION_USER_ID"]],
        },
      },
    },
  },
  categories: {
    schema: S.Schema({
      id: S.Id(),
      name: S.String(),
      budget_id: S.String(),
      budget: S.RelationById("budgets", "$budget_id"),
      assigned: S.Number({ default: 0 }),
      activity: S.Number({ default: 0 }),
      system_code: S.String({ nullable: true, default: null }),
      transactions: S.RelationMany("transactions", {
        where: [["category_id", "=", "$id"]],
      }),
    }),
    rules: {
      read: {
        "owner-is-user": {
          description: "Users can only view categories for budgets they own",
          filter: [["budget.user_id", "=", "$session.SESSION_USER_ID"]],
        },
      },
      write: {
        "owner-is-user": {
          description: "Users can only edit categories for budgets they own",
          filter: [["budget.user_id", "=", "$session.SESSION_USER_ID"]],
        },
      },
    },
  },
} satisfies ClientSchema;
