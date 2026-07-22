import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import { LoanBulkForm } from "@/modules/loans/components/loan-bulk-form";
import { createLoanMessages } from "@/modules/loans/features/create/create-loan.messages";
import type { ICreateLoanModel } from "@/modules/loans/features/create/create-loan.model";

const FORM_ID = "create-loan-form";

export function CreateLoanView({
  form,
  onSubmit,
  onClose,
  isSubmitting,
}: Readonly<ICreateLoanModel>) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{createLoanMessages.title}</DialogTitle>
          <DialogDescription>{createLoanMessages.description}</DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          <LoanBulkForm formId={FORM_ID} form={form} onSubmit={onSubmit} />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {createLoanMessages.cancel}
          </Button>
          <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
            {isSubmitting ? createLoanMessages.submitting : createLoanMessages.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
