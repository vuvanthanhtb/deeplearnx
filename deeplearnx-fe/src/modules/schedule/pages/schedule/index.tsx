import { IconButton, Avatar } from "@mui/material";
import BaseDrawerComponent from "@/libs/components/ui/base-drawer";
import ButtonComponent from "@/libs/components/ui/button";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { getSchedules } from "../../shell/schedule.slice";
import BaseFormComponent from "@/libs/components/ui/base-form";
import { scheduleConfig } from "./schedule.config";
import { scheduleSchema } from "./schedule.validation";
import styles from "./schedule.module.scss";
import { DAY_NAMES, MONTH_NAMES } from "./schedule.constants";
import useSchedule from "./useSchedule";
import { toDateKey } from "./schedule.utils";

const SchedulePage = () => {
  const {
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
    mode,
    formValues,
    setFormValues,
    handleSubmit,
    dispatch,
  } = useSchedule();

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <CalendarMonthIcon sx={{ color: "#1a73e8", fontSize: 28 }} />
          <span className={styles.title}>Lịch</span>
        </div>

        <div className={styles.headerActions}>
          <ButtonComponent
            type="button"
            title="Tạo lịch"
            action="create"
            onClick={openCreate}
          />
        </div>
      </div>

      <div className={styles.nav}>
        <div className={styles.navLeft}>
          <ButtonComponent
            type="button"
            title="Hôm nay"
            action="today"
            className={styles.todayBtn}
            onClick={goToday}
            style={{
              background: "inherit",
              border: "1px solid #26c55b",
            }}
          />
          <IconButton size="small" onClick={goPrev}>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={goNext}>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
          <span className={styles.monthLabel}>
            {MONTH_NAMES[currentMonth]} {currentYear}
          </span>
        </div>

        <div className={styles.navRight}>
          <ButtonComponent
            type="button"
            title={loading ? "Đang tải..." : "Đồng bộ"}
            action="sync"
            className={styles.syncBtn}
            disabled={loading}
            isLoading={loading}
            onClick={() => dispatch(getSchedules())}
            style={{
              border: "1px solid #26c55b",
              background: "inherit",
            }}
          />
        </div>
      </div>

      <div className={styles.calendarContainer}>
        <div className={styles.dayHeaders}>
          {DAY_NAMES.map((d) => (
            <div key={d} className={styles.dayHeaderCell}>
              {d}
            </div>
          ))}
        </div>

        <div className={styles.calendarGrid}>
          {days.map((day, idx) => {
            const key = toDateKey(day.date);
            const dayEvents = eventsMap[key] ?? [];
            const visible = dayEvents.slice(0, 3);
            const overflow = dayEvents.length - visible.length;

            return (
              <div
                key={idx}
                className={`${styles.dayCell} ${!day.isCurrentMonth ? styles.otherMonth : ""}`}
              >
                <div
                  className={`${styles.dateNumber} ${day.isToday ? styles.today : ""}`}
                >
                  {day.date.getDate()}
                </div>

                <div className={styles.events}>
                  {visible.map((ev) => (
                    <div
                      key={ev.id}
                      className={styles.event}
                      style={{
                        backgroundColor: ev.bgColor,
                        color: ev.color,
                        cursor: "pointer",
                      }}
                      onClick={() => openUpdate(ev.id)}
                    >
                      <span className={styles.eventTitle}>{ev.title}</span>
                      {ev.avatars && ev.avatars.length > 0 && (
                        <div className={styles.avatarGroup}>
                          {ev.avatars.slice(0, 3).map((a, i) => (
                            <Avatar
                              key={i}
                              className={styles.avatar}
                              sx={{
                                bgcolor: a.color,
                                width: 18,
                                height: 18,
                                fontSize: 9,
                              }}
                            >
                              {a.name}
                            </Avatar>
                          ))}
                          {ev.avatars.length > 3 && (
                            <span style={{ fontSize: 10, color: ev.color }}>
                              +{ev.avatars.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {overflow > 0 && (
                    <span className={styles.moreCount}>
                      +{overflow} sự kiện
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BaseDrawerComponent
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={mode}
      >
        <BaseFormComponent
          formConfig={scheduleConfig}
          validationSchema={scheduleSchema}
          values={formValues}
          onChange={setFormValues}
          handlers={{ close: () => setDialogOpen(false), submit: handleSubmit }}
        />
      </BaseDrawerComponent>
    </div>
  );
};

export default SchedulePage;
