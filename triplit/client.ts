import { TriplitClient } from "@triplit/client";

import { schema } from "./schema";

export const client = new TriplitClient({
  schema,
  storage: "indexeddb",
  serverUrl: import.meta.env.VITE_TRIPLIT_SERVER_URL,
});
