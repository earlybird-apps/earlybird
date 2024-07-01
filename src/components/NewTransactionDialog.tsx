import { zodResolver } from "@hookform/resolvers/zod";
import { ComponentProps } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useMutateTransaction } from "@/hooks/transactions";

import {
  TransactionFieldGroup,
  transactionFieldGroupSchema,
} from "./forms/transaction-fieldgroup";
import { Button } from "./ui/button";
import { Dialog, DialogActions, DialogBody, DialogTitle } from "./ui/dialog";
import { FieldGroup, Fieldset, Label } from "./ui/fieldset";
import { Switch, SwitchField } from "./ui/switch";

const newTransactionSchema = transactionFieldGroupSchema.extend({
  createAnother: z.boolean().optional(),
});

export function NewTransactionDialog({
  onClose,
  ...props
}: Omit<ComponentProps<typeof Dialog>, "children">) {
  const transaction = useMutateTransaction();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    ...form
  } = useForm<z.infer<typeof newTransactionSchema>>({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      createAnother: false,
    },
    resolver: zodResolver(newTransactionSchema),
  });

  const exit = () => {
    form.reset();
    onClose(false);
  };

  const insertTransaction = async (
    data: z.infer<typeof newTransactionSchema>,
  ) => {
    toast.promise(
      transaction.insert({
        date: new Date(data.date),
        amount: data.amount,
        memo: data.memo,
        category_id: data.category_id,
        account_id: data.account_id,
      }),
      {
        loading: "Saving...",
        success: "Transaction created",
        error: "Failed to create transaction",
      },
    );

    if (data.createAnother) {
      form.resetField("amount");
      form.resetField("memo");
      form.setFocus("amount");
    } else {
      exit();
    }
  };

  return (
    <Dialog onClose={exit} {...props}>
      <form onSubmit={handleSubmit(insertTransaction)}>
        <DialogTitle>New Transaction</DialogTitle>
        <DialogBody>
          <Fieldset>
            <TransactionFieldGroup register={register} errors={errors} />
            <FieldGroup>
              <SwitchField>
                <Label>Create another</Label>
                <Controller
                  name="createAnother"
                  control={control}
                  render={({ field: { onChange, onBlur } }) => (
                    <Switch onChange={onChange} onBlur={onBlur} />
                  )}
                />
              </SwitchField>
            </FieldGroup>
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
