import { TableRow, TableCell } from "../ui/table";
import { Currency } from "../Currency";
import { useCategorySnapshot } from "@/hooks/useCategorySnapshot";
import { client } from "@db/client";
import { CategoryCell } from "./CategoryCell";
import { CategoryInput } from "./CategoryInput";
import { useAssignment } from "@/hooks/useAssignment";
import { useCategory } from "@/hooks/useCategory";

/* TODO: Handle loading state for each cell*/
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
  const { result: category } = useCategory(categoryId);
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
          // TODO: Edit initially defaults to 0, then returns to the default value if selecting cancel and selecting again
          <CategoryInput
            currency
            type="number"
            step={5}
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
