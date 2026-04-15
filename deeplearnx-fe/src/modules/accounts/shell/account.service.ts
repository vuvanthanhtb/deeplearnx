import type { AxiosResponse } from "axios";

import type { ResponseBase } from "@/libs/interceptor/types";
import http from "@/libs/interceptor";

import type {
  AccountQuery,
  AccountPage,
  AccountRequest,
  AccountUpdateRequest,
  AccountResponse,
} from "./account.type";
import ACCOUNT_ENDPOINT from "./account.endpoint";

interface IAccountRepository {
  getAccounts(
    params?: AccountQuery,
  ): Promise<AxiosResponse<ResponseBase<AccountPage>>>;
  getAccountsApprove(
    params?: Omit<AccountQuery, "status">,
  ): Promise<AxiosResponse<ResponseBase<AccountPage>>>;
  createAccount(
    data: AccountRequest,
  ): Promise<AxiosResponse<ResponseBase<AccountResponse>>>;
  updateAccount(
    id: number,
    data: AccountUpdateRequest,
  ): Promise<AxiosResponse<ResponseBase<AccountResponse>>>;
  deleteAccount(
    id: number,
  ): Promise<AxiosResponse<ResponseBase<AccountResponse>>>;
  lockAccount(
    id: number,
  ): Promise<AxiosResponse<ResponseBase<AccountResponse>>>;
  unlockAccount(
    id: number,
  ): Promise<AxiosResponse<ResponseBase<AccountResponse>>>;
  approveAccount(
    id: number,
  ): Promise<AxiosResponse<ResponseBase<AccountResponse>>>;
  rejectAccount(
    id: number,
  ): Promise<AxiosResponse<ResponseBase<AccountResponse>>>;
  exportAccounts(params?: AccountQuery): Promise<Blob>;
  bulkApproveAccounts(
    ids: number[],
  ): Promise<AxiosResponse<ResponseBase<AccountResponse>>>;
  bulkRejectAccounts(
    ids: number[],
  ): Promise<AxiosResponse<ResponseBase<AccountResponse>>>;
  // importAccounts(file: File): Promise<void>;
}

class AccountRepository implements IAccountRepository {
  private static instance: AccountRepository;

  private constructor() {}

  static getInstance(): AccountRepository {
    if (!AccountRepository.instance) {
      AccountRepository.instance = new AccountRepository();
    }
    return AccountRepository.instance;
  }

  getAccounts(params?: AccountQuery) {
    return http.call<AccountPage>({
      url: ACCOUNT_ENDPOINT.ACCOUNTS,
      method: "GET",
      params,
    });
  }

  getAccountsApprove(params?: AccountQuery) {
    return http.call<AccountPage>({
      url: ACCOUNT_ENDPOINT.ACCOUNTS_APPROVE,
      method: "GET",
      params,
    });
  }

  createAccount(data: AccountRequest) {
    return http.call<AccountResponse>({
      url: ACCOUNT_ENDPOINT.ACCOUNTS_APPROVE,
      method: "POST",
      data,
    });
  }

  updateAccount(id: number, data: AccountUpdateRequest) {
    return http.call<AccountResponse>({
      url: `${ACCOUNT_ENDPOINT.ACCOUNTS_APPROVE}/${id}`,
      method: "PUT",
      data,
    });
  }

  deleteAccount(id: number) {
    return http.call<AccountResponse>({
      url: `${ACCOUNT_ENDPOINT.ACCOUNTS_APPROVE}/${id}`,
      method: "DELETE",
    });
  }

  lockAccount(id: number) {
    return http.call<AccountResponse>({
      url: `${ACCOUNT_ENDPOINT.ACCOUNTS_APPROVE}/${id}/lock`,
      method: "PUT",
    });
  }

  unlockAccount(id: number) {
    return http.call<AccountResponse>({
      url: `${ACCOUNT_ENDPOINT.ACCOUNTS_APPROVE}/${id}/unlock`,
      method: "PUT",
    });
  }

  approveAccount(id: number) {
    return http.call<AccountResponse>({
      url: `${ACCOUNT_ENDPOINT.ACCOUNTS_APPROVE}/${id}/approve`,
      method: "POST",
      data: { id },
    });
  }

  rejectAccount(id: number) {
    return http.call<AccountResponse>({
      url: `${ACCOUNT_ENDPOINT.ACCOUNTS_APPROVE}/${id}/reject`,
      method: "POST",
      data: { id },
    });
  }

  exportAccounts(params?: AccountQuery) {
    return http.download({
      url: ACCOUNT_ENDPOINT.ACCOUNTS_EXPORT,
      method: "GET",
      params,
    });
  }

  bulkApproveAccounts(ids: number[]) {
    return http.call<AccountResponse>({
      url: ACCOUNT_ENDPOINT.ACCOUNTS_BULK_APPROVE,
      method: "POST",
      data: ids,
    });
  }

  bulkRejectAccounts(ids: number[]) {
    return http.call<AccountResponse>({
      url: ACCOUNT_ENDPOINT.ACCOUNTS_BULK_REJECT,
      method: "POST",
      data: ids,
    });
  }

  // importAccounts(file: File) {
  //   return http.upload({
  //     url: ACCOUNT_ENDPOINT.ACCOUNTS_IMPORT,
  //     method: "POST",
  //     file,
  //   });
  // }
}

export const accountService: IAccountRepository =
  AccountRepository.getInstance();
