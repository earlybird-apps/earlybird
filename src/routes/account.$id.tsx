import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod";

import { client } from "@db/client";

import { Currency } from "@/components/Currency";
import { TransactionTable } from "@/components/TransactionTable";
import { Heading, Subheading } from "@/components/ui/heading";
import { useTransactions } from "@/hooks/useTransactions";

export const Route = createFileRoute("/account/$id")({
  parseParams: (params) => ({
    id: z.string().parse(params.id),
  }),
  loader: async ({ params }) => {
    const account = await client.fetchById("accounts", params.id);
    if (!account) throw notFound();
    return account;
  },
  component: Account,
});

function Account() {
  const account = Route.useLoaderData();
  // TODO: Can I handle this in the route loader?
  const { results: transactions } = useTransactions({
    accountIds: [account.id],
    includeCategory: true,
  });

  return (
    <div className="flex flex-col gap-6 p-2">
      <div className="flex flex-col gap-y-2">
        <Heading>{account.name}</Heading>
        <div className="text-xs text-gray-700">
          <span className="uppercase">Balance:</span>{" "}
          <Currency value={account.balance} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Subheading>Transactions</Subheading>
        {transactions && (
          <TransactionTable transactions={Array.from(transactions.values())} />
        )}
      </div>
    </div>
  );
}
