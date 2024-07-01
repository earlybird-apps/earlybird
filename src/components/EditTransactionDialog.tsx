import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryOne } from "@triplit/react";
import { ComponentProps, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { client } from "@db/client";

import { useMutateTransaction } from "@/hooks/transactions";

import {
  TransactionFieldGroup,
  transactionFieldGroupSchema,
} from "./forms/transaction-fieldgroup";
import { Button } from "./ui/button";
import { Dialog, DialogActions, DialogBody, DialogTitle } from "./ui/dialog";
import { Fieldset } from "./ui/fieldset";

export function EditTransactionDialog({
  onClose,
  transactionId,
  ...props
}: Omit<ComponentProps<typeof Dialog>, "children"> & {
  transactionId: string;
}) {
  const { result: transaction, fetching: fetchingTransaction } = useQueryOne(
    client,
    client.query("transactions").id(transactionId),
  );

  const mutateTransaction = useMutateTransaction();

  const {
    register,
    handleSubmit,
    formState: { errors },
    ...form
  } = useForm<z.infer<typeof transactionFieldGroupSchema>>({
    resolver: zodResolver(transactionFieldGroupSchema),
  });

  useEffect(() => {
    if (!transaction) return;

    form.setValue("amount", transaction.amount);
    form.setValue("date", transaction.date.toISOString().split("T")[0]);
    form.setValue("account_id", transaction.account_id);
    form.setValue("memo", transaction.memo);
    form.setValue("category_id", transaction.category_id || "");
  }, [transaction, form]);

  const exit = () => {
    form.reset();
    onClose(false);
  };

  const updateTransaction = async ({
    date,
    amount,
    account_id,
    category_id,
    memo,
  }: z.infer<typeof transactionFieldGroupSchema>) => {
    await toast.promise(
      mutateTransaction.update({
        id: transactionId,
        date: new Date(date),
        amount,
        account_id,
        category_id,
        memo,
      }),
      {
        loading: "Saving...",
        success: "Transaction saved.",
        error: "Failed to save transaction",
      },
    );

    exit();
  };

  if (fetchingTransaction) {
    return null; //TOOD: Loading?
  }

  return (
    <Dialog onClose={exit} {...props}>
      <form onSubmit={handleSubmit(updateTransaction)}>
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogBody>
          <Fieldset>
            <TransactionFieldGroup register={register} errors={errors} />
          </Fieldset>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={exit}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
