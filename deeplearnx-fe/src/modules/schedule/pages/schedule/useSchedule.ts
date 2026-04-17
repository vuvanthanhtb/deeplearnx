import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/shell/redux/hooks";
import {
  getSchedules,
  createSchedule,
  updateSchedule,
} from "../../shell/schedule.slice";
import type { ScheduleResponse } from "../../shell/schedule.type";
import { scheduleInitialValues } from "./schedule.config";
import {
  toInputDatetime,
  buildCalendarDays,
  buildEventsMap,
} from "./schedule.utils";

const useSchedule = () => {
  const dispatch = useAppDispatch();
  const schedules = useAppSelector((state) => state.schedule.schedules);
  const loading = useAppSelector((state) => state.schedule.loading);

  useEffect(() => {
    document.title = "Lịch";
  }, []);

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [selected, setSelected] = useState<ScheduleResponse | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>(
    scheduleInitialValues,
  );

  useEffect(() => {
    dispatch(getSchedules());
  }, [dispatch]);

  const days = buildCalendarDays(currentYear, currentMonth);

  const eventsMap = buildEventsMap(schedules);

  const goPrev = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else setCurrentMonth((m) => m - 1);
  };
  const goNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else setCurrentMonth((m) => m + 1);
  };
  const goToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  const openCreate = () => {
    setMode("create");
    setSelected(null);
    setFormValues(scheduleInitialValues);
    setDialogOpen(true);
  };

  const openUpdate = (scheduleId: string) => {
    const s = schedules.find((x) => x.id === scheduleId);
    if (!s) return;
    setMode("update");
    setSelected(s);
    setFormValues({
      title: s.title,
      scheduledAt: toInputDatetime(s.scheduledAt),
      content: s.content,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    const payload = {
      title: String(data.title ?? ""),
      scheduledAt: String(data.scheduledAt ?? ""),
      content: String(data.content ?? ""),
    };

    let result;
    if (mode === "create") {
      result = await dispatch(createSchedule(payload));
      if (createSchedule.fulfilled.match(result)) setDialogOpen(false);
    } else if (selected) {
      result = await dispatch(
        updateSchedule({ id: selected.id, data: payload }),
      );
      if (updateSchedule.fulfilled.match(result)) setDialogOpen(false);
    }
  };

  return {
    loading,
    currentMonth,
    currentYear,
    days,
    eventsMap,
    goPrev,
    goNext,
    goToday,
    openCreate,
    openUpdate,
    dialogOpen,
    setDialogOpen,
    mode: mode === "create" ? "Tạo lịch mới" : "Cập nhật lịch",
    formValues,
    setFormValues,
    handleSubmit,
    dispatch,
  };
};

export default useSchedule;
