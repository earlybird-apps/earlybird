import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/20/solid";
import { createFileRoute } from "@tanstack/react-router";

import { Currency } from "@/components/Currency";
import { NoCategories } from "@/components/NoCategories";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "@/components/ui/dropdown";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialogs } from "@/constants";
import { useCategories } from "@/hooks/categories";

export const Route = createFileRoute("/budget/")({
  component: BudgetNow,
});

function BudgetNow() {
  const { all, fetching } = useCategories();

  if (fetching) return <div>Loading...</div>;

  return all.length > 0 ? (
    <Table>
      <TableHead>
        <TableHeader>Category</TableHeader>
        <TableHeader className="text-end lg:text-start">Available</TableHeader>
        <TableHeader className="hidden lg:table-cell">Assigned</TableHeader>
        <TableHeader className="hidden lg:table-cell">Activity</TableHeader>
        <TableHeader className="hidden lg:table-cell w-16 justify-end">
          <span className="sr-only">Actions</span>
        </TableHeader>
      </TableHead>
      <TableBody>
        {all.map((category) => (
          <TableRow key={category.id}>
            <TableCell>{category.name}</TableCell>
            <TableCell className="text-end lg:text-start">
              <Currency value={category.assigned + category.activity} />
            </TableCell>
            <TableCell className="hidden lg:table-cell">
              <Currency value={category.assigned} />
            </TableCell>
            <TableCell className="hidden lg:table-cell">
              <Currency value={category.activity} />
            </TableCell>
            <TableCell className="hidden lg:table-cell w-16 justify-end">
              <Dropdown>
                <DropdownButton plain>
                  <EllipsisVerticalIcon />
                </DropdownButton>
                <DropdownMenu anchor="bottom end">
                  <DropdownItem
                    href=""
                    search={(prev) => ({
                      ...prev,
                      dialog: Dialogs.MoveMoney,
                      id: category.id,
                    })}
                  >
                    <ArrowDownTrayIcon />
                    <DropdownLabel>Add Money</DropdownLabel>
                  </DropdownItem>
                  <DropdownItem
                    href=""
                    search={(prev) => ({
                      ...prev,
                      dialog: Dialogs.RemoveMoney,
                      id: category.id,
                    })}
                  >
                    <ArrowUpTrayIcon />
                    <DropdownLabel>Move Money</DropdownLabel>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <NoCategories />
  );
}
