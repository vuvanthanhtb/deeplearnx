export const SUCCESS_CODE = {
  AUTH_LOGIN: "Đăng nhập thành công.",
  AUTH_LOGOUT: "Đăng xuất thành công.",
  SCHEDULE_CREATE: "Tạo lịch thành công.",
  SCHEDULE_UPDATE: "Cập nhật lịch thành công.",
  COURSE_CREATE: "Tạo khóa học thành công.",
  COURSE_UPDATE: "Cập nhật khóa học thành công.",
  COURSE_DELETE: "Xóa khóa học thành công.",
  LESSON_CREATE: "Tạo bài học thành công.",
  LESSON_UPDATE: "Cập nhật bài học thành công.",
  LESSON_DELETE: "Xóa bài học thành công.",
  ACCOUNT_CREATE: "Tạo tài khoản thành công.",
  ACCOUNT_UPDATE: "Cập nhật tài khoản thành công.",
  ACCOUNT_DELETE: "Xóa tài khoản thành công.",
  ACCOUNT_LOCK: "Khóa tài khoản thành công.",
  ACCOUNT_UNLOCK: "Mở khóa tài khoản thành công.",
  ACCOUNT_APPROVE: "Phê duyệt tài khoản thành công.",
  ACCOUNT_REJECT: "Từ chối tài khoản thành công.",
  ACCOUNT_BULK_APPROVE: "Phê duyệt tài khoản thành công.",
  ACCOUNT_BULK_REJECT: "Từ chối tài khoản thành công.",
};

export const ERROR_CODE = {
  PB_TAG_1001: "Tag not empty",

  ERR_SESSION_EXPIRED: "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.",
  ERR_FORBIDDEN_ACCESS:
    "Bạn không có quyền truy cập. Vui lòng liên hệ với quản trị viên.",
};

const MESS_DEFAULT = "Hệ thống đang bận. Vui lòng thử lại sau.";

export const formatMessage = (errorCode: string, message?: string | null) => {
  if (message) {
    if (message === "SYSTEM_ERROR") {
      return MESS_DEFAULT;
    }
    return message;
  }
  return ERROR_CODE[errorCode as keyof typeof ERROR_CODE] || errorCode;
};
