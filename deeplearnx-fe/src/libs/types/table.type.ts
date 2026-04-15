import {
  PAGE_CURRENT,
  PAGE_SIZE,
  TOTAL_PAGES,
  TOTAL_RECORDS,
} from "../constants/table.constant";
import type { ButtonProps } from "./button.type";

export interface BaseTableColumn {
  name: string;
  label: string;
  type: string;
  style?: React.CSSProperties;
  styleCell?: React.CSSProperties;
  colorCustom?: Record<string, string>;
  btnGroup?: ButtonProps[];
  refColor?: string[];
}

export interface BaseTableConfig {
  data: unknown[];
  pageCurrent: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}

export const BASE_TABLE_DEFAULT: BaseTableConfig = {
  data: [],
  pageCurrent: PAGE_CURRENT,
  pageSize: PAGE_SIZE,
  totalPages: TOTAL_PAGES,
  totalRecords: TOTAL_RECORDS,
};
