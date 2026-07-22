export interface IUser {
  id: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface IUserResponse {
  user: IUser;
}
