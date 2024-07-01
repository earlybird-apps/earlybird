import { Outlet, createFileRoute } from "@tanstack/react-router";

import { client } from "@db/client";

export const Route = createFileRoute("/accounts")({
  loader: () => client.fetch(client.query("accounts").build()),
  component: Accounts,
});

function Accounts() {
  return (
    <div className="flex flex-col gap-y-8">
      <Outlet />
    </div>
  );
}
