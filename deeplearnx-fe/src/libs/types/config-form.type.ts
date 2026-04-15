import type * as yup from "yup";
import type { ButtonProps } from "./button.type";

export type IField = {
  name?: string;
  label?: string;
  type: string;
  placeholder?: string;
  disabled?: boolean;
  size: number;
  required?: boolean;
  option?: string;
  childs?: ButtonProps[];
  isMulti?: boolean;
  isPassword?: boolean;
  inputType?: string;
  style?: React.CSSProperties;
  childFields?: IField[];
  buttonLabel?: string;
  visibleWhen?: (values: Record<string, unknown>) => boolean;
};

export type IBaseFormConfig = {
  fields: IField[];
};

export type IBaseFormEvent = {
  name: string;
  value: unknown;
};

export type FormHandler = (
  values: Record<string, unknown>,
  ctx: {
    submit: () => Promise<void>;
    setFieldValue: (field: string, value: any) => void;
  },
) => void | boolean | Promise<void | boolean>;

export type HandlersMap = Record<string, FormHandler>;

export interface BaseFormComponentProps {
  formConfig: IBaseFormConfig;
  validationSchema?: yup.AnyObjectSchema;
  onChange?: (data: Record<string, unknown>) => void;
  handleBlur?: (data: Record<string, unknown>) => void;
  values?: Record<string, unknown>;
  options?: Record<string, unknown>;
  handlers?: HandlersMap;
}
