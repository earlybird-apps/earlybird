import { useQueryOne } from "@triplit/react";
import { ComponentProps } from "react";

import { client } from "@db/client";

import { Currency } from "../Currency";
import { Button } from "../ui/button";
import { Dialog, DialogActions, DialogBody, DialogTitle } from "../ui/dialog";

export function CategoryDetailDialog({
  categoryId,
  onClose,
  ...props
}: Omit<ComponentProps<typeof Dialog>, "children"> & { categoryId: string }) {
  const { result: category, fetching } = useQueryOne(
    client,
    client.query("categories").id(categoryId),
  );

  if (fetching || !category) return; // TODO: Loading state

  return (
    <Dialog onClose={onClose} {...props}>
      <DialogTitle>{category.name}</DialogTitle>
      <DialogBody>
        <dl className="*:flex *:justify-between space-y-6">
          <div>
            <dt className="text-gray-700">Assigned</dt>
            <dd>
              <Currency value={category.assigned} />
            </dd>
          </div>
          <div>
            <dt className="text-gray-700">Activity</dt>
            <dd>
              <Currency value={category.activity} />
            </dd>
          </div>
          <div className="font-medium">
            <dt>Available</dt>
            <dd>
              <Currency value={category.activity + category.assigned} />
            </dd>
          </div>
        </dl>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={() => onClose(false)}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
