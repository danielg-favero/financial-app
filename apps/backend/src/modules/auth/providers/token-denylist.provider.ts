export interface ITokenDenylist {
  revoke(jti: string, expiresAt: number): void;
  isRevoked(jti: string): boolean;
}

export class InMemoryTokenDenylist implements ITokenDenylist {
  private readonly revokedTokens = new Map<string, number>();

  revoke(jti: string, expiresAt: number): void {
    this.revokedTokens.set(jti, expiresAt);
  }

  isRevoked(jti: string): boolean {
    const expiresAt = this.revokedTokens.get(jti);
    if (expiresAt === undefined) {
      return false;
    }
    if (expiresAt <= Date.now()) {
      this.revokedTokens.delete(jti);
      return false;
    }
    return true;
  }
}
