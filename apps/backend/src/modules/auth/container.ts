import type { FastifyPluginAsync } from "fastify";

import { AuthController } from "@/modules/auth/http/controllers/auth.controller";
import { AuthMiddleware } from "@/modules/auth/middlewares/auth.middleware";
import {
  ScryptPasswordHasher,
  type IPasswordHasher,
} from "@/modules/auth/providers/password-hasher.provider";
import {
  CryptoRefreshTokenProvider,
  type IRefreshTokenProvider,
} from "@/modules/auth/providers/refresh-token.provider";
import {
  InMemoryTokenDenylist,
  type ITokenDenylist,
} from "@/modules/auth/providers/token-denylist.provider";
import {
  JwtTokenProvider,
  type ITokenProvider,
} from "@/modules/auth/providers/token.provider";
import type { IRefreshTokenRepository } from "@/modules/auth/repositories/refresh-token.repository";
import type { IUserRepository } from "@/modules/auth/repositories/user.repository";
import type { IEmailSender } from "@/shared/email/email-sender.provider";
import { buildAuthRoutes } from "@/modules/auth/http/routes/auth.routes";
import { DeleteAccountService } from "@/modules/auth/services/delete-account.service";
import { GetCurrentUserService } from "@/modules/auth/services/get-current-user.service";
import { IssueAuthTokensService } from "@/modules/auth/services/issue-auth-tokens.service";
import { LoginUserService } from "@/modules/auth/services/login-user.service";
import { LogoutUserService } from "@/modules/auth/services/logout-user.service";
import { RefreshSessionService } from "@/modules/auth/services/refresh-session.service";
import { RegisterUserService } from "@/modules/auth/services/register-user.service";
import { RequestPasswordResetService } from "@/modules/auth/services/request-password-reset.service";
import { ResetPasswordService } from "@/modules/auth/services/reset-password.service";
import { UpdateProfileService } from "@/modules/auth/services/update-profile.service";
import { VerifyEmailService } from "@/modules/auth/services/verify-email.service";
import { DeleteAccountUseCase } from "@/modules/auth/http/use-cases/delete-account.use-case";
import { GetCurrentUserUseCase } from "@/modules/auth/http/use-cases/get-current-user.use-case";
import { LoginUserUseCase } from "@/modules/auth/http/use-cases/login-user.use-case";
import { LogoutUserUseCase } from "@/modules/auth/http/use-cases/logout-user.use-case";
import { RefreshSessionUseCase } from "@/modules/auth/http/use-cases/refresh-session.use-case";
import { RegisterUserUseCase } from "@/modules/auth/http/use-cases/register-user.use-case";
import { RequestPasswordResetUseCase } from "@/modules/auth/http/use-cases/request-password-reset.use-case";
import { ResetPasswordUseCase } from "@/modules/auth/http/use-cases/reset-password.use-case";
import { UpdateProfileUseCase } from "@/modules/auth/http/use-cases/update-profile.use-case";
import { VerifyEmailUseCase } from "@/modules/auth/http/use-cases/verify-email.use-case";
import {
  PasswordPolicyProvider,
  type IPasswordPolicyProvider,
} from "./providers/password-policy.provider.ts";

export interface IAuthConfig {
  jwtSecret: string;
  jwtExpiresInSeconds: number;
  refreshTokenExpiresInSeconds: number;
  appUrl: string;
  cookieSecure: boolean;
}

export interface IAuthContainerDeps {
  userRepository: IUserRepository;
  refreshTokenRepository: IRefreshTokenRepository;
  emailSender: IEmailSender;
  config: IAuthConfig;
}

export class AuthContainer {
  readonly passwordHasher: IPasswordHasher;
  readonly tokenProvider: ITokenProvider;
  readonly refreshTokenProvider: IRefreshTokenProvider;
  readonly passwordPolicy: IPasswordPolicyProvider;
  readonly tokenDenylist: ITokenDenylist;
  readonly authMiddleware: AuthMiddleware;

  readonly issueAuthTokensService: IssueAuthTokensService;
  readonly registerUserService: RegisterUserService;
  readonly loginUserService: LoginUserService;
  readonly logoutUserService: LogoutUserService;
  readonly refreshSessionService: RefreshSessionService;
  readonly verifyEmailService: VerifyEmailService;
  readonly getCurrentUserService: GetCurrentUserService;
  readonly updateProfileService: UpdateProfileService;
  readonly deleteAccountService: DeleteAccountService;
  readonly requestPasswordResetService: RequestPasswordResetService;
  readonly resetPasswordService: ResetPasswordService;

  readonly controller: AuthController;

  constructor({
    userRepository,
    refreshTokenRepository,
    emailSender,
    config,
  }: IAuthContainerDeps) {
    this.passwordHasher = new ScryptPasswordHasher();
    this.tokenProvider = new JwtTokenProvider({
      secret: config.jwtSecret,
      expiresInSeconds: config.jwtExpiresInSeconds,
    });
    this.refreshTokenProvider = new CryptoRefreshTokenProvider();
    this.tokenDenylist = new InMemoryTokenDenylist();
    this.authMiddleware = new AuthMiddleware({
      tokenProvider: this.tokenProvider,
      tokenDenylist: this.tokenDenylist,
    });
    this.passwordPolicy = new PasswordPolicyProvider();

    this.issueAuthTokensService = new IssueAuthTokensService({
      tokenProvider: this.tokenProvider,
      refreshTokenProvider: this.refreshTokenProvider,
      refreshTokenRepository,
      refreshTokenExpiresInSeconds: config.refreshTokenExpiresInSeconds,
    });
    this.registerUserService = new RegisterUserService({
      userRepository,
      passwordHasher: this.passwordHasher,
      emailSender,
      appUrl: config.appUrl,
      passwordPolicy: this.passwordPolicy,
    });
    this.loginUserService = new LoginUserService({
      userRepository,
      passwordHasher: this.passwordHasher,
      issueAuthTokensService: this.issueAuthTokensService,
    });
    this.logoutUserService = new LogoutUserService({
      tokenDenylist: this.tokenDenylist,
      refreshTokenProvider: this.refreshTokenProvider,
      refreshTokenRepository,
    });
    this.refreshSessionService = new RefreshSessionService({
      refreshTokenProvider: this.refreshTokenProvider,
      refreshTokenRepository,
      issueAuthTokensService: this.issueAuthTokensService,
    });
    this.verifyEmailService = new VerifyEmailService({
      userRepository,
      emailSender,
    });
    this.getCurrentUserService = new GetCurrentUserService({ userRepository });
    this.updateProfileService = new UpdateProfileService({ userRepository });
    this.deleteAccountService = new DeleteAccountService({
      userRepository,
      refreshTokenRepository,
      tokenDenylist: this.tokenDenylist,
    });
    this.requestPasswordResetService = new RequestPasswordResetService({
      userRepository,
      emailSender,
      appUrl: config.appUrl,
    });
    this.resetPasswordService = new ResetPasswordService({
      userRepository,
      refreshTokenRepository,
      passwordHasher: this.passwordHasher,
      passwordPolicy: this.passwordPolicy,
      emailSender,
    });

    this.controller = new AuthController({
      registerUserUseCase: new RegisterUserUseCase({
        registerUserService: this.registerUserService,
      }),
      loginUserUseCase: new LoginUserUseCase({
        loginUserService: this.loginUserService,
      }),
      logoutUserUseCase: new LogoutUserUseCase({
        logoutUserService: this.logoutUserService,
      }),
      refreshSessionUseCase: new RefreshSessionUseCase({
        refreshSessionService: this.refreshSessionService,
      }),
      verifyEmailUseCase: new VerifyEmailUseCase({
        verifyEmailService: this.verifyEmailService,
      }),
      getCurrentUserUseCase: new GetCurrentUserUseCase({
        getCurrentUserService: this.getCurrentUserService,
      }),
      updateProfileUseCase: new UpdateProfileUseCase({
        updateProfileService: this.updateProfileService,
      }),
      deleteAccountUseCase: new DeleteAccountUseCase({
        deleteAccountService: this.deleteAccountService,
      }),
      requestPasswordResetUseCase: new RequestPasswordResetUseCase({
        requestPasswordResetService: this.requestPasswordResetService,
      }),
      resetPasswordUseCase: new ResetPasswordUseCase({
        resetPasswordService: this.resetPasswordService,
      }),
      authCookie: {
        secure: config.cookieSecure,
        maxAgeSeconds: config.jwtExpiresInSeconds,
        refreshMaxAgeSeconds: config.refreshTokenExpiresInSeconds,
      },
    });
  }

  get routes(): FastifyPluginAsync {
    return buildAuthRoutes({
      controller: this.controller,
      authMiddleware: this.authMiddleware,
    });
  }
}
