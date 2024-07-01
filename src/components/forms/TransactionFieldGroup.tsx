import { useQuery } from "@triplit/react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { z } from "zod";

import { client } from "@db/client";

import { useCategories } from "@/hooks/categories";

import { ErrorMessage, Field, FieldGroup, Label } from "../ui/fieldset";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Textarea } from "../ui/textarea";

export const transactionFieldGroupSchema = z.object({
  amount: z.coerce.number().refine((value) => value !== 0, {
    message: "An amount must be given for a transaction.",
  }),
  date: z
    .string()
    .date()
    .refine(
      (value) => {
        return new Date(value) <= new Date();
      },
      {
        message: "Transactions can not be on a future date.",
      },
    ),
  account_id: z
    .string()
    .min(1, { message: "An account must be chosen for a transaction." }),
  category_id: z
    .string()
    .min(1, { message: "A category must be chosen for a transaction." }),
  memo: z.string().optional(),
});

export function TransactionFieldGroup({
  register,
  errors,
}: {
  errors?: FieldErrors<z.infer<typeof transactionFieldGroupSchema>>;
  register: UseFormRegister<z.infer<typeof transactionFieldGroupSchema>>;
}) {
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
  return (
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
          <ErrorMessage>{errors.amount.message?.toString()}</ErrorMessage>
        )}
      </Field>
      <Field>
        <Label>Date</Label>
        <Input
          {...register("date")}
          type="date"
          invalid={!!errors?.date}
          max={new Date().toISOString().split("T")[0]}
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
                  {category.name}: ${category.assigned + category.activity}
                </option>
              ))}
            </optgroup>
          )}
          {system.length > 0 && (
            <optgroup label="System">
              {system.map((category) => (
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
                  {category.name}: ${category.assigned + category.activity}
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
          <ErrorMessage>{errors.category_id.message?.toString()}</ErrorMessage>
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
          <ErrorMessage>{errors.account_id.message?.toString()}</ErrorMessage>
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
    </FieldGroup>
  );
}
