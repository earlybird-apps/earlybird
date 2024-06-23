import { Entity } from "@triplit/client";

import { schema } from "./schema";

export type Budget = Entity<typeof schema, "budgets">;
export type Category = Entity<typeof schema, "categories">;
export type CategoryV2 = Entity<typeof schema, "categoriesV2">;
export type Transaction = Entity<typeof schema, "transactions">;
export type Assignment = Entity<typeof schema, "assignments">;
export type Account = Entity<typeof schema, "accounts">;
