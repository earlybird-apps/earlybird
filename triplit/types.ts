import { schema } from "./schema"
import { Entity } from "@triplit/client";

export type Budget = Entity<typeof schema, "budgets">;
export type Category = Entity<typeof schema, "categories">;
export type Transaction = Entity<typeof schema, "transactions">;
export type Assignment = Entity<typeof schema, "assignments">;
