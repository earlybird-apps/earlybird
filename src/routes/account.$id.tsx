import { createFileRoute, notFound } from "@tanstack/react-router";
import { client } from "@db/client";
import { z } from "zod";

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
  return <div className="p-2">Displaying account: {account.name}</div>;
}
