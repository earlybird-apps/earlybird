import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryOne } from "@triplit/react";
import { ComponentProps } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { client } from "@db/client";

import { useCategories, useMutateCategory } from "@/hooks/categories";
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
import { Input } from "./ui/input";
import { Select } from "./ui/select";

const addMoneySchema = z.object({
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be greater than 0" }),
  fromCategoryId: z.string(),
});

export function MoveMoneyDialog({
  onClose,
  categoryId,
  ...props
}: Omit<ComponentProps<typeof Dialog>, "children"> & {
  categoryId: string;
}) {
  const mutate = useMutateCategory();
  const { result: category, fetching: fetchingCategory } = useQueryOne(
    client,
    client.query("categories").id(categoryId),
  );
  const { result: readyToBudget, fetching: fetchingRTB } = useReadyToBudget();
  const { all, fetching: fetchingCategories } = useCategories();

  const {
    register,
    handleSubmit,
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
      mutate.moveMoney({
        fromCategoryId:
          data.fromCategoryId === "RTB" ? null : data.fromCategoryId,
        amount: data.amount,
        toCategoryId: categoryId,
      }),
      {
        loading: "Saving...",
        success: `Added $${data.amount} to ${category?.name}`,
        error: `Failed to add money to ${category?.name}`,
      },
    );
    exit();
  };

  if (fetchingCategory)
    return (
      <Dialog onClose={exit} {...props}>
        <DialogTitle>Loading...</DialogTitle>
        <DialogDescription>Loading category...</DialogDescription>
      </Dialog>
    );

  if (!category) {
    //TODO: Think about error handling. Throw on not found? Add error boundary?
    console.error("Category not found");
    return (
      <Dialog onClose={exit} {...props}>
        <DialogTitle>Oops</DialogTitle>
        <DialogDescription>Category not found</DialogDescription>
      </Dialog>
    );
  }

  return (
    <Dialog onClose={exit} {...props}>
      <form onSubmit={handleSubmit(addMoney)}>
        <DialogTitle>{category.name}</DialogTitle>
        <DialogDescription>Adding money to {category.name}</DialogDescription>
        <DialogBody>
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
              <Field>
                <Label>From</Label>
                <Select
                  {...register("fromCategoryId")}
                  invalid={!!errors?.fromCategoryId}
                  disabled={fetchingCategories || fetchingRTB}
                >
                  <option value="RTB">Ready to Budget: ${readyToBudget}</option>
                  <optgroup label="Categories">
                    {all.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}: $
                        {category.assigned + category.activity}
                      </option>
                    ))}
                  </optgroup>
                  all
                </Select>
              </Field>
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
