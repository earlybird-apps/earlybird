import { Entity } from "@triplit/client";

import { schema } from "./schema";

export type Budget = Entity<typeof schema, "budgets">;
export type Category = Entity<typeof schema, "categories">;
export type Transaction = Entity<typeof schema, "transactions">;
export type Account = Entity<typeof schema, "accounts">;
