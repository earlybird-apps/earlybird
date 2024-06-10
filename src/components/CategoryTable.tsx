import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "./ui/table";
import { Category } from "@db/types";

import { useAssignment } from "@/hooks/useAssignment";
import { Currency } from "./Currency";
import { Entity } from "@triplit/client";
import { schema } from "@db/schema";
import { useTransactions } from "@/hooks/useTransactions";
import { useEffect, useState } from "react";

const computeTotalActivity = (
  results: Entity<typeof schema, "transactions">[]
) => {
  let totalActivity = 0;
  results.forEach((result) => (totalActivity += result.amount));
  return totalActivity;
};

const CategoryRow = (props: {
  category: Category;
  year: number;
  month: number;
}) => {
  const [activity, setActivity] = useState(0);

  const { results } = useAssignment({
    categoryId: props.category.id,
    year: props.year,
    month: props.month,
  });

  const { results: transactions } = useTransactions({
    categoryId: props.category.id,
    year: props.year,
    month: props.month,
  });

  useEffect(() => {
    if (!transactions) return;
    const computedActivity = computeTotalActivity(
      Array.from(transactions.values())
    );
    setActivity(computedActivity);
  }, [transactions]);

  return (
    <TableRow>
      <TableCell>{props.category.name}</TableCell>
      <TableCell>
        <Currency value={results?.values().next().value?.amount || 0} />
      </TableCell>
      <TableCell>
        <Currency value={activity} />
      </TableCell>
    </TableRow>
  );
};

export function CategoryTable(props: {
  categories: Category[];
  month: number;
  year: number;
}) {
  return (
    <Table className="table-auto">
      <TableHead>
        <TableRow>
          <TableHeader>Category</TableHeader>
          <TableHeader>Assigned</TableHeader>
          <TableHeader>Activity</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.categories.map((category) => (
          <CategoryRow
            key={category.id}
            category={category}
            month={props.month}
            year={props.year}
          />
        ))}
      </TableBody>
    </Table>
  );
}
