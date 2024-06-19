import { TableRow, TableCell } from "../ui/table";
import { Currency } from "../Currency";
import { useCategorySnapshot } from "@/hooks/useCategorySnapshot";
import { useQueryOne } from "@triplit/react";
import { client } from "@db/client";
import { CategoryCell } from "./CategoryCell";
import { CategoryInput } from "./CategoryInput";
import { useAssignment } from "@/hooks/useAssignment";

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
  const { result: assignment } = useAssignment({ categoryId, year, month });
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
                category.name = String(value);
              });
            }}
          />
        )}
      </CategoryCell>
      <CategoryCell>
        {snapshot && (
          <CategoryInput
            currency
            type="number"
            value={assignment?.amount ?? 0}
            onSave={(value) => {
              if (!value || value === assignment?.amount) return;
              if (assignment) {
                client.update(
                  "assignments",
                  assignment.id,
                  async (assignment) => {
                    assignment.amount = Number(value);
                  }
                );
              } else {
                client.insert("assignments", {
                  category_id: categoryId,
                  year,
                  month,
                  amount: Number(value),
                });
              }
            }}
          />
        )}
      </CategoryCell>
      <TableCell className="group">
        <Currency value={snapshot?.activity || 0} />
      </TableCell>
      <TableCell className="text-end">
        <Currency value={snapshot?.available || 0} />
      </TableCell>
    </TableRow>
  );
}
