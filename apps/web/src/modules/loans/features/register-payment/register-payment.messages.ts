export const registerPaymentMessages = {
  title: "Registrar pagamento",
  description: (personName: string) =>
    `Registre um valor recebido do empréstimo de ${personName}.`,
  openBalanceLabel: "Saldo em aberto",
  amountLabel: "Valor recebido (R$)",
  amountPlaceholder: "0,00",
  submit: "Registrar pagamento",
  submitting: "Registrando...",
  cancel: "Cancelar",
  success: "Pagamento registrado com sucesso!",
  validation: {
    amount: "Informe um valor maior que zero.",
    exceedsBalance: "O valor não pode ser maior que o saldo em aberto.",
  },
};
