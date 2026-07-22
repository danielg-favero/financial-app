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

import { deleteCategoryMessages } from "@/modules/categories/features/delete/delete-category.messages";
import type { IDeleteCategoryModel } from "@/modules/categories/features/delete/delete-category.model";

export function DeleteCategoryView({
  categoryNames,
  onConfirm,
  onClose,
  isDeleting,
}: Readonly<IDeleteCategoryModel>) {
  return (
    <AlertDialog open onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{deleteCategoryMessages.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {deleteCategoryMessages.description(categoryNames)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            {deleteCategoryMessages.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            disabled={isDeleting}
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
          >
            {isDeleting ? deleteCategoryMessages.deleting : deleteCategoryMessages.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
