import { ADMIN, APPROVER, SUPERADMIN, USER } from "./roles.constant";
import {
  ACTIVE,
  LOCKED,
  APPROVED,
  REJECTED,
  APPROVING,
} from "./status.constant";

export const statusOptions = [
  { label: "Hoạt động", value: ACTIVE },
  { label: "Khóa", value: LOCKED },
  { label: "Chờ duyệt", value: APPROVING },
  { label: "Đã duyệt", value: APPROVED },
  { label: "Từ chối", value: REJECTED },
];

export const roleOptions = [
  { label: "Người dùng", value: USER },
  { label: "Quản trị viên", value: ADMIN },
  { label: "Người phê duyệt", value: APPROVER },
];

export const defaultSelectOption = { label: "Tất cả", value: "" };

export const roleSuperAdminOption = {
  label: "Quản trị viên hệ thống",
  value: SUPERADMIN,
};

export const statusUserApproveOptions = [
  { label: "Chờ duyệt", value: APPROVING },
  { label: "Đã duyệt", value: APPROVED },
  { label: "Từ chối", value: REJECTED },
];

export const statusUserOptions = [
  { label: "Hoạt động", value: ACTIVE },
  { label: "Khóa", value: LOCKED },
];
