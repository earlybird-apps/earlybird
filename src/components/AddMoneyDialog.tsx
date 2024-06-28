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
import { Input } from "./ui/input";
import { Select } from "./ui/select";

const addMoneySchema = z
  .object({
    amount: z.coerce
      .number()
      .positive({ message: "Amount must be greater than 0" }),
    laterBalance: z.coerce.number(),
    rtbBalance: z.coerce.number(),
    availableBalance: z.coerce.number(),
    fromPocket: z.union([
      z.literal("RTB"),
      z.literal("LATER"),
      z.literal("NOW"),
    ]),
  })
  .refine(
    (data) => {
      if (data.fromPocket === "LATER" && data.amount > data.laterBalance) {
        return false;
      }
      if (data.fromPocket === "RTB" && data.amount > data.rtbBalance) {
        return false;
      }
      if (data.fromPocket === "NOW" && data.amount > data.availableBalance) {
        return false;
      }
      return true;
    },
    {
      message: "Cannot assign more money than you have available.",
      path: ["amount"],
    },
  );

export function AddMoneyDialog({
  onClose,
  categoryId,
  display,
  ...props
}: Omit<ComponentProps<typeof Dialog>, "children"> & {
  categoryId: string;
  display: "now" | "later" | "total";
}) {
  const mutate = useMutateCategory();
  const { result: category, fetching } = useQueryOne(
    client,
    client.query("categories").id(categoryId),
  );
  const { result: rtbBalance } = useReadyToBudget();
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
        fromPocket: data.fromPocket,
        toPocket: display === "now" ? "NOW" : "LATER",
      }),
      {
        loading: "Saving...",
        success:
          data.fromPocket === "RTB" ? "Added from unasigned." : "Moved money.",
        error:
          data.fromPocket === "RTB"
            ? "Failed to add money"
            : "Failed to move money",
      },
    );
    exit();
  };

  if (fetching) return null;
  if (!category || !rtbBalance) return null;

  return (
    <Dialog onClose={exit} {...props}>
      <form onSubmit={handleSubmit(addMoney)}>
        <DialogTitle>{category.name}</DialogTitle>
        <DialogDescription>
          Add money to {category.name} for {display}
        </DialogDescription>
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
                <Label>From</Label>
                <Select {...register("fromPocket")}>
                  <option value="RTB" disabled={rtbBalance <= 0}>
                    Ready to Budget: ${rtbBalance}
                  </option>
                  {display === "now" && (
                    <option value="LATER" disabled={category.for_later <= 0}>
                      Later: ${category.for_later}
                    </option>
                  )}
                  {display === "later" && (
                    <option
                      value="NOW"
                      disabled={category.for_now + category.activity <= 0}
                    >
                      Now: ${category.for_now + category.activity}
                    </option>
                  )}
                </Select>
                {errors?.fromPocket && (
                  <ErrorMessage>
                    {errors.fromPocket.message?.toString()}
                  </ErrorMessage>
                )}
              </Field>
              <Input
                className="hidden"
                {...register("laterBalance")}
                hidden
                value={category.for_later}
              />
              <Input
                className="hidden"
                {...register("rtbBalance")}
                hidden
                value={rtbBalance}
              />
              <Input
                className="hidden"
                {...register("availableBalance")}
                hidden
                value={category.for_now + category.activity}
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
