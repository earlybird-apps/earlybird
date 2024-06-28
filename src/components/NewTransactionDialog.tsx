import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@triplit/react";
import { ComponentProps } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { client } from "@db/client";

import { SystemCategories } from "@/constants";
import { useCategories } from "@/hooks/useCategories";
import { useMutateTransaction } from "@/hooks/useMutateTransaction";

import { Button } from "./ui/button";
import { Dialog, DialogActions, DialogBody, DialogTitle } from "./ui/dialog";
import {
  ErrorMessage,
  Field,
  FieldGroup,
  Fieldset,
  Label,
} from "./ui/fieldset";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Switch, SwitchField } from "./ui/switch";
import { Textarea } from "./ui/textarea";

const newTransactionSchema = z.object({
  amount: z.coerce.number().refine((value) => value !== 0, {
    message: "An amount must be given for a transaction.",
  }),
  date: z.coerce.date({ message: "Date is required" }),
  account_id: z
    .string()
    .min(1, { message: "An account must be chosen for a transaction." }),
  category_id: z
    .string()
    .min(1, { message: "A category must be chosen for a transaction." }),
  memo: z.string().optional(),
  createAnother: z.boolean().optional(),
});

export function NewTransactionDialog({
  onClose,
  ...props
}: Omit<ComponentProps<typeof Dialog>, "children">) {
  const transaction = useMutateTransaction();
  const { results: accounts, fetching: fetchingAccounts } = useQuery(
    client,
    client.query("accounts"),
  );
  const {
    funded,
    underfunded,
    empty,
    system,
    fetching: fetchingCategories,
  } = useCategories({ includeSystem: true });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    ...form
  } = useForm<z.infer<typeof newTransactionSchema>>({
    defaultValues: {
      date: new Date(),
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
    delete data.createAnother;
    // TODO: Need to update transactions!
    await toast.promise(transaction.insert(data), {
      loading: "Saving...",
      success: "Transaction created",
      error: "Failed to create transaction",
    });

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
            <FieldGroup>
              <Field>
                <Label>Amount</Label>
                <Input
                  {...register("amount")}
                  type="number"
                  autoFocus
                  invalid={!!errors?.amount}
                />
                {errors?.amount && (
                  <ErrorMessage>
                    {errors.amount.message?.toString()}
                  </ErrorMessage>
                )}
              </Field>
              <Field>
                <Label>Date</Label>
                <Input
                  {...register("date")}
                  type="date"
                  invalid={!!errors?.date}
                />
                {errors?.date && (
                  <ErrorMessage>{errors.date.message?.toString()}</ErrorMessage>
                )}
              </Field>
              <Field>
                <Label>Category</Label>
                <Select
                  {...register("category_id")}
                  invalid={!!errors?.category_id}
                  disabled={fetchingCategories}
                >
                  {funded.length > 0 && (
                    <optgroup label="Funded">
                      {funded.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {system.length > 0 && (
                    <optgroup label="System">
                      {system
                        .filter(
                          (c) =>
                            c.system_code ==
                            SystemCategories.Income.system_code,
                        )
                        .map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                    </optgroup>
                  )}
                  {underfunded.length && (
                    <optgroup label="Underfunded">
                      {underfunded.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {empty.length && (
                    <optgroup label="Empty">
                      {empty.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </Select>
                {errors?.category_id && (
                  <ErrorMessage>
                    {errors.category_id.message?.toString()}
                  </ErrorMessage>
                )}
              </Field>
              <Field>
                <Label>Account</Label>
                <Select
                  {...register("account_id")}
                  disabled={fetchingAccounts}
                  invalid={!!errors?.account_id}
                >
                  {Array.from(accounts?.values() || []).map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </Select>
                {errors?.account_id && (
                  <ErrorMessage>
                    {errors.account_id.message?.toString()}
                  </ErrorMessage>
                )}
              </Field>
              <Field>
                <Label>Memo</Label>
                <Textarea
                  {...register("memo")}
                  invalid={!!errors?.memo}
                  resizable={false}
                  rows={2}
                  maxLength={255}
                />
                {errors?.memo && (
                  <ErrorMessage>{errors.memo.message?.toString()}</ErrorMessage>
                )}
              </Field>
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
