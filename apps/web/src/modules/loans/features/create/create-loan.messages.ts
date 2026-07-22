export const createLoanMessages = {
  title: "Novo empréstimo",
  description: "Registre um valor emprestado para alguém.",
  submit: "Criar empréstimo",
  submitting: "Criando...",
  cancel: "Cancelar",
  success: "Empréstimos criados com sucesso!",
  partial: (succeeded: number, failed: number) =>
    `${succeeded} empréstimo(s) criado(s), ${failed} com falha.`,
};
