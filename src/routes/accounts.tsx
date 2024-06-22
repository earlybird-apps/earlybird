import { Outlet, createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { useMemo } from "react";

import { client } from "@db/client";

import { Currency } from "@/components/Currency";
import { EmptyState } from "@/components/EmptyState";
import { TransactionTable } from "@/components/TransactionTable";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/components/ui/link";
import { useTransactions } from "@/hooks/useTransactions";

export const Route = createFileRoute("/accounts")({
  loader: () => client.fetch(client.query("accounts").build()),
  component: Accounts,
});

function Accounts() {
  const accounts = Route.useLoaderData();
  // const { results: accounts } = useAccounts();
  const { results: transactions } = useTransactions();
  {
    transactions && transactions.size > 0 && (
      <TransactionTable
        includeAccount
        transactions={Array.from(transactions.values())}
      />
    );
  }
  const totalBalance = useMemo(() => {
    return accounts
      ? Array.from(accounts.values())?.reduce(
          (acc, account) => acc + account.balance,
          0,
        )
      : undefined;
  }, [accounts]);

  return (
    <div className="flex flex-col gap-y-8">
      <nav className="flex flex-col gap-y-2">
        <nav>
          <ul className="gap-x-6 font-medium overflow-auto border-b -mb-px flex space-x-8">
            <li>
              <Link
                href="/accounts"
                activeOptions={{ exact: true }}
                className={clsx("flex gap-x-4 items-center p-2")}
                activeProps={{ className: "border-b-2 border-b-slate-500" }}
              >
                <span>Total</span>
                <Badge>
                  <Currency
                    className="font-light text-xs"
                    value={totalBalance || 0}
                  />
                </Badge>
              </Link>
            </li>
            {accounts &&
              Array.from(accounts).map(([id, account]) => (
                <li key={id}>
                  <Link
                    className="flex gap-x-4  items-center p-2"
                    href="/accounts/$id"
                    params={{ id }}
                    activeProps={{ className: "border-b-2 border-b-slate-500" }}
                  >
                    <span>{account.name}</span>
                    <Badge>
                      <Currency
                        className="font-light text-xs"
                        value={account.balance}
                      />
                    </Badge>
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      </nav>
      <div>
        {!accounts || accounts.size === 0 ? (
          <EmptyState
            title="No accounts"
            description="Get started by adding a new account."
            buttonText="New Account"
          />
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
}
