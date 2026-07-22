import type { User } from "@/modules/auth/domain/entities/user";

export interface IUserResponse {
  id: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export function presentUser(user: User): IUserResponse {
  return {
    id: user.id,
    email: user.email,
    emailVerified: user.emailVerified,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt.toISOString(),
  };
}
