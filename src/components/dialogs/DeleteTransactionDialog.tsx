import { ComponentProps, FormEvent } from "react";
import { toast } from "sonner";

import { useMutateTransaction } from "@/hooks/transactions";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogActions,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";

export function DeleteTransactionDialog({
  transactionId,
  onClose,
  ...props
}: Omit<ComponentProps<typeof Dialog>, "children"> & {
  transactionId: string;
}) {
  const { deleteOne } = useMutateTransaction();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await toast.promise(deleteOne(transactionId), {
      loading: "Saving...",
      success: "Transaction deleted",
      error: "Failed to delete transaction",
    });
    onClose(false);
  };

  return (
    <Dialog onClose={onClose} {...props}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogDescription>
          You are about to delete this transaction. This action cannot be
          undone.
        </DialogDescription>
        <DialogActions>
          <Button plain onClick={() => onClose(false)} autoFocus>
            Cancel
          </Button>
          <Button color="red" type="submit">
            Delete
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
