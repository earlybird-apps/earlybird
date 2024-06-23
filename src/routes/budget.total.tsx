import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@triplit/react";

import { client } from "@db/client";

import { Currency } from "@/components/Currency";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/budget/total")({
  component: BudgetTotal,
});

function BudgetTotal() {
  const { results: categories, fetching } = useQuery(
    client,
    client.query("categoriesV2"),
  );
  //   TODO: Move this to root level and pass down
  if (fetching) return <div>Loading...</div>;
  if (!categories || categories.size === 0) return <div>No categories</div>;
  //   TODO ^
  return (
    <Table className="table-auto">
      <TableHead>
        <TableRow>
          <TableHeader>Category</TableHeader>
          <TableHeader>Assigned</TableHeader>
          <TableHeader>Activity</TableHeader>
          <TableHeader>Balance</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {Array.from(categories).map(([id, category]) => (
          <TableRow key={id}>
            <TableCell>{category.name}</TableCell>
            <TableCell>
              <Currency value={category.for_now + category.for_later} />
            </TableCell>
            <TableCell>
              <Currency value={category.activity} />
            </TableCell>
            <TableCell>
              <Currency
                value={
                  category.for_now + +category.for_later + category.activity
                }
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
