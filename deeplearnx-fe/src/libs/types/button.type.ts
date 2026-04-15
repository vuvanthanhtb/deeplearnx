import type {
  BTN_APPROVE,
  BTN_REJECT,
  BTN_SUBMIT,
  BTN_CANCEL,
  BTN_CREATE,
  BTN_UPDATE,
  BTN_DELETE,
  BTN_CLOSE,
  BTN_LOCK,
  BTN_UNLOCK,
  BTN_EDIT,
  BTN_SEARCH,
  BTN_EXPORT,
  BTN_REFRESH,
  BTN_SAVE,
  BTN_BACK,
  BTN_NEXT,
  BTN_PREV,
  BTN_LESSONS,
} from "../constants/button.constant";

export type BTN_TYPE =
  | typeof BTN_APPROVE
  | typeof BTN_REJECT
  | typeof BTN_SUBMIT
  | typeof BTN_CANCEL
  | typeof BTN_CREATE
  | typeof BTN_UPDATE
  | typeof BTN_DELETE
  | typeof BTN_CLOSE
  | typeof BTN_LOCK
  | typeof BTN_UNLOCK
  | typeof BTN_EDIT
  | typeof BTN_SEARCH
  | typeof BTN_EXPORT
  | typeof BTN_REFRESH
  | typeof BTN_SAVE
  | typeof BTN_BACK
  | typeof BTN_NEXT
  | typeof BTN_PREV
  | typeof BTN_LESSONS;

export interface ButtonProps {
  title: string;
  type: "button" | "submit" | "reset";
  action: string;
  style?: React.CSSProperties;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  isLoading?: boolean;
  refShow?: string[];
}
