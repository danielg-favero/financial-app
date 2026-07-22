import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import { CategoryBulkForm } from "@/modules/categories/components/category-bulk-form";
import { createCategoryMessages } from "@/modules/categories/features/create/create-category.messages";
import type { ICreateCategoryModel } from "@/modules/categories/features/create/create-category.model";

const FORM_ID = "create-category-form";

export function CreateCategoryView({
  form,
  onSubmit,
  onClose,
  isSubmitting,
  parentOptions,
}: Readonly<ICreateCategoryModel>) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{createCategoryMessages.title}</DialogTitle>
          <DialogDescription>{createCategoryMessages.description}</DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          <CategoryBulkForm
            formId={FORM_ID}
            form={form}
            onSubmit={onSubmit}
            parentOptions={parentOptions}
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {createCategoryMessages.cancel}
          </Button>
          <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
            {isSubmitting ? createCategoryMessages.submitting : createCategoryMessages.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
