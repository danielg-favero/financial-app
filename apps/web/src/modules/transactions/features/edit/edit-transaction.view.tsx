import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import {
  TransactionForm,
  type ITransactionCategoryOption,
} from "@/modules/transactions/components/transaction-form";
import { editTransactionMessages } from "@/modules/transactions/features/edit/edit-transaction.messages";
import type { IEditTransactionModel } from "@/modules/transactions/features/edit/edit-transaction.model";

const FORM_ID = "edit-transaction-form";

export interface IEditTransactionViewProps extends IEditTransactionModel {
  categoryOptions: ITransactionCategoryOption[];
}

export function EditTransactionView({
  form,
  onSubmit,
  onClose,
  isSubmitting,
  categoryOptions,
}: Readonly<IEditTransactionViewProps>) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editTransactionMessages.title}</DialogTitle>
          <DialogDescription>{editTransactionMessages.description}</DialogDescription>
        </DialogHeader>
        <TransactionForm
          formId={FORM_ID}
          form={form}
          onSubmit={onSubmit}
          categoryOptions={categoryOptions}
        />
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {editTransactionMessages.cancel}
          </Button>
          <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
            {isSubmitting ? editTransactionMessages.submitting : editTransactionMessages.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
