import { TableRow, TableCell } from "../ui/table";
import { Currency } from "../Currency";
import { useCategorySnapshot } from "@/hooks/useCategorySnapshot";
import { CategoryName } from "./CategoryName";
import { Button } from "../ui/button";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";

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
      <TableCell className="group">
        <CategoryName value={categoryName} categoryId={categoryId} />
      </TableCell>
      <TableCell className="group">
        <div className="gap-x-2 flex items-center mx-auto min-h-10 justify-between">
          <Currency value={snapshot?.assigned || 0} />
          <Button plain>
            <ArrowsRightLeftIcon className="w-2 h-2 group-hover:block hidden" />
          </Button>
        </div>
      </TableCell>
      <TableCell className="group">
        <Currency value={snapshot?.activity || 0} />
      </TableCell>
      <TableCell className="text-end">
        <Currency value={snapshot?.available || 0} />
      </TableCell>
    </TableRow>
  );
}
