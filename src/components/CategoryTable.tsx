import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "./ui/table";
import { Category } from "../../triplit/types";

export function CategoryTable(props: { categories: Category[] }) {
  return (
    <Table className="table-auto">
      <TableHead>
        <TableRow>
          <TableHeader>Category</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.categories.map((category) => (
          <>
            <TableRow key={category.name} className="align-center">
              <TableCell className="font-medium">{category.name}</TableCell>
            </TableRow>
          </>
        ))}
      </TableBody>
    </Table>
  );
}
