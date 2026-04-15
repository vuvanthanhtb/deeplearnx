import type { AxiosRequestConfig, Method } from "axios";

export interface HttpRequestConfig<TData = unknown, TParams = unknown>
  extends Omit<
    AxiosRequestConfig<TData>,
    "url" | "method" | "params" | "data"
  > {
  url: string;
  method: Method;
  data?: TData;
  params?: TParams;
  retry?: number;
}

export interface ResponseBase<T = unknown> {
  code: string;
  message: string;
  data: T;
}
