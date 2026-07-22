export const deleteLoanMessages = {
  title: "Excluir empréstimos",
  description: (personNames: string[]) =>
    personNames.length === 1
      ? `Tem certeza que deseja excluir o empréstimo de ${personNames[0]}? Esta ação não pode ser desfeita.`
      : `Tem certeza que deseja excluir ${personNames.length} empréstimos? Esta ação não pode ser desfeita.`,
  confirm: "Excluir",
  deleting: "Excluindo...",
  cancel: "Cancelar",
  success: "Empréstimos excluídos com sucesso!",
  partial: (succeeded: number, failed: number) =>
    `${succeeded} empréstimo(s) excluído(s), ${failed} com falha.`,
};
