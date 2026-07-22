import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

import { deleteAccountMessages } from "@/modules/auth/features/delete-account/delete-account.messages";
import type { IDeleteAccountModel } from "@/modules/auth/features/delete-account/delete-account.model";

export function DeleteAccountView({
  isDialogOpen,
  onDialogOpenChange,
  onConfirm,
  isDeleting,
}: Readonly<IDeleteAccountModel>) {
  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-destructive">{deleteAccountMessages.title}</CardTitle>
        <CardDescription>{deleteAccountMessages.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">{deleteAccountMessages.trigger}</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{deleteAccountMessages.dialogTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {deleteAccountMessages.dialogDescription}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{deleteAccountMessages.cancel}</AlertDialogCancel>
              <AlertDialogAction
                className={buttonVariants({ variant: "destructive" })}
                disabled={isDeleting}
                onClick={(event) => {
                  event.preventDefault();
                  onConfirm();
                }}
              >
                {isDeleting ? deleteAccountMessages.deleting : deleteAccountMessages.confirm}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
