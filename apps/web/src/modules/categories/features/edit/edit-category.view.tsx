import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import { CategoryForm } from "@/modules/categories/components/category-form";
import { editCategoryMessages } from "@/modules/categories/features/edit/edit-category.messages";
import type { IEditCategoryModel } from "@/modules/categories/features/edit/edit-category.model";

const FORM_ID = "edit-category-form";

export function EditCategoryView({
  form,
  onSubmit,
  onClose,
  isSubmitting,
  parentOptions,
}: Readonly<IEditCategoryModel>) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editCategoryMessages.title}</DialogTitle>
          <DialogDescription>{editCategoryMessages.description}</DialogDescription>
        </DialogHeader>
        <CategoryForm
          formId={FORM_ID}
          form={form}
          onSubmit={onSubmit}
          parentOptions={parentOptions}
        />
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {editCategoryMessages.cancel}
          </Button>
          <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
            {isSubmitting ? editCategoryMessages.submitting : editCategoryMessages.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
