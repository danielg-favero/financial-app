import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { buttonVariants } from "@/shared/components/ui/button";

import { deleteTransactionMessages } from "@/modules/transactions/features/delete/delete-transaction.messages";
import type { IDeleteTransactionModel } from "@/modules/transactions/features/delete/delete-transaction.model";

export function DeleteTransactionView({
  transactionDescriptions,
  onConfirm,
  onClose,
  isDeleting,
}: Readonly<IDeleteTransactionModel>) {
  return (
    <AlertDialog open onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{deleteTransactionMessages.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {deleteTransactionMessages.description(transactionDescriptions)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            {deleteTransactionMessages.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            disabled={isDeleting}
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
          >
            {isDeleting ? deleteTransactionMessages.deleting : deleteTransactionMessages.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
