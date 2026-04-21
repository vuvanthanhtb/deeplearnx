import { ERROR_MESSAGE_MAP } from "../constants/error-code.constant";

export const readBlobAsText = (blob: Blob): Promise<string> =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsText(blob);
  });

type ApiErrorResponse = {
  response: {
    data: {
      message: string;
      [key: string]: unknown;
    };
  };
};

const resolveMessage = (msg: string): string => ERROR_MESSAGE_MAP[msg] ?? msg;

export const getApiErrorMessage = (error: unknown, fallback = ""): string => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const err = error as ApiErrorResponse;
    const msg = err.response?.data?.message;
    if (typeof msg === "string" && msg.trim()) return resolveMessage(msg);
  }
  if (error instanceof Error && error.message)
    return resolveMessage(error.message);
  return fallback;
};

export const removeEmpty = (obj: unknown): unknown => {
  if (
    obj === null ||
    typeof obj !== "object" ||
    obj instanceof FormData ||
    obj instanceof Blob
  ) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj;
  }

  const source = obj as Record<string, unknown>;
  const newObj: Record<string, unknown> = {};
  Object.keys(source).forEach((key) => {
    const value = source[key];
    if (value !== "") {
      newObj[key] = value;
    }
  });
  return newObj;
};
