import moment from "moment";
import dayjs from "dayjs";

const VI_DAYS = [
  "Chủ Nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
];

/** dd/MM/yyyy */
export const formatDate = (iso: string): string =>
  moment(iso.replace(" ", "T")).format("DD/MM/YYYY");

/** dd/MM/yyyy HH:mm */
export const formatDatetime = (iso: string): string =>
  moment(iso.replace(" ", "T")).format("DD/MM/YYYY HH:mm");

/** T2, 14:30 — 15/01/2025 */
export const formatScheduleTime = (iso: string): string => {
  const m = moment(iso.replace(" ", "T"));
  return `${VI_DAYS[m.day()]}, ${m.format("HH:mm")} — ${m.format("DD/MM/YYYY")}`;
};

/** YYYY-MM-DD — dùng làm map key nội bộ */
export const toDateKey = (date: Date): string =>
  moment(date).format("YYYY-MM-DD");

/** YYYY-MM-DDTHH:mm — dùng cho input datetime-local */
export const toInputDatetime = (iso: string): string =>
  moment(iso.replace(" ", "T")).format("YYYY-MM-DDTHH:mm");

/** So sánh với hiện tại */
export const isAfterNow = (iso: string): boolean =>
  moment(iso.replace(" ", "T")).isAfter(moment());

export const isToday = (date: Date): boolean =>
  moment(date).isSame(moment(), "day");

export const getDateFromNow = (
  offset: number = -90,
  format: string = "YYYY-MM-DD",
): string => {
  return dayjs().add(offset, "day").format(format);
};
