import { axiosClient } from "./axios-client";
import type { HttpRequestConfig, ResponseBase } from "./types";
import "./interceptor";
import { removeEmpty } from "./helpers";
import {
  handleDownloadFile,
  handleDownloadError,
  type DownloadConfig,
} from "./download";
import { buildFormData, handleUploadError, type UploadConfig } from "./upload";

const call = async <TResponse = unknown, TData = unknown, TParams = unknown>(
  config: HttpRequestConfig<TData, TParams>,
) => {
  const { url, method = "GET", params, data, ...rest } = config;

  const response = await axiosClient.request<ResponseBase<TResponse>>({
    url,
    method,
    params: removeEmpty(params),
    data,
    ...rest,
  });

  return response;
};

const upload = <
  TResponse = unknown,
  TParams = unknown,
  TExtraData extends Record<string, unknown> = Record<string, unknown>,
>(
  config: UploadConfig<TParams, TExtraData>,
) => {
  const { url, method = "POST", file, params, data, headers } = config;

  return call<TResponse>({
    url,
    method,
    params,
    data: buildFormData(file, data),
    headers,
  }).catch((err: unknown) => handleUploadError(err));
};

const download = <TParams = unknown, TData = unknown>(
  config: DownloadConfig<TParams, TData>,
) => {
  const { url, method = "GET", params, data, filename, isOpen } = config;
  return call<Blob>({
    url,
    method,
    params,
    data,
    responseType: "blob",
  })
    .then((res) => handleDownloadFile(res, filename, isOpen))
    .catch((err: unknown) => handleDownloadError(err));
};

const http = {
  call,
  upload,
  download,
};

export default http;
