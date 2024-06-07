import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/accounts")({
  component: Accounts,
});

function Accounts() {
  return <div className="p-2">Hello from Accounts!</div>;
}
