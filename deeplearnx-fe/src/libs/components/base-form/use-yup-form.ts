import { useState } from "react";
import * as yup from "yup";

type FormErrors<T> = Partial<Record<keyof T, string>>;

interface UseYupFormReturn<T extends Record<string, unknown>> {
  values: T;
  errors: FormErrors<T>;
  setValue: (name: keyof T, value: unknown) => void;
  handleSubmit: (
    onValid: (values: T) => void,
  ) => (e: React.FormEvent) => Promise<void>;
  reset: () => void;
}

export function useYupForm<S extends yup.AnyObjectSchema>(
  schema: S,
  initialValues: yup.InferType<S>,
): UseYupFormReturn<yup.InferType<S>> {
  type T = yup.InferType<S>;

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});

  const setValue = (name: keyof T, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = async (): Promise<boolean> => {
    try {
      await schema.validate(values, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const fieldErrors: FormErrors<T> = {};
        err.inner.forEach((e) => {
          if (e.path) fieldErrors[e.path as keyof T] = e.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit =
    (onValid: (values: T) => void) =>
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      const valid = await validate();
      if (valid) onValid(values);
    };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return { values, errors, setValue, handleSubmit, reset };
}
