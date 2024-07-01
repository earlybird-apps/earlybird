import { EllipsisVerticalIcon, PencilIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

import { Account, Transaction as BaseTransaction, Category } from "@db/types";

import { Dialogs } from "@/constants";

import { Currency } from "./Currency";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "./ui/dropdown";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type Transaction = BaseTransaction & {
  category: Category | null;
  account: Account | null;
};
export function TransactionTable(props: {
  transactions: Transaction[];
  includeAccount?: boolean;
}) {
  return (
    <Table className="table-auto">
      <TableHead>
        <TableRow>
          <TableHeader
            className={clsx(props.includeAccount ? "w-[15%]" : "w-[15%]")}
          >
            Date
          </TableHeader>
          <TableHeader
            className={clsx(props.includeAccount ? "w-[15%]" : "hidden")}
          >
            Account
          </TableHeader>
          <TableHeader
            className={clsx(props.includeAccount ? "w-[20%]" : "w-[25%]")}
          >
            Amount
          </TableHeader>
          <TableHeader
            className={clsx(props.includeAccount ? "w-[25%]" : "w-[30%]")}
          >
            Category
          </TableHeader>
          <TableHeader
            className={clsx(props.includeAccount ? "w-[25%]" : "w-[30%]")}
          >
            Memo
          </TableHeader>
          <TableHeader>
            <span className="sr-only">Actions</span>
          </TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="group">
              {transaction.date.toLocaleDateString()}
            </TableCell>
            {props.includeAccount && (
              <TableCell>{transaction.account?.name}</TableCell>
            )}
            <TableCell className="group">
              <Currency value={transaction.amount} />
            </TableCell>
            <TableCell>{transaction.category?.name}</TableCell>
            <TableCell className="text-sm text-gray-700">
              {transaction.memo}
            </TableCell>
            <TableCell className="text-sm text-gray-700">
              <Dropdown>
                <DropdownButton plain>
                  <span className="sr-only">Actions</span>
                  <EllipsisVerticalIcon />
                </DropdownButton>
                <DropdownMenu>
                  <DropdownItem
                    href=""
                    search={(prev) => ({
                      ...prev,
                      dialog: Dialogs.EditTransaction,
                      id: transaction.id,
                    })}
                  >
                    <DropdownLabel>Edit</DropdownLabel>
                    <PencilIcon className="w-2" />
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
