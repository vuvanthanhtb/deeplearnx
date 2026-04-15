import { ADMIN, APPROVER, SUPERADMIN, USER } from "../constants/roles.constant";

export const getRoleName = (role: string) => {
  switch (role.toUpperCase()) {
    case USER:
      return "Người dùng";
    case ADMIN:
      return "Quản trị viên";
    case SUPERADMIN:
      return "Quản trị viên hệ thống";
    case APPROVER:
      return "Người phê duyệt";
    default:
      return "";
  }
};
