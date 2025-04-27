import { User } from "../models/user.model";

export interface UserLoginInterface {
  success: boolean;
  token: string;
}

export interface UserFetchAllInterface {
  success: boolean;
  data: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UserRetrieveInterface {
  success: boolean;
  data: User;
}

export interface UserCreateInterface {
  success: boolean;
  data: User;
}

export interface UserUpdateInterface {
  success: boolean;
  data: [number];
}

export interface UserDeleteInterface {
  success: boolean;
  data: [number];
}
