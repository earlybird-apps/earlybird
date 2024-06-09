import { useCurrentBudget } from "@/hooks/useCurrentBudget";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { client } from "../../triplit/client";
import { z } from "zod";
import { Heading } from "@/components/ui/heading";
import { CategoryTable } from "@/components/CategoryTable";
import { useCategories } from "@/hooks/useCategories";
import { EmptyCategories } from "@/components/EmptyCategories";

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
  const { results, fetching } = useCategories();
  const categories = Array.from(results?.values() || []);

  useEffect(() => {
    if (budget) setBudget(budget);
  }, [budget, setBudget]);

  return (
    <div className="space-y-4 flex flex-col">
      <Heading>June '24</Heading>
      {!fetching && categories.length === 0 && <EmptyCategories />}
      {!fetching && categories.length > 0 && (
        <CategoryTable categories={categories} />
      )}
    </div>
  );
}
