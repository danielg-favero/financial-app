export const categoryFormMessages = {
  nameLabel: "Nome",
  namePlaceholder: "Ex.: Moradia",
  typeLabel: "Tipo",
  typePlaceholder: "Selecione o tipo",
  expenseKindLabel: "Classificação",
  expenseKindPlaceholder: "Fixa ou variável",
  expenseKindNone: "Sem classificação",
  parentLabel: "Categoria superior",
  parentPlaceholder: "Selecione a categoria superior",
  parentNone: "Nenhuma",
  addRow: "Adicionar categoria",
  removeRow: "Remover categoria",
  rowLabel: (index: number) => `Categoria ${index}`,
  validation: {
    name: "Informe o nome da categoria.",
    type: "Selecione o tipo da categoria.",
  },
};
