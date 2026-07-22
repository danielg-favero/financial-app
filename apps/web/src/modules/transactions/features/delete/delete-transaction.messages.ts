export const deleteTransactionMessages = {
  title: "Excluir transações",
  description: (descriptions: string[]) =>
    descriptions.length === 1
      ? `Tem certeza que deseja excluir a transação "${descriptions[0]}"? Esta ação não pode ser desfeita.`
      : `Tem certeza que deseja excluir ${descriptions.length} transações? Esta ação não pode ser desfeita.`,
  confirm: "Excluir",
  deleting: "Excluindo...",
  cancel: "Cancelar",
  success: "Transações excluídas com sucesso!",
  partial: (succeeded: number, failed: number) =>
    `${succeeded} transação(ões) excluída(s), ${failed} com falha.`,
};
