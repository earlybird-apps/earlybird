import { Currency } from "./Currency";

import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "./ui/table";
import { Category, Transaction as BaseTransaction } from "@db/types";

type Transaction = BaseTransaction & { category: Category | null };
export function TransactionTable(props: { transactions: Transaction[] }) {
  return (
    <Table className="table-auto">
      <TableHead>
        <TableRow>
          <TableHeader className="w-[15%]">Date</TableHeader>
          <TableHeader className="w-[25%]">Amount</TableHeader>
          <TableHeader className="w-[30%]">Category</TableHeader>
          <TableHeader className="w-[30%]">Memo</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.transactions.map((transaction) => (
          <TableRow key={transaction.id}>
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
