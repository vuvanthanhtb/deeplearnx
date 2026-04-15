import { ACTIVE, INACTIVE } from "@/libs/constants/status.constant";
import styles from "./course-list.module.scss";

export const CARD_COLORS = [
  { bg: "#1a73e8", light: "#e8f0fe" },
  { bg: "#188038", light: "#e6f4ea" },
  { bg: "#b5179e", light: "#fce4ec" },
  { bg: "#e37400", light: "#fff3e0" },
  { bg: "#00796b", light: "#e0f2f1" },
  { bg: "#c62828", light: "#fce8e6" },
];

export const getStatusClass = (status: string) => {
  if (status === ACTIVE) return styles.chipActive;
  if (status === INACTIVE) return styles.chipInactive;
  return styles.chipDefault;
};

export const getStatusLabel = (status: string) => {
  if (status === ACTIVE) return "Đang hoạt động";
  if (status === INACTIVE) return "Không hoạt động";
  return status || "N/A";
};
