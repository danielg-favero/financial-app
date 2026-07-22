export const loanMutationKeys = {
  create: ["loans", "create"] as const,
  update: ["loans", "update"] as const,
  delete: ["loans", "delete"] as const,
  registerPayment: ["loans", "register-payment"] as const,
};
