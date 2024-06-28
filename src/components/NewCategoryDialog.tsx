import { zodResolver } from "@hookform/resolvers/zod";
import { ComponentProps } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { client } from "@db/client";

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

const newCategorySchema = z.object({
  categoryName: z.string().min(1, "Category name is required"),
  createAnother: z.boolean(),
});

export function NewCategoryDialog({
  onClose,
  ...props
}: Omit<ComponentProps<typeof Dialog>, "children">) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    ...form
  } = useForm<z.infer<typeof newCategorySchema>>({
    defaultValues: {
      createAnother: false,
    },
    resolver: zodResolver(newCategorySchema),
  });

  const exit = () => {
    form.reset();
    onClose(false);
  };

  const insertCatgory = async (data: z.infer<typeof newCategorySchema>) => {
    const budget = await client.fetchOne(client.query("budgets").build());

    await toast.promise(
      client.insert("categories", {
        name: data.categoryName,
        budget_id: budget?.id!, // Let this fail if budget is undefined, present error to the user
      }),
      {
        loading: "Saving...",
        success: "Category created",
        error: "Failed to create category",
      },
    );

    if (data.createAnother) {
      form.resetField("categoryName");
      form.setFocus("categoryName");
    } else {
      exit();
    }
  };

  return (
    <Dialog onClose={exit} {...props}>
      <form onSubmit={handleSubmit(insertCatgory)}>
        <DialogTitle>New Category</DialogTitle>
        <DialogDescription>
          This will create a new budget category.
        </DialogDescription>
        <DialogBody>
          <Fieldset>
            <FieldGroup>
              <Field>
                <Label>Name</Label>
                <Input
                  {...register("categoryName")}
                  type="text"
                  autoFocus
                  invalid={!!errors?.categoryName}
                />
                {errors?.categoryName && (
                  <ErrorMessage>
                    {errors.categoryName.message?.toString()}
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
