import { EVENT_PALETTES } from "./schedule.constants";
import type {
  CalendarDay,
  ScheduleEvent,
  ScheduleResponse,
} from "../../shell/schedule.type";
import { toDateKey, toInputDatetime, isToday } from "@/libs/utils/date.utils";

export { toDateKey, toInputDatetime };

export const buildCalendarDays = (
  year: number,
  month: number,
): CalendarDay[] => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const days: CalendarDay[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
      isToday: false,
    });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    days.push({ date, isCurrentMonth: true, isToday: isToday(date) });
  }
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
      isToday: false,
    });
  }
  return days;
};

export const mapToEvent = (s: ScheduleResponse): ScheduleEvent => {
  const palette = EVENT_PALETTES[s.id % EVENT_PALETTES.length];
  return {
    id: String(s.id),
    title: s.title,
    date: toDateKey(new Date(s.scheduledAt.replace(" ", "T"))),
    ...palette,
  };
};

export const buildEventsMap = (
  schedules: ScheduleResponse[],
): Record<string, ScheduleEvent[]> =>
  schedules.reduce<Record<string, ScheduleEvent[]>>((acc, s) => {
    const ev = mapToEvent(s);
    acc[ev.date] = [...(acc[ev.date] ?? []), ev];
    return acc;
  }, {});
