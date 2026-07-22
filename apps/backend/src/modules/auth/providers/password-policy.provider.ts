export interface IPasswordPolicyProvider {
  getValidations(password: string): Array<string>;
  validate(password: string): boolean;
  getPasswordRules(): Array<{
    id: string;
    message: string;
    validate: (password: string) => boolean;
  }>;
}

export const PASSWORD_MIN_LENGTH = 12;

export class PasswordPolicyProvider implements IPasswordPolicyProvider {
  public getValidations(password: string): Array<string> {
    const passwordRules = this.getPasswordRules();

    return passwordRules
      .filter((rule) => !rule.validate(password))
      .map((rule) => rule.message);
  }

  public validate(password: string): boolean {
    const passwordRules = this.getPasswordRules();

    return passwordRules.every((rule) => rule.validate(password));
  }

  public getPasswordRules() {
    return [
      {
        id: "minLength",
        message: `Password must have at least ${PASSWORD_MIN_LENGTH} characters`,
        validate: this.checkMinLength,
      },
      {
        id: "lowercase",
        message: "Password must contain a lowercase letter",
        validate: this.checkLowerCase,
      },
      {
        id: "uppercase",
        message: "Password must contain an uppercase letter",
        validate: this.checkUpperCase,
      },
      {
        id: "number",
        message: "Password must contain a number",
        validate: this.checkNumber,
      },
      {
        id: "special",
        message: "Password must contain a special character",
        validate: this.checkSpecial,
      },
      {
        id: "noWhitespace",
        message: "Password must not contain whitespace",
        validate: this.checkNoWhitespace,
      },
    ];
  }

  private checkMinLength(password: string): boolean {
    return password.length >= PASSWORD_MIN_LENGTH;
  }

  private checkLowerCase(password: string): boolean {
    return /[a-z]/.test(password);
  }

  private checkUpperCase(password: string): boolean {
    return /[A-Z]/.test(password);
  }

  private checkNumber(password: string): boolean {
    return /[0-9]/.test(password);
  }

  private checkSpecial(password: string): boolean {
    return /[^A-Za-z0-9]/.test(password);
  }

  private checkNoWhitespace(password: string): boolean {
    return !/\s/.test(password);
  }
}
