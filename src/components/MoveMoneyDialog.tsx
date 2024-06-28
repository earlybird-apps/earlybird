import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryOne } from "@triplit/react";
import { ComponentProps } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { client } from "@db/client";

import { useMutateCategory } from "@/hooks/useMutateCategory";
import { useReadyToBudget } from "@/hooks/useReadyToBuget";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import {
  ErrorMessage,
  Field,
  FieldGroup,
  Fieldset,
  Label,
} from "./ui/fieldset";
import { Subheading } from "./ui/heading";
import { Input } from "./ui/input";

const addMoneySchema = z
  .object({
    amount: z.coerce
      .number()
      .positive({ message: "Amount must be greater than 0" }),
    availableBalance: z.coerce.number(),
  })
  .refine(
    (data) => {
      return data.amount <= data.availableBalance;
    },
    {
      message: "Cannot assign more money than you have available.",
      path: ["amount"],
    },
  );

export function MoveMoneyDialog({
  onClose,
  categoryId,
  ...props
}: Omit<ComponentProps<typeof Dialog>, "children"> & {
  categoryId: string;
}) {
  const mutate = useMutateCategory();
  const { result: category, fetching } = useQueryOne(
    client,
    client.query("categories").id(categoryId),
  );
  const { result: availableBalance } = useReadyToBudget();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    ...form
  } = useForm<z.infer<typeof addMoneySchema>>({
    resolver: zodResolver(addMoneySchema),
    mode: "onChange",
  });

  const exit = () => {
    form.reset();
    onClose(false);
  };

  const addMoney = async (data: z.infer<typeof addMoneySchema>) => {
    toast.promise(
      mutate.addMoney({
        amount: data.amount,
        categoryId: categoryId,
      }),
      {
        loading: "Saving...",
        success: `Added $${data.amount} to ${category?.name}`,
        error: `Failed to add money to ${category?.name}`,
      },
    );
    exit();
  };

  if (fetching) return <div>Loading...</div>;
  if (!category || !availableBalance) {
    console.error("Category or RTB balance not found");
    return null;
  }

  return (
    <Dialog onClose={exit} {...props}>
      <form onSubmit={handleSubmit(addMoney)}>
        <DialogTitle>{category.name}</DialogTitle>
        <DialogDescription>Adding money to {category.name}</DialogDescription>
        <DialogBody>
          {/* TODO Use Currency */}
          <Subheading>Available to Budget: ${availableBalance}</Subheading>
          <Fieldset>
            <FieldGroup>
              <Field>
                <Label>Amount</Label>
                <Input
                  {...register("amount")}
                  autoFocus
                  type="number"
                  step={0.01}
                  min={0}
                  invalid={!!errors?.amount}
                />
                {errors?.amount && (
                  <ErrorMessage>
                    {errors.amount.message?.toString()}
                  </ErrorMessage>
                )}
              </Field>
              <Input
                className="hidden"
                {...register("availableBalance")}
                hidden
                value={availableBalance}
              />
            </FieldGroup>
          </Fieldset>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={exit}>
            Cancel
          </Button>
          <Button type="submit" disabled={!isValid}>
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
