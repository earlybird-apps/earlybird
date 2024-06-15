import { useCurrentBudget } from "@/hooks/useCurrentBudget";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { client } from "@db/client";
import { z } from "zod";
import { Heading } from "@/components/ui/heading";
import { CategoryTable } from "@/components/CategoryTable";
import { useCategories } from "@/hooks/useCategories";
import { EmptyState } from "@/components/EmptyState";
import { format, addMonths, isThisMonth } from "date-fns";
import { MonthNav } from "@/components/MonthNav";
import clsx from "clsx";
import { useSnapshot } from "@/hooks/useSnapshot";
import { ReadyToAssign } from "@/components/ReadyToAssign";
import { AllAssigned } from "@/components/AllAssigned";

export const Route = createFileRoute("/$budgetId")({
  parseParams: (params) => ({
    budgetId: z.string().parse(params.budgetId),
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    month: z
      .number()
      .gte(0)
      .lte(11)
      .default(new Date().getMonth())
      .parse(search?.month),
    year: z.number().default(new Date().getFullYear()).parse(search?.year),
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
  const { month, year } = Route.useSearch();
  const { setBudget } = useCurrentBudget();
  const navigate = useNavigate();
  const { results } = useCategories();

  const selectedMonth = useMemo(() => new Date(year, month, 1), [month, year]);
  const currentDate = useMemo(() => new Date(), []);

  const { snapshot } = useSnapshot({
    month,
    year,
    currentDate,
    budgetId: budget.id,
  });

  useEffect(() => {
    if (budget) setBudget(budget);
  }, [budget, setBudget]);

  const handleDateChange = (action: "next" | "previous" | "today") => {
    let newDate = undefined;

    switch (action) {
      case "next":
        newDate = addMonths(selectedMonth, 1);
        break;
      case "previous":
        newDate = addMonths(selectedMonth, -1);
        break;
      case "today":
        newDate = new Date();
        break;
    }

    navigate({
      search: (prev) => ({
        ...prev,
        month: newDate.getMonth(),
        year: newDate.getFullYear(),
      }),
    });
  };

  return (
    <div className="space-y-4 flex flex-col">
      <div className="flex justify-between items-center">
        <Heading
          className={clsx(!isThisMonth(selectedMonth) && "!text-gray-500")}
        >
          {format(selectedMonth, "MMM yyy")}
        </Heading>
        <MonthNav onSelect={handleDateChange} />
      </div>
      {snapshot && snapshot?.available !== 0 && (
        <ReadyToAssign value={snapshot.available} />
      )}
      {snapshot && snapshot.available === 0 && <AllAssigned />}
      {results && results?.size === 0 && (
        <EmptyState
          title="No categories"
          description="Get started by creating a new budget category."
          buttonText="New Category"
        />
      )}
      {results && results?.size > 0 && (
        <CategoryTable
          categories={Array.from(results.values())}
          month={month}
          year={year}
          currentDate={currentDate}
        />
      )}
    </div>
  );
}
