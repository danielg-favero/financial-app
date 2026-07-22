export const loanFormMessages = {
  personNameLabel: "Pessoa",
  personNamePlaceholder: "Ex.: João da Silva",
  descriptionLabel: "Descrição",
  descriptionPlaceholder: "Ex.: Empréstimo para reforma",
  loanDateLabel: "Data do empréstimo",
  amountLentLabel: "Valor emprestado (R$)",
  amountLentPlaceholder: "0,00",
  addRow: "Adicionar empréstimo",
  removeRow: "Remover empréstimo",
  rowLabel: (index: number) => `Empréstimo ${index}`,
  validation: {
    personName: "Informe o nome da pessoa.",
    description: "Informe a descrição.",
    loanDate: "Informe a data do empréstimo.",
    amountLent: "Informe um valor maior que zero.",
  },
};
