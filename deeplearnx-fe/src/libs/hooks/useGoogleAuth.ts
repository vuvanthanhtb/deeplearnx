import { useCallback, useRef, useState } from "react";
import { YOUTUBE_CONFIG } from "@/libs/config/youtube.config";

export type GoogleAuthState = "idle" | "pending" | "success" | "error";

interface UseGoogleAuthResult {
  status: GoogleAuthState;
  /** Mở popup đăng nhập Google. Trả về true nếu thành công. */
  signIn: () => Promise<boolean>;
  reset: () => void;
}

/**
 * Hook kích hoạt đăng nhập Google qua OAuth2 Implicit Flow.
 * Sau khi đăng nhập thành công, YouTube iframe sẽ dùng
 * session Google của trình duyệt để phát video riêng tư.
 */
export function useGoogleAuth(): UseGoogleAuthResult {
  const [status, setStatus] = useState<GoogleAuthState>("idle");
  const popupRef = useRef<Window | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const signIn = useCallback((): Promise<boolean> => {
    const clientId = YOUTUBE_CONFIG.clientId;
    if (!clientId) {
      console.error("[useGoogleAuth] VITE_GOOGLE_CLIENT_ID chưa được cấu hình.");
      setStatus("error");
      return Promise.resolve(false);
    }

    return new Promise((resolve) => {
      setStatus("pending");

      const redirectUri = `${window.location.origin}${YOUTUBE_CONFIG.callbackPath}`;
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "token",
        scope: YOUTUBE_CONFIG.scope,
        prompt: "select_account",
      });

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
      const width = 500;
      const height = 620;
      const left = window.screenX + (window.innerWidth - width) / 2;
      const top = window.screenY + (window.innerHeight - height) / 2;

      popupRef.current = window.open(
        authUrl,
        "google-auth",
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no`,
      );

      // Lắng nghe kết quả từ callback page qua postMessage
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        if (event.data?.type !== "GOOGLE_AUTH_SUCCESS") return;

        cleanup();
        window.removeEventListener("message", handleMessage);
        popupRef.current?.close();
        setStatus("success");
        resolve(true);
      };

      window.addEventListener("message", handleMessage);

      // Fallback: phát hiện popup bị đóng mà không hoàn thành
      timerRef.current = setInterval(() => {
        if (popupRef.current?.closed) {
          cleanup();
          window.removeEventListener("message", handleMessage);
          if (status !== "success") {
            setStatus("idle");
            resolve(false);
          }
        }
      }, 500);
    });
  }, [status]);

  const reset = useCallback(() => {
    cleanup();
    setStatus("idle");
  }, []);

  return { status, signIn, reset };
}
