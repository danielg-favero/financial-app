import type { FastifyReply, FastifyRequest } from "fastify";

import type { DeleteAccountUseCase } from "@/modules/auth/http/use-cases/delete-account.use-case";
import type { GetCurrentUserUseCase } from "@/modules/auth/http/use-cases/get-current-user.use-case";
import type { LoginUserUseCase } from "@/modules/auth/http/use-cases/login-user.use-case";
import type { LogoutUserUseCase } from "@/modules/auth/http/use-cases/logout-user.use-case";
import type { RefreshSessionUseCase } from "@/modules/auth/http/use-cases/refresh-session.use-case";
import type { RegisterUserUseCase } from "@/modules/auth/http/use-cases/register-user.use-case";
import type { RequestPasswordResetUseCase } from "@/modules/auth/http/use-cases/request-password-reset.use-case";
import type { ResetPasswordUseCase } from "@/modules/auth/http/use-cases/reset-password.use-case";
import type { UpdateProfileUseCase } from "@/modules/auth/http/use-cases/update-profile.use-case";
import type { VerifyEmailUseCase } from "@/modules/auth/http/use-cases/verify-email.use-case";
import {
  clearAuthCookies,
  setAuthCookies,
  REFRESH_COOKIE_NAME,
  type IAuthCookieOptions,
} from "@/modules/auth/http/auth-cookie";
import { presentUser } from "@/modules/auth/http/presenters/user.presenter";
import {
  forgotPasswordBodySchema,
  resetPasswordBodySchema,
  signInBodySchema,
  signUpBodySchema,
  updateProfileBodySchema,
  verifyEmailBodySchema,
} from "@/modules/auth/http/schemas/auth.schemas";
import { UnauthorizedError } from "@/shared/errors/unauthorized.error";

export interface IAuthControllerDeps {
  registerUserUseCase: RegisterUserUseCase;
  loginUserUseCase: LoginUserUseCase;
  logoutUserUseCase: LogoutUserUseCase;
  refreshSessionUseCase: RefreshSessionUseCase;
  verifyEmailUseCase: VerifyEmailUseCase;
  getCurrentUserUseCase: GetCurrentUserUseCase;
  updateProfileUseCase: UpdateProfileUseCase;
  deleteAccountUseCase: DeleteAccountUseCase;
  requestPasswordResetUseCase: RequestPasswordResetUseCase;
  resetPasswordUseCase: ResetPasswordUseCase;
  authCookie: IAuthCookieOptions;
}

export class AuthController {
  private readonly registerUserUseCase: RegisterUserUseCase;
  private readonly loginUserUseCase: LoginUserUseCase;
  private readonly logoutUserUseCase: LogoutUserUseCase;
  private readonly refreshSessionUseCase: RefreshSessionUseCase;
  private readonly verifyEmailUseCase: VerifyEmailUseCase;
  private readonly getCurrentUserUseCase: GetCurrentUserUseCase;
  private readonly updateProfileUseCase: UpdateProfileUseCase;
  private readonly deleteAccountUseCase: DeleteAccountUseCase;
  private readonly requestPasswordResetUseCase: RequestPasswordResetUseCase;
  private readonly resetPasswordUseCase: ResetPasswordUseCase;
  private readonly authCookie: IAuthCookieOptions;

  constructor({
    registerUserUseCase,
    loginUserUseCase,
    logoutUserUseCase,
    refreshSessionUseCase,
    verifyEmailUseCase,
    getCurrentUserUseCase,
    updateProfileUseCase,
    deleteAccountUseCase,
    requestPasswordResetUseCase,
    resetPasswordUseCase,
    authCookie,
  }: IAuthControllerDeps) {
    this.registerUserUseCase = registerUserUseCase;
    this.loginUserUseCase = loginUserUseCase;
    this.logoutUserUseCase = logoutUserUseCase;
    this.refreshSessionUseCase = refreshSessionUseCase;
    this.verifyEmailUseCase = verifyEmailUseCase;
    this.getCurrentUserUseCase = getCurrentUserUseCase;
    this.updateProfileUseCase = updateProfileUseCase;
    this.deleteAccountUseCase = deleteAccountUseCase;
    this.requestPasswordResetUseCase = requestPasswordResetUseCase;
    this.resetPasswordUseCase = resetPasswordUseCase;
    this.authCookie = authCookie;
  }

  readonly signUp = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const body = signUpBodySchema.parse(request.body);
    const result = await this.registerUserUseCase.execute(body);
    reply.status(201).send({
      user: presentUser(result.user),
      verificationToken: result.verificationToken,
    });
  };

  readonly signIn = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const body = signInBodySchema.parse(request.body);
    const result = await this.loginUserUseCase.execute(body);
    setAuthCookies(reply, result, this.authCookie);
    reply.status(200).send({ user: presentUser(result.user) });
  };

  readonly signOut = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    await this.logoutUserUseCase.execute({
      jti: request.tokenJti,
      expiresAt: request.tokenExpiresAt,
      refreshToken: request.cookies[REFRESH_COOKIE_NAME],
    });
    clearAuthCookies(reply, this.authCookie);
    reply.status(204).send();
  };

  readonly refresh = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const refreshToken = request.cookies[REFRESH_COOKIE_NAME];
    if (!refreshToken) {
      throw new UnauthorizedError("Missing refresh token");
    }
    const tokens = await this.refreshSessionUseCase.execute(refreshToken);
    setAuthCookies(reply, tokens, this.authCookie);
    reply.status(204).send();
  };

  readonly verifyEmail = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const body = verifyEmailBodySchema.parse(request.body);
    const user = await this.verifyEmailUseCase.execute(body);
    reply.status(200).send({ user: presentUser(user) });
  };

  readonly me = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const user = await this.getCurrentUserUseCase.execute(request.userId);
    reply.status(200).send({ user: presentUser(user) });
  };

  readonly updateMe = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const body = updateProfileBodySchema.parse(request.body);
    const user = await this.updateProfileUseCase.execute(request.userId, body);
    reply.status(200).send({ user: presentUser(user) });
  };

  readonly deleteMe = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    await this.deleteAccountUseCase.execute({
      userId: request.userId,
      jti: request.tokenJti,
      expiresAt: request.tokenExpiresAt,
    });
    clearAuthCookies(reply, this.authCookie);
    reply.status(204).send();
  };

  readonly forgotPassword = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const body = forgotPasswordBodySchema.parse(request.body);
    await this.requestPasswordResetUseCase.execute(body);
    reply.status(204).send();
  };

  readonly resetPassword = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const body = resetPasswordBodySchema.parse(request.body);
    await this.resetPasswordUseCase.execute(body);
    reply.status(204).send();
  };
}
