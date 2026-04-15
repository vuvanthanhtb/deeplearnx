/**
 * File cấu hình nội bộ cho tính năng kích hoạt video YouTube riêng tư.
 * Điền VITE_GOOGLE_CLIENT_ID vào file .env để bật tính năng này.
 *
 * Cách lấy Client ID:
 *  1. Vào https://console.cloud.google.com
 *  2. Tạo project → APIs & Services → Credentials
 *  3. Create OAuth 2.0 Client ID (loại: Web application)
 *  4. Thêm Authorized redirect URI: <ORIGIN>/oauth-callback
 */

export const YOUTUBE_CONFIG = {
  /** Google OAuth 2.0 Client ID — đọc từ .env */
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined,

  /** Scope tối thiểu để xem video YouTube */
  scope: "https://www.googleapis.com/auth/youtube.readonly",

  /** Đường dẫn callback sau OAuth */
  callbackPath: "/oauth-callback",

  /** Prefix nhận diện URL video YouTube riêng tư */
  privateScheme: "youtube-private://",
} as const;

/** Kiểm tra feature đã được cấu hình chưa */
export const isYoutubePrivateEnabled = (): boolean =>
  Boolean(YOUTUBE_CONFIG.clientId);

/** Trích xuất video ID từ URL riêng tư (youtube-private://VIDEO_ID) */
export const extractPrivateYoutubeId = (url: string): string | null => {
  if (!url.startsWith(YOUTUBE_CONFIG.privateScheme)) return null;
  const id = url.slice(YOUTUBE_CONFIG.privateScheme.length).trim();
  return id || null;
};
