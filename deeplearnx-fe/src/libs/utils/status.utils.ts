import {
  ACTIVE,
  APPROVED,
  APPROVING,
  LOCKED,
  REJECTED,
} from "../constants/status.constant";

export const parseStatusUser = (status: string) => {
  switch (status) {
    case ACTIVE:
      return "Hoạt động";
    case LOCKED:
      return "Khóa";
    case APPROVING:
      return "Chờ duyệt";
    case REJECTED:
      return "Từ chối";
    case APPROVED:
      return "Đã duyệt";
    default:
      return status;
  }
};
