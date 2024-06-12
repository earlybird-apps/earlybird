import { CategoryRow } from "./CategoryRow";
import { Table, TableHead, TableRow, TableHeader, TableBody } from "./ui/table";
import { Category } from "@db/types";

export function CategoryTable(props: {
  categories: Category[];
  month: number;
  year: number;
  currentDate: Date;
}) {
  return (
    <Table className="table-auto">
      <TableHead>
        <TableRow>
          <TableHeader>Category</TableHeader>
          <TableHeader>Assigned</TableHeader>
          <TableHeader>Activity</TableHeader>
          <TableHeader>Available</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.categories.map((category) => (
          <CategoryRow
            key={category.id}
            categoryName={category.name}
            categoryId={category.id}
            month={props.month}
            year={props.year}
            currentDate={props.currentDate}
          />
        ))}
      </TableBody>
    </Table>
  );
}
