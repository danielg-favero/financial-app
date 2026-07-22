import { useDeleteLoan } from "@/modules/loans/api/mutations/useDeleteLoan";
import type { DeleteLoanService } from "@/modules/loans/api/services/delete-loan.service";
import { deleteLoanMessages } from "@/modules/loans/features/delete/delete-loan.messages";
import { useLoansStore } from "@/modules/loans/store";
import type { ILoan } from "@/modules/loans/types/loan";

export interface IDeleteLoanModel {
  personNames: string[];
  onConfirm: () => void;
  onClose: () => void;
  isDeleting: boolean;
}

interface IDeleteLoanModelParams {
  loans: ILoan[];
  deleteLoanService: DeleteLoanService;
}

export function useDeleteLoanModel({
  loans,
  deleteLoanService,
}: IDeleteLoanModelParams): IDeleteLoanModel {
  const closeDialog = useLoansStore((state) => state.closeDialog);
  const clearSelected = useLoansStore((state) => state.clearSelected);
  const deleteLoan = useDeleteLoan({
    deleteLoanService,
    meta: {
      successMessage: deleteLoanMessages.success,
      partialMessage: deleteLoanMessages.partial,
    },
  });

  const onConfirm = () => {
    deleteLoan.mutate(
      loans.map((loan) => loan.id),
      {
        onSuccess: (result) => {
          clearSelected();
          if (result.failed.length === 0) {
            closeDialog();
          }
        },
      },
    );
  };

  return {
    personNames: loans.map((loan) => loan.personName),
    onConfirm,
    onClose: closeDialog,
    isDeleting: deleteLoan.isPending,
  };
}
