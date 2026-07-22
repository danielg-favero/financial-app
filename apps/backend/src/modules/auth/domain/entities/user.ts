export interface IUserProps {
  id: string;
  email: string;
  passwordHash: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  verificationToken: string | null;
  passwordResetToken: string | null;
  passwordResetTokenExpiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  readonly id: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly emailVerified: boolean;
  readonly firstName: string;
  readonly lastName: string;
  readonly verificationToken: string | null;
  readonly passwordResetToken: string | null;
  readonly passwordResetTokenExpiresAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: IUserProps) {
    this.id = props.id;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.emailVerified = props.emailVerified;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.verificationToken = props.verificationToken;
    this.passwordResetToken = props.passwordResetToken;
    this.passwordResetTokenExpiresAt = props.passwordResetTokenExpiresAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
