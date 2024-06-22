import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import clsx from "clsx";
import { addMonths, format, isThisMonth } from "date-fns";
import { useMemo } from "react";
import { z } from "zod";

import { client } from "@db/client";

import { AllAssigned } from "@/components/AllAssigned";
import { CategoryTable } from "@/components/CategoryTable";
import { EmptyState } from "@/components/EmptyState";
import { MonthNav } from "@/components/MonthNav";
import { ReadyToAssign } from "@/components/ReadyToAssign";
import { Heading } from "@/components/ui/heading";
import { useSnapshot } from "@/hooks/useSnapshot";

export const Route = createFileRoute("/budget")({
  validateSearch: (search: Record<string, unknown>) => ({
    month: z
      .number()
      .gte(0)
      .lte(11)
      .default(new Date().getMonth())
      .parse(search?.month),
    year: z.number().default(new Date().getFullYear()).parse(search?.year),
  }),
  loader: async () => {
    const budget = await client.fetchOne(
      client.query("budgets").include("categories").build(),
    );
    if (!budget) throw notFound();
    return budget;
  },
  component: Budget,
});

function Budget() {
  const budget = Route.useLoaderData();
  const { month, year } = Route.useSearch();
  const navigate = useNavigate();

  const selectedMonth = useMemo(() => new Date(year, month, 1), [month, year]);
  const currentDate = useMemo(() => new Date(), []);

  const { snapshot } = useSnapshot({
    month,
    year,
    currentDate,
    budgetId: budget.id,
  });

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
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
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
      {budget.categories && budget.categories.size === 0 && (
        <EmptyState
          title="No categories"
          description="Get started by creating a new budget category."
          buttonText="New Category"
        />
      )}
      {budget.categories && budget.categories.size > 0 && (
        <CategoryTable
          categoryIds={Array.from(budget.categories.keys())}
          month={month}
          year={year}
          currentDate={currentDate}
        />
      )}
    </div>
  );
}
