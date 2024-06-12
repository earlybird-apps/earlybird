import { TableRow, TableCell } from "./ui/table";
import { Currency } from "./Currency";
import { useCategorySnapshot } from "@/hooks/useCategorySnapshot";

export function CategoryRow({
  categoryName,
  categoryId,
  year,
  month,
  currentDate,
}: {
  categoryName: string;
  categoryId: string;
  year: number;
  month: number;
  currentDate: Date;
}) {
  const { snapshot } = useCategorySnapshot({
    categoryId,
    month,
    year,
    currentDate,
  });

  return (
    <TableRow>
      <TableCell>{categoryName}</TableCell>
      <TableCell className="text-center">
        <Currency value={snapshot?.assigned || 0} />
      </TableCell>
      <TableCell className="text-center">
        <Currency value={snapshot?.activity || 0} />
      </TableCell>
      <TableCell className="text-end">
        <Currency value={snapshot?.available || 0} />
      </TableCell>
    </TableRow>
  );
}
