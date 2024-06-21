import { ComponentPropsWithRef } from "react";

import { TableCell } from "../ui/table";

export function CategoryCell({
  children,
  ...props
}: ComponentPropsWithRef<typeof TableCell>) {
  return (
    <TableCell className="group" {...props}>
      <div className="flex min-h-10 items-center justify-between gap-x-2">
        {children}
      </div>
    </TableCell>
  );
}
