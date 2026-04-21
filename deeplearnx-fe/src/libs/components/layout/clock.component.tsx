import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

const ClockComponent = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = now.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const dateStr = now.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        alignItems: "center",
        lineHeight: 1.2,
      }}
    >
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 700,
          color: "#1a73e8",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: 1,
        }}
      >
        {timeStr}
      </Typography>
      <Typography sx={{ fontSize: 11, color: "#5f6368", textTransform: "capitalize" }}>
        {dateStr}
      </Typography>
    </Box>
  );
};

export default ClockComponent;
