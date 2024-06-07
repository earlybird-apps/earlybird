import { schema } from "./schema"
import { Entity } from "@triplit/client";

export type Budget = Entity<typeof schema, "budgets">;
