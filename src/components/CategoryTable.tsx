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

const CategoryRow = (props: {
  category: Category;
  year: number;
  month: number;
}) => {
  const { results } = useAssignment({
    categoryId: props.category.id,
    year: props.year,
    month: props.month,
  });

  return (
    <TableRow>
      <TableCell>{props.category.name}</TableCell>
      <TableCell>
        <Currency value={results?.values().next().value?.amount || 0} />
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
