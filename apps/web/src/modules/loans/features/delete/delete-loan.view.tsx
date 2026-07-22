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

import { deleteLoanMessages } from "@/modules/loans/features/delete/delete-loan.messages";
import type { IDeleteLoanModel } from "@/modules/loans/features/delete/delete-loan.model";

export function DeleteLoanView({
  personNames,
  onConfirm,
  onClose,
  isDeleting,
}: Readonly<IDeleteLoanModel>) {
  return (
    <AlertDialog open onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{deleteLoanMessages.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {deleteLoanMessages.description(personNames)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>{deleteLoanMessages.cancel}</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            disabled={isDeleting}
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
          >
            {isDeleting ? deleteLoanMessages.deleting : deleteLoanMessages.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
