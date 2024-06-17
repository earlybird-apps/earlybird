import { TableRow, TableCell } from "../ui/table";
import { Currency } from "../Currency";
import { useCategorySnapshot } from "@/hooks/useCategorySnapshot";
import { Button } from "../ui/button";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { useQueryOne } from "@triplit/react";
import { client } from "@db/client";
import { CategoryCell } from "./CategoryCell";
import { CategoryInput } from "./CategoryInput";

export function CategoryRow({
  categoryId,
  year,
  month,
  currentDate,
}: {
  categoryId: string;
  year: number;
  month: number;
  currentDate: Date;
}) {
  const { result: category } = useQueryOne(
    client,
    client.query("categories").id(categoryId)
  );
  const { snapshot } = useCategorySnapshot({
    categoryId,
    month,
    year,
    currentDate,
  });

  return (
    <TableRow>
      <CategoryCell>
        {category && (
          <CategoryInput
            value={category.name}
            onSave={(value) => {
              if (!value || value === category.name) return;
              client.update("categories", categoryId, async (category) => {
                category.name = value;
              });
            }}
          />
        )}
      </CategoryCell>
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
