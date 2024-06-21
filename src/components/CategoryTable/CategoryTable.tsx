import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { CategoryRow } from "./CategoryRow";

export function CategoryTable(props: {
  categoryIds: string[];
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
        {props.categoryIds.map((id) => (
          <CategoryRow
            key={id}
            categoryId={id}
            month={props.month}
            year={props.year}
            currentDate={props.currentDate}
          />
        ))}
      </TableBody>
    </Table>
  );
}
