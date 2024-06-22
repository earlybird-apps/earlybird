import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { AccountTransactions } from "@/components/AccountTransactions";

export const Route = createFileRoute("/accounts/$id")({
  parseParams: (params) => ({
    id: z.string().parse(params.id),
  }),
  component: Account,
});

function Account() {
  const params = Route.useParams();

  return <AccountTransactions id={params.id} />;
}
