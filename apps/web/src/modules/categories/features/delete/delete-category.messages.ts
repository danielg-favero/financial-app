export const deleteCategoryMessages = {
  title: "Excluir categorias",
  description: (names: string[]) =>
    names.length === 1
      ? `Tem certeza que deseja excluir a categoria "${names[0]}"? Esta ação não pode ser desfeita.`
      : `Tem certeza que deseja excluir ${names.length} categorias? Esta ação não pode ser desfeita.`,
  confirm: "Excluir",
  deleting: "Excluindo...",
  cancel: "Cancelar",
  success: "Categorias excluídas com sucesso!",
  partial: (succeeded: number, failed: number) =>
    `${succeeded} categoria(s) excluída(s), ${failed} com falha.`,
};
