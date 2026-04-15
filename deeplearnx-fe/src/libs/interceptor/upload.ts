import { saveAs } from "file-saver";

import { readBlobAsText } from "./helpers";

export const handleUploadError = async (error: unknown): Promise<never> => {
  const response = (error as { response?: { data?: unknown } })?.response;
  const data = response?.data;

  if (data instanceof Blob) {
    const contentType = (
      (error as { response?: { headers?: Record<string, unknown> } })?.response
        ?.headers?.["content-type"] as string
    ) ?? "";

    // File lỗi từ server (vd: báo cáo lỗi xlsx, pdf...) → tải xuống
    if (!contentType.includes("application/json")) {
      saveAs(data, `error-report`);
      throw new Error("Server trả về file lỗi. Vui lòng kiểm tra file đã tải.");
    }

    // JSON được bọc trong blob → parse lấy message
    const text = await readBlobAsText(data);
    try {
      throw JSON.parse(text);
    } catch {
      throw new Error(text);
    }
  }

  // Lỗi dạng chuỗi
  if (typeof data === "string") {
    throw new Error(data);
  }

  throw error;
};

export type UploadConfig<
  TParams = unknown,
  TExtraData extends Record<string, unknown> = Record<string, unknown>,
> = {
  url: string;
  method?: "POST" | "PUT" | "GET";
  file: File | Blob;
  params?: TParams;
  data?: TExtraData;
  headers?: Record<string, string>;
};

export const buildFormData = (
  file: File | Blob,
  data?: Record<string, unknown>,
): FormData => {
  const formData = new FormData();
  formData.append("file", file);

  if (data) {
    Object.keys(data).forEach((key) => {
      formData.append(key, String(data[key]));
    });
  }

  return formData;
};
