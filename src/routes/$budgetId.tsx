import { useCurrentBudget } from "@/hooks/useCurrentBudget";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { client } from "../../triplit/client";
import { z } from "zod";

export const Route = createFileRoute("/$budgetId")({
  parseParams: (params) => ({
    budgetId: z.string().parse(params.budgetId),
  }),
  loader: async ({ params }) => {
    const budget = await client.fetchById("budgets", params.budgetId);
    if (!budget) throw notFound();
    return budget;
  },
  component: Budget,
});

function Budget() {
  const budget = Route.useLoaderData();
  const { setBudget } = useCurrentBudget();

  useEffect(() => {
    if (budget) setBudget(budget);
  }, [budget, setBudget]);

  return <div>Showing Budget: {budget.name}</div>;
}
