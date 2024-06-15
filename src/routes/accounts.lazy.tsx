import { Currency } from "@/components/Currency";
import { EmptyState } from "@/components/EmptyState";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { useAccounts } from "@/hooks/useAccounts";
import { useCurrentBudget } from "@/hooks/useCurrentBudget";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createLazyFileRoute("/accounts")({
  component: Accounts,
});

function Accounts() {
  const { budget } = useCurrentBudget();
  const { results } = useAccounts({ budgetId: budget?.id });
  const accounts = useMemo(
    () => results && Array.from(results?.values()),
    [results]
  );
  return (
    <div className="space-y-4 flex flex-col">
      <Heading>Accounts</Heading>
      <ul role="list">
        {accounts?.length === 0 && (
          <EmptyState
            title="No accounts"
            description="Get started by adding a new account."
            buttonText="New Account"
          />
        )}
        {accounts?.map((account) => (
          <Link
            key={account.id}
            href="/account/$id"
            params={{ id: account.id }}
          >
            <li className="px-4 py-4 sm:px-0 flex justify-between">
              <span>{account.name}</span>
              <Currency value={account.balance} />
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
