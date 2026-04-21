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
  ACCOUNT_BULK_APPROVE: "Phê duyệt hàng loạt thành công.",
  ACCOUNT_BULK_REJECT: "Từ chối hàng loạt thành công.",
};

export const ERROR_MESSAGE_MAP: Record<string, string> = {
  // Session / Access
  ERR_SESSION_EXPIRED: "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.",
  ERR_FORBIDDEN_ACCESS:
    "Bạn không có quyền truy cập. Vui lòng liên hệ quản trị viên.",
  UNAUTHORIZED: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.",
  ACCESS_DENIED: "Bạn không có quyền thực hiện thao tác này.",
  INVALID_ID_FORMAT: "Định dạng ID không hợp lệ.",
  INTERNAL_SERVER_ERROR: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.",
  SYSTEM_ERROR: "Hệ thống đang bận. Vui lòng thử lại sau.",

  // Auth
  INVALID_CREDENTIALS: "Tên đăng nhập hoặc mật khẩu không đúng.",
  ACCOUNT_LOCKED: "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.",
  ACCOUNT_DISABLED:
    "Tài khoản chưa được kích hoạt. Vui lòng liên hệ quản trị viên.",

  // English phrases from backend
  "Access denied": "Bạn không có quyền thực hiện thao tác này.",
  "Invalid id format": "Định dạng ID không hợp lệ.",
  "An unexpected error occurred. Please try again later.":
    "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.",
  "Username already exists": "Tên đăng nhập đã tồn tại.",
  "Email already exists": "Email đã tồn tại.",
  "User not found": "Không tìm thấy người dùng.",
  "User approval request not found": "Không tìm thấy yêu cầu phê duyệt.",
  "This approval request has already been processed":
    "Yêu cầu phê duyệt này đã được xử lý.",
  "Admin cannot perform this action on a privileged account":
    "Quản trị viên không thể thực hiện thao tác này trên tài khoản có quyền cao hơn.",
  "Superadmin cannot perform this action on their own account":
    "Superadmin không thể thực hiện thao tác này trên tài khoản của chính mình.",
};

const DEFAULT_MESSAGE = "Hệ thống đang bận. Vui lòng thử lại sau.";

export const formatMessage = (code: string): string =>
  ERROR_MESSAGE_MAP[code] ?? (code.trim() ? code : DEFAULT_MESSAGE);
