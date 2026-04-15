import { useEffect } from "react";

/**
 * Trang callback sau khi Google OAuth hoàn tất.
 * Google redirect đến đây với access_token trong URL fragment.
 * Trang này gửi postMessage lên cửa sổ cha rồi tự đóng.
 */
const OAuthCallbackPage = () => {
  useEffect(() => {
    const hash = window.location.hash.slice(1); // bỏ dấu #
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");

    if (accessToken && window.opener) {
      window.opener.postMessage(
        { type: "GOOGLE_AUTH_SUCCESS", accessToken },
        window.location.origin,
      );
    }

    // Tự đóng popup sau khi gửi message
    window.close();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "sans-serif",
        color: "#5f6368",
        fontSize: 14,
      }}
    >
      Đang xác thực...
    </div>
  );
};

export default OAuthCallbackPage;
