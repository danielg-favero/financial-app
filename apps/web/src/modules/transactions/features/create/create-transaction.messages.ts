export const createTransactionMessages = {
  title: "Nova transação",
  description: "Registre uma receita, despesa ou investimento.",
  submit: "Criar transação",
  submitting: "Criando...",
  cancel: "Cancelar",
  success: "Transações criadas com sucesso!",
  partial: (succeeded: number, failed: number) =>
    `${succeeded} transação(ões) criada(s), ${failed} com falha.`,
};
