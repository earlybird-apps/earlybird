import { CheckBadgeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { FieldApi, useForm } from "@tanstack/react-form";
import { LinkProps, Outlet, createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import clsx from "clsx";
import { format } from "date-fns";
import { useState } from "react";
import { z } from "zod";

import { client } from "@db/client";

import { Currency } from "@/components/Currency";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, Fieldset, Label } from "@/components/ui/fieldset";
import { Heading, Subheading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/ui/link";
import { Switch, SwitchField } from "@/components/ui/switch";
import { useBudgetSettings } from "@/hooks/useBudgetSettings";
import { useReadyToBudget } from "@/hooks/useReadyToBuget";

export const Route = createFileRoute("/budget")({
  component: Budget,
});

const links: { route: LinkProps["to"]; label: string }[] = [
  {
    route: "/budget",
    label: "Now",
  },
  {
    route: "/budget/later",
    label: "Later",
  },
  {
    route: "/budget/total",
    label: "Total",
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.touchedErrors ? (
        <span className="text-red-600 text-sm font-medium ">
          {field.state.meta.touchedErrors}
        </span>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

function ReadyToBudget() {
  const { result: readyToBudget, fetching } = useReadyToBudget();
  if (fetching || readyToBudget === undefined) return null; //TODO: Loading state

  return readyToBudget === 0 ? (
    <span className="flex items-center gap-x-2 text-xs">
      <CheckBadgeIcon className="w-4" />
      All Assigned
    </span>
  ) : (
    <Badge
      color={readyToBudget > 0 ? "green" : "red"}
      className={clsx("flex flex-wrap", readyToBudget < 0 && "animate-pulse")}
    >
      <Currency value={readyToBudget} />
      <span>{readyToBudget > 0 ? "ready to budget" : "over budgeted"}</span>
    </Badge>
  );
}

function Budget() {
  const { showEmpty, setShowEmpty } = useBudgetSettings();
  const [showNewCategory, setShowNewCategory] = useState(false);
  const {
    handleSubmit,
    Field: TanstackField,
    Subscribe,
  } = useForm({
    defaultValues: {
      categoryName: "",
      makeMany: false,
    },
    onSubmit: async ({ value, formApi }) => {
      const budget = await client.fetchOne(client.query("budgets").build());
      if (!budget) {
        alert("Error saving category");
        return;
      }
      client
        .insert("categories", {
          name: value.categoryName,
          budget_id: budget.id,
        })
        .then(() => {
          alert("Category saved");
          if (value.makeMany) {
            formApi.setFieldValue("categoryName", "");
          } else {
            setShowNewCategory(false);
          }
        });
    },
    // Add a validator to support Zod usage in Form and Field
    validatorAdapter: zodValidator(),
  });

  return (
    <div className="flex flex-col space-y-4">
      <nav className="flex justify-between items-center sticky top-0 h-14 bg-white z-10">
        <Heading className="hidden lg:block">
          {format(new Date(), "MMMM do, yyyy")}
        </Heading>
        <Subheading className="lg:hidden">
          {format(new Date(), "MMMM, yyyy")}
        </Subheading>
        <ul className="gap-x-4 text-sm font-medium overflow-auto -mb-px flex border rounded-full p-1 bg-gray-50 items-center">
          {links.map((item) => (
            <li key={item.route}>
              <Link
                href={item.route}
                activeOptions={{ exact: true }}
                className="flex px-3 py-1"
                activeProps={{
                  className: "border font-semibold rounded-full bg-white",
                }}
              >
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div>
        <div className="flex mb-5 py-4 gap-x-4 text-sm text-gray-700 sticky top-14 bg-white border-b  z-10">
          <div className="flex gap-x-4 items-center me=auto">
            <Switch checked={showEmpty} onChange={setShowEmpty} />
            <span>Show empty</span>
          </div>
          <span className="ms-auto items-center my-auto">
            <ReadyToBudget />
          </span>
          <Button outline onClick={() => setShowNewCategory(true)}>
            <PencilSquareIcon />
            <span className="sr-only">Add Category</span>
          </Button>
        </div>
        <Outlet />
      </div>
      <Dialog open={showNewCategory} onClose={setShowNewCategory}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit();
          }}
        >
          <DialogTitle>New Category</DialogTitle>
          <DialogDescription>
            This will create a new budget category.
          </DialogDescription>
          <DialogBody>
            <Fieldset>
              <FieldGroup>
                <TanstackField
                  name="categoryName"
                  validators={{
                    onChange: z
                      .string()
                      .trim()
                      .min(1, "Category name is required"),
                  }}
                >
                  {(field) => (
                    <Field>
                      <Label>Name</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type="text"
                        autoFocus
                      />
                      <FieldInfo field={field} />
                    </Field>
                  )}
                </TanstackField>
                <TanstackField name="makeMany">
                  {(field) => (
                    <SwitchField>
                      <Label>Create another</Label>
                      <Switch
                        id={field.name}
                        checked={field.state.value}
                        onChange={field.handleChange}
                      />
                    </SwitchField>
                  )}
                </TanstackField>
              </FieldGroup>
            </Fieldset>
          </DialogBody>
          <DialogActions>
            <Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <>
                  <Button plain onClick={() => setShowNewCategory(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!canSubmit || isSubmitting}>
                    Save
                  </Button>
                </>
              )}
            </Subscribe>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
