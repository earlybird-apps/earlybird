import { zodResolver } from "@hookform/resolvers/zod";
import { ComponentProps } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useMutateAccounts } from "@/hooks/accounts";

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
import { Switch, SwitchField } from "./ui/switch";

const newAccountSchema = z.object({
  accountName: z.string().min(1, "Account name is required"),
  accountBalance: z.coerce.number().default(0),
  createAnother: z.boolean(),
});

export function NewAccountDialog({
  onClose,
  ...props
}: Omit<ComponentProps<typeof Dialog>, "children">) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    ...form
  } = useForm<z.infer<typeof newAccountSchema>>({
    defaultValues: {
      createAnother: false,
    },
    resolver: zodResolver(newAccountSchema),
  });
  const mutateAccount = useMutateAccounts();
  const exit = () => {
    form.reset();
    onClose(false);
  };

  const insertCatgory = async (data: z.infer<typeof newAccountSchema>) => {
    await toast.promise(
      mutateAccount.insert({
        name: data.accountName,
        balance: data.accountBalance,
      }),
      {
        loading: "Saving...",
        success: "Account created",
        error: "Failed to create account",
      },
    );

    if (data.createAnother) {
      form.resetField("accountName");
      form.resetField("accountBalance");
      form.setFocus("accountName");
    } else {
      exit();
    }
  };

  return (
    <Dialog onClose={exit} {...props}>
      <form onSubmit={handleSubmit(insertCatgory)}>
        <DialogTitle>New Account</DialogTitle>
        <DialogDescription>This will create a new account.</DialogDescription>
        <DialogBody>
          <Fieldset>
            <FieldGroup>
              <Field>
                <Label>Account Name</Label>
                <Input
                  {...register("accountName")}
                  type="text"
                  autoFocus
                  invalid={!!errors?.accountName}
                />
                {errors?.accountName && (
                  <ErrorMessage>
                    {errors.accountName.message?.toString()}
                  </ErrorMessage>
                )}
              </Field>
              <Field>
                <Label>Current Balance</Label>
                <Input
                  {...register("accountBalance")}
                  type="number"
                  step={0.01}
                  autoFocus
                  invalid={!!errors?.accountBalance}
                />
                {errors?.accountBalance && (
                  <ErrorMessage>
                    {errors.accountBalance.message?.toString()}
                  </ErrorMessage>
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
