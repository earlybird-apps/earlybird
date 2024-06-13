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
          <TableHeader className="w-[33%]">Category</TableHeader>
          <TableHeader className="w-[23%]">Assigned</TableHeader>
          <TableHeader className="w-[23%]">Activity</TableHeader>
          <TableHeader className="w-[23%] text-end">Available</TableHeader>
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
