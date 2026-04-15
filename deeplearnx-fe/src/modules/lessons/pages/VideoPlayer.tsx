import { useEffect, useRef, useState } from "react";
import Vlitejs from "vlitejs";
import "vlitejs/vlite.css";
import LockIcon from "@mui/icons-material/Lock";
import GoogleIcon from "@mui/icons-material/Google";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import {
  extractPrivateYoutubeId,
  isYoutubePrivateEnabled,
  YOUTUBE_CONFIG,
} from "@/libs/config/youtube.config";
import { useGoogleAuth } from "@/libs/hooks/useGoogleAuth";

type VideoType = "youtube-private" | "youtube" | "vimeo" | "html5";

function detectVideoType(url: string): VideoType {
  if (url.startsWith(YOUTUBE_CONFIG.privateScheme)) return "youtube-private";
  if (/(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)/.test(url))
    return "youtube";
  if (/vimeo\.com\//.test(url)) return "vimeo";
  return "html5";
}

function extractYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

// ── YouTube public ─────────────────────────────────────────────────────────────
function YoutubePlayer({ url }: { url: string }) {
  const videoId = extractYoutubeId(url);
  if (!videoId) return <UnsupportedVideo url={url} />;
  return (
    <iframe
      key={url}
      src={`https://www.youtube.com/embed/${videoId}?rel=0`}
      style={{ width: "100%", height: "100%", border: "none", display: "block" }}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      title="YouTube video player"
    />
  );
}

// ── YouTube private ────────────────────────────────────────────────────────────
function YoutubePrivatePlayer({ url }: { url: string }) {
  const videoId = extractPrivateYoutubeId(url);
  const { status, signIn } = useGoogleAuth();
  const [activated, setActivated] = useState(false);

  if (!videoId) return <UnsupportedVideo url={url} />;

  if (!isYoutubePrivateEnabled()) {
    return (
      <ActivationUnavailable message="VITE_GOOGLE_CLIENT_ID chưa được cấu hình trong file .env" />
    );
  }

  const handleActivate = async () => {
    const ok = await signIn();
    if (ok) setActivated(true);
  };

  if (activated) {
    return (
      <iframe
        key={videoId}
        src={`https://www.youtube.com/embed/${videoId}?rel=0`}
        style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        title="YouTube private video player"
      />
    );
  }

  return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        <LockIcon sx={{ fontSize: 48, color: "#9ea3a8", mb: 1 }} />
        <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 15, color: "#fff" }}>
          Video riêng tư
        </p>
        <p style={{ margin: "0 0 20px", fontSize: 13, color: "#9ea3a8", textAlign: "center" }}>
          Bạn cần đăng nhập Google để xem nội dung này.
        </p>

        {status === "error" && (
          <div style={alertStyle}>
            <ErrorOutlineIcon sx={{ fontSize: 16 }} />
            <span>Chưa cấu hình Google Client ID.</span>
          </div>
        )}

        {status === "success" && !activated && (
          <div style={{ ...alertStyle, background: "#e6f4ea", color: "#1e8e3e" }}>
            <CheckCircleIcon sx={{ fontSize: 16 }} />
            <span>Đăng nhập thành công!</span>
          </div>
        )}

        <button
          onClick={handleActivate}
          disabled={status === "pending"}
          style={activateBtnStyle(status === "pending")}
        >
          <GoogleIcon sx={{ fontSize: 18 }} />
          {status === "pending" ? "Đang xác thực..." : "Kích hoạt với Google"}
        </button>
      </div>
    </div>
  );
}

// ── Vimeo ──────────────────────────────────────────────────────────────────────
function VimeoPlayer({ url }: { url: string }) {
  const videoId = extractVimeoId(url);
  if (!videoId) return <UnsupportedVideo url={url} />;
  return (
    <iframe
      key={url}
      src={`https://player.vimeo.com/video/${videoId}?badge=0&autopause=0`}
      style={{ width: "100%", height: "100%", border: "none", display: "block" }}
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      title="Vimeo video player"
    />
  );
}

// ── HTML5 / vlitejs ────────────────────────────────────────────────────────────
function Html5Player({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Vlitejs | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const videoEl = document.createElement("video");
    videoEl.src = url;
    videoEl.setAttribute("playsinline", "");
    container.appendChild(videoEl);

    try {
      playerRef.current = new Vlitejs(videoEl, {
        options: { controls: true, fullscreen: true, playsinline: true },
      });
    } catch {
      videoEl.controls = true;
      videoEl.style.cssText = "width:100%;height:100%;display:block;";
    }

    return () => {
      try {
        playerRef.current?.destroy();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
      container.innerHTML = "";
    };
  }, [url]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", background: "#000" }} />
  );
}

// ── Fallbacks ──────────────────────────────────────────────────────────────────
function UnsupportedVideo({ url }: { url: string }) {
  return (
    <div style={overlayStyle}>
      <div style={{ ...cardStyle, gap: 6 }}>
        <span style={{ fontSize: 13, color: "#9ea3a8" }}>Không thể phát video.</span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#1a73e8", fontSize: 12, wordBreak: "break-all" }}
        >
          Mở liên kết gốc
        </a>
      </div>
    </div>
  );
}

function ActivationUnavailable({ message }: { message: string }) {
  return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        <ErrorOutlineIcon sx={{ fontSize: 40, color: "#e37400" }} />
        <p style={{ margin: 0, fontSize: 13, color: "#9ea3a8", textAlign: "center" }}>
          {message}
        </p>
      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const overlayStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#1c1d1f",
};

const cardStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "32px 40px",
  background: "#2d2f31",
  borderRadius: 12,
  maxWidth: 360,
  width: "100%",
};

const alertStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 12px",
  borderRadius: 6,
  background: "#fce8e6",
  color: "#d93025",
  fontSize: 12,
  marginBottom: 12,
  width: "100%",
};

const activateBtnStyle = (disabled: boolean): React.CSSProperties => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 20px",
  borderRadius: 6,
  border: "none",
  background: disabled ? "#3e4143" : "#1a73e8",
  color: "#fff",
  fontSize: 14,
  fontWeight: 500,
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.7 : 1,
  transition: "background 0.15s",
  width: "100%",
  justifyContent: "center",
});

// ── Main export ────────────────────────────────────────────────────────────────
const VideoPlayer = ({ url }: { url: string }) => {
  const type = detectVideoType(url);

  if (type === "youtube-private") return <YoutubePrivatePlayer url={url} />;
  if (type === "youtube") return <YoutubePlayer url={url} />;
  if (type === "vimeo") return <VimeoPlayer url={url} />;
  return <Html5Player url={url} />;
};

export default VideoPlayer;
