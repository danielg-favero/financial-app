export const createCategoryMessages = {
  title: "Nova categoria",
  description: "Crie uma categoria para organizar suas transações.",
  submit: "Criar categoria",
  submitting: "Criando...",
  cancel: "Cancelar",
  success: "Categorias criadas com sucesso!",
  partial: (succeeded: number, failed: number) =>
    `${succeeded} categoria(s) criada(s), ${failed} com falha.`,
};
