export const authMutationKeys = {
  signIn: ["auth", "sign-in"] as const,
  signUp: ["auth", "sign-up"] as const,
  signOut: ["auth", "sign-out"] as const,
  verifyEmail: ["auth", "verify-email"] as const,
  updateProfile: ["auth", "update-profile"] as const,
  deleteAccount: ["auth", "delete-account"] as const,
  forgotPassword: ["auth", "forgot-password"] as const,
  resetPassword: ["auth", "reset-password"] as const,
};
