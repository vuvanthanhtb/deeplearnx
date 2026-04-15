import { ACTIVE, INACTIVE } from "@/libs/constants/status.constant";
import styles from "./lesson-list.module.scss";

export const getStatusClass = (status: string) => {
  if (status === ACTIVE) return styles.chipActive;
  if (status === INACTIVE) return styles.chipInactive;
  return styles.chipDefault;
};

export const getStatusLabel = (status: string) => {
  if (status === ACTIVE) return "Hoạt động";
  if (status === INACTIVE) return "Ẩn";
  return status || "N/A";
};
