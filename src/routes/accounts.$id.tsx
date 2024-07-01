import { createFileRoute } from "@tanstack/react-router";
import { useQueryOne } from "@triplit/react";
import { z } from "zod";

import { client } from "@db/client";

import { AccountTransactions } from "@/components/AccountTransactions";
import { Currency } from "@/components/Currency";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";

export const Route = createFileRoute("/accounts/$id")({
  parseParams: (params) => ({
    id: z.string().parse(params.id),
  }),
  component: Account,
});

function Account() {
  const params = Route.useParams();
  const { result: account } = useQueryOne(
    client,
    client.query("accounts").id(params.id),
  );

  return (
    <>
      <div className="flex w-full flex-wrap items-end justify-between gap-4">
        <Heading>{account?.name}</Heading>
        <Badge>
          <Currency className="text-lg" value={account?.balance || 0} />
        </Badge>
      </div>
      <AccountTransactions id={params.id} />
    </>
  );
  return;
}
