export interface ScheduleAvatar {
  name: string;
  src?: string;
  color?: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  color: string;
  bgColor: string;
  avatars?: ScheduleAvatar[];
}

export type CalendarView = "month" | "week" | "day";

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export interface ScheduleResponse {
  id: number;
  title: string;
  content: string;
  scheduledAt: string;
  status: string;
  createdAt: string;
}

export interface ScheduleRequest {
  title: string;
  content: string;
  scheduledAt: string;
}
