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

export const handleError = (error: unknown) => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const err = error as ApiErrorResponse;
    if (
      typeof err.response === "object" &&
      err.response !== null &&
      "data" in err.response &&
      typeof err.response.data === "object" &&
      err.response.data !== null &&
      "message" in err.response.data
    ) {
      return err.response.data;
    }
  }

  if (error instanceof Error) {
    return error;
  }

  return error;
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
