import { saveAs } from "file-saver";
import type { AxiosResponse } from "axios";

import { readBlobAsText } from "./helpers";

const DEFAULT_FILE_NAME = "download";

const getFileNameFromDisposition = (disposition?: string | null): string => {
  if (!disposition) return DEFAULT_FILE_NAME;

  const starMatch = /filename\*\s*=\s*(?:UTF-8'')?([^;]+)/i.exec(disposition);
  if (starMatch?.[1]) return decodeURIComponent(starMatch[1].trim());

  const plainMatch = /filename\s*=\s*"?([^";]+)"?/i.exec(disposition);
  if (plainMatch?.[1]) return plainMatch[1].trim();

  return DEFAULT_FILE_NAME;
};

const getHeader = (res: AxiosResponse, name: string): string => {
  if (typeof res.headers.get === "function") {
    return String(res.headers.get(name) ?? "");
  }
  return String(res.headers[name] ?? res.headers[name.toLowerCase()] ?? "");
};

const handleDownloadFile = (
  res: AxiosResponse,
  filename?: string,
  isOpen?: boolean,
): Blob => {
  const contentType = getHeader(res, "content-type");
  const disposition = getHeader(res, "content-disposition") || undefined;
  const resolvedName = filename ?? getFileNameFromDisposition(disposition);
  const blob = new Blob([res.data as BlobPart], { type: contentType });

  if (isOpen) {
    const fileURL = window.URL.createObjectURL(blob);
    window.open(fileURL, "_blank");
  } else {
    saveAs(blob, resolvedName);
  }

  return blob;
};

const handleDownloadError = async (error: unknown): Promise<never> => {
  const response = (error as { response?: { data?: unknown } })?.response;
  const data = response?.data;

  if (data instanceof Blob) {
    const text = await readBlobAsText(data);
    try {
      throw JSON.parse(text);
    } catch {
      throw new Error(text);
    }
  }

  throw error;
};

export { getFileNameFromDisposition, getHeader };

export type DownloadConfig<TParams = unknown, TData = unknown> = {
  url: string;
  method?: "GET" | "POST";
  params?: TParams;
  data?: TData;
  filename?: string;
  isOpen?: boolean;
};

export { handleDownloadFile, handleDownloadError };
