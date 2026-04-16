export interface AccountResponse {
  id: number;
  username: string;
  email: string;
  status: string;
  statusName: string;
  roles: string[];
  rolesName: string;
  fullName: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface AccountRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  roles: string[];
}

export interface AccountUpdateRequest {
  fullName: string;
  email: string;
  roles: string[];
}

export interface AccountQuery {
  fullName?: string;
  username?: string;
  email?: string;
  status?: string;
  role?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}

export interface AccountPage {
  content: AccountResponse[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface AccountImportResult {
  total: number;
  success: number;
  failed: number;
}
