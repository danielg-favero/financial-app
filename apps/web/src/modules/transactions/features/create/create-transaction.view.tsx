import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import type { ITransactionCategoryOption } from "@/modules/transactions/components/transaction-form";
import { TransactionBulkForm } from "@/modules/transactions/components/transaction-bulk-form";
import { createTransactionMessages } from "@/modules/transactions/features/create/create-transaction.messages";
import type { ICreateTransactionModel } from "@/modules/transactions/features/create/create-transaction.model";

const FORM_ID = "create-transaction-form";

export interface ICreateTransactionViewProps extends ICreateTransactionModel {
  categoryOptions: ITransactionCategoryOption[];
}

export function CreateTransactionView({
  form,
  onSubmit,
  onClose,
  isSubmitting,
  categoryOptions,
}: Readonly<ICreateTransactionViewProps>) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{createTransactionMessages.title}</DialogTitle>
          <DialogDescription>{createTransactionMessages.description}</DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          <TransactionBulkForm
            formId={FORM_ID}
            form={form}
            onSubmit={onSubmit}
            categoryOptions={categoryOptions}
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {createTransactionMessages.cancel}
          </Button>
          <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
            {isSubmitting
              ? createTransactionMessages.submitting
              : createTransactionMessages.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
