import { createFileRoute, notFound } from "@tanstack/react-router";
import { client } from "@db/client";
import { z } from "zod";
import { useTransactions } from "@/hooks/useTransactions";
import { Heading, Subheading } from "@/components/ui/heading";
import { TransactionTable } from "@/components/TransactionTable";

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
  const { transactions } = useTransactions({
    accountIds: [account.id],
    includeCategory: true,
  });

  return (
    <div className="p-2 flex flex-col gap-6">
      <Heading>{account.name}</Heading>
      <div className="flex flex-col gap-2">
        <Subheading>Transactions</Subheading>
        <TransactionTable transactions={transactions || []} />
      </div>
    </div>
  );
}
