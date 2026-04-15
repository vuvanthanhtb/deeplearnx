import { BUTTON, SELECT, STRING, TEXT } from "@/libs/constants/form.constant";
import {
  ADMIN,
  APPROVER,
  SUPERADMIN,
  USER,
} from "@/libs/constants/roles.constant";
import { NUMERICAL_ORDER } from "@/libs/constants/table.constant";
import type { IBaseFormConfig } from "@/libs/types/config-form.type";
import type { ButtonProps } from "@/libs/types/button.type";
import type { BaseTableColumn } from "@/libs/types/table.type";
import type { ProfileUser } from "@/modules/auth/shell/auth.type";
import {
  BTN_APPROVE,
  BTN_CLOSE,
  BTN_DELETE,
  BTN_EDIT,
  BTN_LOCK,
  BTN_SUBMIT,
  BTN_UNLOCK,
} from "@/libs/constants/button.constant";
import { ACTIVE, LOCKED } from "@/libs/constants/status.constant";

export const accountConfig: IBaseFormConfig = {
  fields: [
    {
      type: TEXT,
      name: "fullName",
      label: "Họ và tên",
      placeholder: "Nhập họ và tên...",
      required: true,
      size: 12,
    },
    {
      type: TEXT,
      name: "username",
      label: "Tên tài khoản",
      placeholder: "Nhập tên tài khoản...",
      required: true,
      size: 12,
    },
    {
      type: TEXT,
      name: "email",
      label: "Email",
      placeholder: "Nhập email...",
      required: true,
      size: 12,
    },
    {
      type: TEXT,
      name: "password",
      label: "Mật khẩu",
      placeholder: "Nhập mật khẩu...",
      required: true,
      isPassword: true,
      size: 12,
    },
    {
      type: TEXT,
      name: "confirmPassword",
      label: "Xác nhận mật khẩu",
      placeholder: "Nhập lại mật khẩu...",
      required: true,
      isPassword: true,
      size: 12,
    },
    {
      type: SELECT,
      name: "role",
      option: "roleOptions",
      label: "Vai trò",
      placeholder: "Chọn vai trò...",
      required: true,
      isMulti: true,
      size: 12,
    },
    {
      type: BUTTON,
      size: 12,
      childs: [
        { title: "Lưu", type: "submit", action: BTN_SUBMIT },
        {
          title: "Đóng",
          type: "button",
          action: BTN_CLOSE,
          style: {
            background: "inherit",
            color: "#1a73e8",
            border: "1px solid #1a73e8",
          },
        },
      ],
    },
  ],
};

export const accountUpdateConfig: IBaseFormConfig = {
  fields: [
    {
      type: TEXT,
      name: "username",
      label: "Tên tài khoản",
      placeholder: "Nhập tên tài khoản...",
      required: true,
      disabled: true,
      size: 12,
    },
    {
      type: TEXT,
      name: "fullName",
      label: "Họ và tên",
      placeholder: "Nhập họ và tên...",
      required: true,
      size: 12,
    },
    {
      type: TEXT,
      name: "email",
      label: "Email",
      placeholder: "Nhập email...",
      required: true,
      size: 12,
    },
    {
      type: SELECT,
      name: "status",
      option: "statusOptions",
      label: "Trạng thái",
      placeholder: "Chọn trạng thái...",
      required: false,
      disabled: true,
      size: 12,
    },
    {
      type: SELECT,
      name: "role",
      option: "roleOptions",
      label: "Vai trò",
      placeholder: "Chọn vai trò...",
      required: true,
      isMulti: true,
      size: 12,
    },
    {
      type: BUTTON,
      size: 12,
      childs: [
        { title: "Lưu", type: "submit", action: BTN_SUBMIT },
        {
          title: "Đóng",
          type: "button",
          action: BTN_CLOSE,
          style: {
            background: "inherit",
            color: "#1a73e8",
            border: "1px solid #1a73e8",
          },
        },
      ],
    },
  ],
};

export const getAccountUpdateConfig = (hideRole: boolean): IBaseFormConfig => ({
  ...accountUpdateConfig,
  fields: hideRole
    ? accountUpdateConfig.fields.filter((f) => f.name !== "role")
    : accountUpdateConfig.fields,
});

export const accountInitialValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  fullName: "",
  role: [],
};

const BTN_EDIT_ACTION: ButtonProps = {
  title: "Sửa",
  type: "button",
  action: BTN_EDIT,
  refShow: ["status"],
  style: {
    padding: "3px 10px",
    fontSize: 12,
    background: "#e6f4ea",
    color: "#1e8e3e",
    border: "1px solid #1e8e3e",
    marginRight: 4,
    minWidth: 80,
  },
};

const BTN_DELETE_ACTION: ButtonProps = {
  title: "Xóa",
  type: "button",
  action: BTN_DELETE,
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

const BTN_LOCK_ACTION: ButtonProps = {
  title: "Khóa",
  type: "button",
  action: BTN_LOCK,
  refShow: ["status"],
  style: {
    padding: "3px 10px",
    fontSize: 12,
    background: "#fff3e0",
    color: "#e37400",
    border: "1px solid #e37400",
    marginRight: 4,
    minWidth: 80,
  },
};

const BTN_UNLOCK_ACTION: ButtonProps = {
  title: "Mở khóa",
  type: "button",
  action: BTN_UNLOCK,
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

const COLUMNS_BASE: BaseTableColumn[] = [
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
    label: "Ngày cập nhật",
    type: STRING,
    style: { textAlign: "center" },
    styleCell: { textAlign: "center", color: "#5f6368" },
  },
  {
    name: "updatedBy",
    label: "Người cập nhật",
    type: STRING,
    style: { textAlign: "center" },
    styleCell: { color: "#5f6368" },
  },
];

export const buildAccountTableConfig = (roles: string[]): BaseTableColumn[] => {
  const btnGroup: ButtonProps[] = [];

  if (roles.includes(SUPERADMIN)) {
    btnGroup.push(
      BTN_LOCK_ACTION,
      BTN_DELETE_ACTION,
      BTN_EDIT_ACTION,
      BTN_APPROVE_ACTION,
      BTN_UNLOCK_ACTION,
    );
  } else if (roles.includes(ADMIN)) {
    btnGroup.push(
      BTN_LOCK_ACTION,
      BTN_DELETE_ACTION,
      BTN_EDIT_ACTION,
      BTN_UNLOCK_ACTION,
    );
  } else if (roles.includes(APPROVER)) {
    btnGroup.push(BTN_APPROVE_ACTION);
  } else if (roles.includes(USER)) {
    btnGroup.push(BTN_EDIT_ACTION);
  }

  return [
    ...COLUMNS_BASE,
    {
      name: "actions",
      label: "Thao tác",
      type: BUTTON,
      styleCell: { justifyContent: "flex-end" },
      btnGroup,
    },
  ];
};

export const showButtons = (
  refShow: string[],
  action: string,
  row: Record<string, unknown>,
  user?: ProfileUser | null,
) => {
  const status = row[refShow[0]] as string;
  const rolesCurr = Array.isArray(row.roles) ? row.roles : [];

  if (user?.username === row.username && ![BTN_EDIT].includes(action)) {
    return false;
  }

  if (rolesCurr.includes(ADMIN) && user?.username !== row.username) {
    return false;
  }

  if (status === ACTIVE && [BTN_EDIT, BTN_DELETE, BTN_LOCK].includes(action)) {
    return true;
  }
  if (
    status === LOCKED &&
    [BTN_EDIT, BTN_UNLOCK, BTN_DELETE].includes(action)
  ) {
    return true;
  }

  return false;
};
