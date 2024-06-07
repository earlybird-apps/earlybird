import { useBudget } from "@/hooks/useBudget";
import { useCurrentBudget } from "@/hooks/useCurrentBudget";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";

export const Route = createFileRoute("/$budgetId")({
  parseParams: (params) => ({
    budgetId: z.string().parse(params.budgetId),
  }),
  component: Budget,
});

function Budget() {
  const budgetId = Route.useParams().budgetId;
  const { results: budget, fetching } = useBudget(budgetId);
  const { setBudget } = useCurrentBudget();

  useEffect(() => {
    if (budget) setBudget(budget);
  }, [budget, setBudget]);

  if (fetching) return <div>Loading...</div>;
  if (!budget) throw notFound();
  // TODO: This doesn't seem to work? Check it out

  return <div>Showing Budget: {budget.name}</div>;
}
