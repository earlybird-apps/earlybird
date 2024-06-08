import { Schema as S, ClientSchema } from '@triplit/client';

/**
 * Define your schema here.
 * For more information on schemas, see the docs: https://www.triplit.dev/docs/schemas
 */
export const schema = {
  users: {
    schema: S.Schema({
      id: S.Id(),
      name: S.String(),
    }),
  },
  budgets: {
    schema: S.Schema({
      id: S.Id(),
      name: S.String(),
      user_id: S.String(),
      user: S.RelationById("users", "$user_id")
    }),
    rules: {
      read: {
        'owner-is-user': {
          description: 'Users can only view budgets they own',
          filter: [['user_id', '=', '$session.SESSION_USER_ID']],
        },
      },
      write: {
        'owner-is-user': {
          description: 'Users can only edit their own budgets',
          filter: [['user_id', '=', '$session.SESSION_USER_ID']],
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
    }),
    rules: {
      read: {
        'owner-is-user': {
          description: 'Users can only view accounts they own',
          filter: [['budget.user_id', '=', '$session.SESSION_USER_ID']],
        },
      },
      write: {
        'owner-is-user': {
          description: 'Users can only edit their own accounts',
          filter: [['budget.user_id', '=', '$session.SESSION_USER_ID']],
        },
      },
    },
  },
  transactions: {
    schema: S.Schema({
      id: S.Id(),
      amount: S.Number(),
      account_id: S.String(),
      account: S.RelationById("accounts", "$account_id"),
    }),
    rules: {
      read: {
        'owner-is-user': {
          description: 'Users can only view transactions for accounts they own',
          filter: [['account.budget.user_id', '=', '$session.SESSION_USER_ID']],
        },
      },
      write: {
        'owner-is-user': {
          description: 'Users can only edit transactions for accounts they own',
          filter: [['account.budget.user_id', '=', '$session.SESSION_USER_ID']],
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
    }),
    rules: {
      read: {
        'owner-is-user': {
          description: 'Users can only view categories for budgets they own',
          filter: [['budget.user_id', '=', '$session.SESSION_USER_ID']],
        },
      },
      write: {
        'owner-is-user': {
          description: 'Users can only edit categories for budgets they own',
          filter: [['budget.user_id', '=', '$session.SESSION_USER_ID']],
        },
      },
    },
  },
  assignments: {
    schema: S.Schema({
      id: S.Id(),
      amount: S.Number({ default: 0 }),
      month: S.Number(),
      year: S.Number(),
      category_id: S.String(),
      category: S.RelationById("categories", "$category_id"),
    }),
    rules: {
      read: {
        'owner-is-user': {
          description: 'Users can only view assignments for categories they own',
          filter: [['category.budget.user_id', '=', '$session.SESSION_USER_ID']],
        },
      },
      write: {
        'owner-is-user': {
          description: 'Users can only edit assignments for categories they own',
          filter: [['category.budget.user_id', '=', '$session.SESSION_USER_ID']],
        },
      },
    },
  }
} satisfies ClientSchema;
