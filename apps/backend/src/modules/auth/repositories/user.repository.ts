import type { User } from "@/modules/auth/domain/entities/user";

export interface ICreateUserData {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  verificationToken: string;
}

export interface IUpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  passwordHash?: string;
  emailVerified?: boolean;
  verificationToken?: string | null;
  passwordResetToken?: string | null;
  passwordResetTokenExpiresAt?: Date | null;
}

export interface IUserRepository {
  create(data: ICreateUserData): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByVerificationToken(token: string): Promise<User | null>;
  findByPasswordResetToken(token: string): Promise<User | null>;
  update(id: string, data: IUpdateUserData): Promise<User>;
  delete(id: string): Promise<void>;
}
