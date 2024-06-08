import { Schema as S, ClientSchema } from '@triplit/client';

/**
 * Define your schema here.
 * For more information on schemas, see the docs: https://www.triplit.dev/docs/schemas
 */
export const schema = {
  todos: {
    schema: S.Schema({
      id: S.Id(),
      title: S.String(),
      description: S.String(),
    }),
  },
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
        'author-is-user': {
          description: 'Users can only view budgets they own',
          filter: [['user_id', '=', '$session.SESSION_USER_ID']],
        },
      },
      write: {
        'author-is-user': {
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
        'author-is-user': {
          description: 'Users can only view accounts they own',
          filter: [['budget.user_id', '=', '$session.SESSION_USER_ID']],
        },
      },
      write: {
        'author-is-user': {
          description: 'Users can only edit their own accounts',
          filter: [['budget.user_id', '=', '$session.SESSION_USER_ID']],
        },
      },
    },
  }
} satisfies ClientSchema;
