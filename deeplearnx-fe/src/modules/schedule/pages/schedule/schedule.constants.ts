import type { CalendarView } from "../../shell/schedule.type";

export const DAY_NAMES = [
  "Chủ Nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
];

export const MONTH_NAMES = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

export const VIEW_LABELS: Record<CalendarView, string> = {
  month: "Tháng",
  week: "Tuần",
  day: "Ngày",
};

export const EVENT_PALETTES = [
  { color: "#2e7d32", bgColor: "#c8e6c9" },
  { color: "#1565c0", bgColor: "#bbdefb" },
  { color: "#6a1b9a", bgColor: "#e1bee7" },
  { color: "#e65100", bgColor: "#ffe0b2" },
  { color: "#00695c", bgColor: "#b2dfdb" },
  { color: "#c62828", bgColor: "#ffcdd2" },
];
