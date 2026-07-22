export interface IAuthTokenPayloadDTO {
  userId: string;
  jti: string;
  expiresAt: number;
}

export interface ISignOutDTO {
  jti: string;
  expiresAt: number;
  refreshToken?: string;
}
