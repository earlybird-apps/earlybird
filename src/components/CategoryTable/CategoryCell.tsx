import { ComponentPropsWithRef } from "react";
import { TableCell } from "../ui/table";

export function CategoryCell({
  children,
  ...props
}: ComponentPropsWithRef<typeof TableCell>) {
  return (
    <TableCell className="group" {...props}>
      <div className="gap-x-2 flex items-center min-h-10 justify-between">
        {children}
      </div>
    </TableCell>
  );
}
