import { BTN_APPROVE, BTN_REJECT } from "@/libs/constants/button.constant";
import { BUTTON, CHECKBOX, STRING } from "@/libs/constants/form.constant";
import { APPROVER, SUPERADMIN } from "@/libs/constants/roles.constant";
import { APPROVING } from "@/libs/constants/status.constant";
import { NUMERICAL_ORDER } from "@/libs/constants/table.constant";
import type { ButtonProps } from "@/libs/types/button.type";
import type { BaseTableColumn } from "@/libs/types/table.type";

const BTN_APPROVE_ACTION: ButtonProps = {
  title: "Phê duyệt",
  type: "button",
  action: BTN_APPROVE,
  refShow: ["status"],
  style: {
    padding: "3px 10px",
    fontSize: 12,
    background: "#e8f0fe",
    color: "#1a73e8",
    border: "1px solid #1a73e8",
    marginRight: 4,
    minWidth: 80,
  },
};

const BTN_REJECT_ACTION: ButtonProps = {
  title: "Từ chối",
  type: "button",
  action: BTN_REJECT,
  refShow: ["status"],
  style: {
    padding: "3px 10px",
    fontSize: 12,
    background: "#fce8e6",
    color: "#d93025",
    border: "1px solid #d93025",
    marginRight: 4,
    minWidth: 80,
  },
};

const COLUMNS_BASE: BaseTableColumn[] = [
  { name: "__select__", label: "", type: CHECKBOX },
  { name: NUMERICAL_ORDER, label: "STT", type: NUMERICAL_ORDER },
  { name: "fullName", label: "Họ và tên", type: STRING },
  { name: "username", label: "Tên tài khoản", type: STRING },
  { name: "email", label: "Email", type: STRING },
  {
    name: "rolesName",
    label: "Vai trò",
    type: STRING,
    style: { textAlign: "center" },
  },
  {
    name: "statusName",
    label: "Trạng thái",
    type: STRING,
    style: { textAlign: "center" },
    styleCell: { textAlign: "center" },
    refColor: ["status"],
  },
  {
    name: "createdAt",
    label: "Ngày tạo",
    type: STRING,
    style: { textAlign: "center" },
    styleCell: { textAlign: "center", color: "#5f6368" },
  },
  {
    name: "createdBy",
    label: "Người tạo",
    type: STRING,
    style: { textAlign: "center" },
    styleCell: { color: "#5f6368" },
  },
  {
    name: "updatedAt",
    label: "Ngày duyệt",
    type: STRING,
    style: { textAlign: "center" },
    styleCell: { textAlign: "center", color: "#5f6368" },
  },
  {
    name: "updatedBy",
    label: "Người duyệt",
    type: STRING,
    style: { textAlign: "center" },
    styleCell: { color: "#5f6368" },
  },
];

export const buildPendingTableConfig = (roles: string[]): BaseTableColumn[] => {
  const btnGroup: ButtonProps[] = [];

  if (roles.includes(SUPERADMIN) || roles.includes(APPROVER)) {
    btnGroup.push(BTN_APPROVE_ACTION, BTN_REJECT_ACTION);
  }

  return [
    ...COLUMNS_BASE,
    {
      name: "actions",
      label: "Thao tác",
      type: BUTTON,
      btnGroup,
    },
  ];
};

export const showButtons = (
  refShow: string[],
  _action: string,
  row: Record<string, unknown>,
) => {
  const status = row[refShow[0]] as string;

  if (status === APPROVING) {
    return true;
  }
  return false;
};
