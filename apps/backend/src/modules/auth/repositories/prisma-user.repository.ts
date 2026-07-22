import type {
  PrismaClient,
  User as UserModel,
} from "@/generated/prisma/client";
import { User } from "@/modules/auth/domain/entities/user";
import type {
  ICreateUserData,
  IUpdateUserData,
  IUserRepository,
} from "@/modules/auth/repositories/user.repository";

export interface IPrismaUserRepositoryDeps {
  prisma: PrismaClient;
}

export class PrismaUserRepository implements IUserRepository {
  private readonly prisma: PrismaClient;

  constructor({ prisma }: IPrismaUserRepositoryDeps) {
    this.prisma = prisma;
  }

  async create(data: ICreateUserData): Promise<User> {
    const record = await this.prisma.user.create({ data });
    return this.toEntity(record);
  }

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { id } });

    return record ? this.toEntity(record) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { email } });
    return record ? this.toEntity(record) : null;
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { verificationToken: token },
    });
    return record ? this.toEntity(record) : null;
  }

  async findByPasswordResetToken(token: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { passwordResetToken: token },
    });
    return record ? this.toEntity(record) : null;
  }

  async update(id: string, data: IUpdateUserData): Promise<User> {
    const record = await this.prisma.user.update({ where: { id }, data });
    return this.toEntity(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  private toEntity(record: UserModel): User {
    return new User({
      id: record.id,
      email: record.email,
      passwordHash: record.passwordHash,
      emailVerified: record.emailVerified,
      firstName: record.firstName,
      lastName: record.lastName,
      verificationToken: record.verificationToken,
      passwordResetToken: record.passwordResetToken,
      passwordResetTokenExpiresAt: record.passwordResetTokenExpiresAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
