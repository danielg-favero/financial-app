import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import { LoanForm } from "@/modules/loans/components/loan-form";
import { editLoanMessages } from "@/modules/loans/features/edit/edit-loan.messages";
import type { IEditLoanModel } from "@/modules/loans/features/edit/edit-loan.model";

const FORM_ID = "edit-loan-form";

export function EditLoanView({
  form,
  onSubmit,
  onClose,
  isSubmitting,
}: Readonly<IEditLoanModel>) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editLoanMessages.title}</DialogTitle>
          <DialogDescription>{editLoanMessages.description}</DialogDescription>
        </DialogHeader>
        <LoanForm formId={FORM_ID} form={form} onSubmit={onSubmit} />
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {editLoanMessages.cancel}
          </Button>
          <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
            {isSubmitting ? editLoanMessages.submitting : editLoanMessages.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
