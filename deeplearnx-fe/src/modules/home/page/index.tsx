import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import moment from "moment";

import { useAppDispatch, useAppSelector } from "@/shell/redux/hooks";
import { getCourses } from "@/modules/courses/shell/courses.slice";
import { getSchedules } from "@/modules/schedule/shell/schedule.slice";
import { COURSES_PATH } from "@/modules/courses/shell/courses.route";
import { SCHEDULE_PATH } from "@/modules/schedule/shell/schedule.route";
import { formatScheduleTime, isAfterNow } from "@/libs/utils/date.utils";
import styles from "./home.module.scss";
import { PAGE_SIZE_NO_LIMIT } from "@/libs/constants/table.constant";

const SCHEDULE_PALETTES = [
  { color: "#1565c0", bg: "#e3f0fd" },
  { color: "#2e7d32", bg: "#e8f5e9" },
  { color: "#6a1b9a", bg: "#f3e5f5" },
  { color: "#e65100", bg: "#fff3e0" },
  { color: "#00695c", bg: "#e0f2f1" },
  { color: "#c62828", bg: "#ffebee" },
];

const HomePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.auth.user);
  const courses = useAppSelector((state) => state.courses.courseTable.content);
  const totalCourses = useAppSelector(
    (state) => state.courses.courseTable.totalElements,
  );
  const loadingCourses = useAppSelector((state) => state.courses.loading);
  const schedules = useAppSelector((state) => state.schedule.schedules);

  useEffect(() => {
    dispatch(
      getCourses({
        name: "",
        page: PAGE_SIZE_NO_LIMIT.pageIndex,
        size: PAGE_SIZE_NO_LIMIT.pageSize,
      }),
    );
    dispatch(getSchedules());
  }, [dispatch]);

  const displayName = user?.fullName ?? user?.username ?? "bạn";

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Chào buổi sáng";
    if (h < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  const upcomingSchedules = useMemo(
    () =>
      schedules
        .filter((s) => isAfterNow(s.scheduledAt))
        .sort(
          (a, b) =>
            moment(a.scheduledAt.replace(" ", "T")).valueOf() -
            moment(b.scheduledAt.replace(" ", "T")).valueOf(),
        )
        .slice(0, 5),
    [schedules],
  );

  const recentCourses = courses.slice(0, 6);

  const stats = [
    {
      label: "Tổng khóa học",
      value: totalCourses,
      icon: <SchoolIcon sx={{ fontSize: 22 }} />,
      color: "#1a73e8",
      bg: "#e8f0fe",
      onClick: () => navigate(COURSES_PATH.BASE),
    },
    {
      label: "Lịch sắp tới",
      value: upcomingSchedules.length,
      icon: <CalendarMonthIcon sx={{ fontSize: 22 }} />,
      color: "#f29900",
      bg: "#fef7e0",
      onClick: () => navigate(SCHEDULE_PATH.BASE),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* ── Banner ── */}
        <div className={styles.banner}>
          <div className={styles.bannerText}>
            <h2>
              {greeting()}, {displayName}!
            </h2>
            <p>Tiếp tục hành trình học tập của bạn hôm nay.</p>
          </div>
          <AutoAwesomeIcon className={styles.bannerIcon} />
        </div>

        {/* ── Stats ── */}
        <div className={styles.stats}>
          {stats.map((s) => (
            <div key={s.label} className={styles.statCard} onClick={s.onClick}>
              <div
                className={styles.statIcon}
                style={{ background: s.bg, color: s.color }}
              >
                {s.icon}
              </div>
              <div className={styles.statInfo}>
                {loadingCourses ? (
                  <Skeleton width={40} height={30} />
                ) : (
                  <p className={styles.statValue}>{s.value}</p>
                )}
                <p className={styles.statLabel}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main grid ── */}
        <div className={styles.grid}>
          {/* ── Khóa học gần đây ── */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>
                <SchoolIcon sx={{ fontSize: 18, color: "#1a73e8" }} />
                Khóa học gần đây
              </span>
              <span
                className={styles.cardLink}
                onClick={() => navigate(COURSES_PATH.BASE)}
              >
                Xem tất cả →
              </span>
            </div>

            {loadingCourses ? (
              <div className={styles.skeletonWrap}>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} height={20} />
                ))}
              </div>
            ) : recentCourses.length === 0 ? (
              <div className={styles.empty}>
                Chưa có khóa học nào.{" "}
                <span
                  style={{ color: "#1a73e8", cursor: "pointer" }}
                  onClick={() => navigate(COURSES_PATH.BASE)}
                >
                  Tạo ngay
                </span>
              </div>
            ) : (
              <ul className={styles.courseList}>
                {recentCourses.map((course) => (
                  <li key={course.id} className={styles.courseItem}>
                    <div className={styles.courseAvatar}>
                      <SchoolIcon sx={{ fontSize: 18 }} />
                    </div>
                    <div className={styles.courseInfo}>
                      <p className={styles.courseName}>{course.name}</p>
                      <p className={styles.courseDate}>{course.createdAt}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ── Lịch sắp tới ── */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>
                <CalendarMonthIcon sx={{ fontSize: 18, color: "#1a73e8" }} />
                Lịch sắp tới
              </span>
              <span
                className={styles.cardLink}
                onClick={() => navigate(SCHEDULE_PATH.BASE)}
              >
                Xem lịch →
              </span>
            </div>

            {upcomingSchedules.length === 0 ? (
              <div className={styles.empty}>Không có lịch sắp tới.</div>
            ) : (
              <ul className={styles.scheduleList}>
                {upcomingSchedules.map((event) => {
                  const palette =
                    SCHEDULE_PALETTES[event.id % SCHEDULE_PALETTES.length];
                  return (
                    <li
                      key={event.id}
                      className={styles.scheduleItem}
                      style={{
                        background: palette.bg,
                        borderLeftColor: palette.color,
                      }}
                    >
                      <p
                        className={styles.scheduleTitle}
                        style={{ color: palette.color }}
                      >
                        {event.title}
                      </p>
                      <p className={styles.scheduleTime}>
                        <AccessTimeIcon sx={{ fontSize: 13 }} />
                        {formatScheduleTime(event.scheduledAt)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
