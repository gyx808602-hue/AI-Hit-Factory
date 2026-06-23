import type { PageQuery, StatusValue } from "../../shared/types";

export interface UserPageQuery extends PageQuery {
  keywords?: string;
  status?: StatusValue;
  deptId?: number;
}

export interface UserPageItem {
  id: number;
  username: string;
  nickname: string;
  mobile?: string;
  gender?: number;
  avatar?: string;
  email?: string;
  status: StatusValue;
  deptName?: string;
  roleNames?: string;
  createTime?: string;
}

export interface UserForm {
  id?: number;
  username: string;
  nickname: string;
  mobile?: string;
  gender?: number;
  avatar?: string;
  email?: string;
  status?: StatusValue;
  deptId?: number;
  roleIds: number[];
}

export interface CurrentUser {
  userId: number;
  username: string;
  nickname: string;
  avatar?: string;
  gender?: number;
  deptName?: string;
  roles: string[];
  roleNames: string[];
  perms: string[];
}

export interface PasswordUpdateForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword?: string;
}
