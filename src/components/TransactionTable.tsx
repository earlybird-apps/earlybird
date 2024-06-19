import clsx from "clsx";
import { Currency } from "./Currency";

import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "./ui/table";
import { Category, Transaction as BaseTransaction, Account } from "@db/types";

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
            className={clsx(props.includeAccount ? "w-[15%]" : "hidden")}
          >
            Account
          </TableHeader>
          <TableHeader
            className={clsx(props.includeAccount ? "w-[15%]" : "w-[15%]")}
          >
            Date
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
        </TableRow>
      </TableHead>
      <TableBody>
        {props.transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            {props.includeAccount && (
              <TableCell>{transaction.account?.name}</TableCell>
            )}
            <TableCell className="group">
              {transaction.date.toLocaleDateString()}
            </TableCell>
            <TableCell className="group">
              <Currency value={transaction.amount} />
            </TableCell>
            <TableCell>{transaction.category?.name}</TableCell>
            <TableCell className="text-gray-700 text-sm">
              {transaction.memo}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
