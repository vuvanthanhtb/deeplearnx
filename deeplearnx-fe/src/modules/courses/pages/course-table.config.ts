import {
  BTN_LESSONS,
  BTN_EDIT,
  BTN_DELETE,
} from "@/libs/constants/button.constant";
import { STRING, BUTTON } from "@/libs/constants/form.constant";
import { NUMERICAL_ORDER } from "@/libs/constants/table.constant";
import type { ButtonProps } from "@/libs/types/button.type";
import type { BaseTableColumn } from "@/libs/types/table.type";

const COLUMNS_BASE: BaseTableColumn[] = [
  {
    name: NUMERICAL_ORDER,
    label: "STT",
    type: NUMERICAL_ORDER,
  },
  {
    name: "name",
    label: "Tên khóa học",
    type: STRING,
  },
  {
    name: "slug",
    label: "Slug",
    type: STRING,
    styleCell: { fontFamily: "monospace", fontSize: 13, color: "#5f6368" },
  },
  {
    name: "createdAt",
    label: "Ngày tạo",
    type: STRING,
    style: { textAlign: "center" },
    styleCell: { textAlign: "center", color: "#5f6368" },
  },
];

const BTN_LESSONS_ACTION: ButtonProps = {
  title: "Bài học",
  type: "button",
  action: BTN_LESSONS,
  style: {
    padding: "3px 10px",
    fontSize: 12,
    background: "#e8f0fe",
    color: "#1a73e8",
    border: "1px solid #1a73e8",
    marginRight: 4,
  },
};

const BTN_EDIT_ACTION: ButtonProps = {
  title: "Sửa",
  type: "button",
  action: BTN_EDIT,
  style: {
    padding: "3px 10px",
    fontSize: 12,
    background: "#e6f4ea",
    color: "#1e8e3e",
    border: "1px solid #1e8e3e",
    marginRight: 4,
  },
};

const BTN_DELETE_ACTION: ButtonProps = {
  title: "Xóa",
  type: "button",
  action: BTN_DELETE,
  style: {
    padding: "3px 10px",
    fontSize: 12,
    background: "#fce8e6",
    color: "#d93025",
    border: "1px solid #d93025",
  },
};

export const buildCourseTableConfig = (isAdmin: boolean): BaseTableColumn[] => [
  ...COLUMNS_BASE,
  {
    name: "actions",
    label: "Thao tác",
    type: BUTTON,
    style: { width: "20%", textAlign: "center" },
    btnGroup: isAdmin
      ? [BTN_LESSONS_ACTION, BTN_EDIT_ACTION, BTN_DELETE_ACTION]
      : [BTN_LESSONS_ACTION],
  },
];
