import { lazy } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import type { RouteMeta } from "@/libs/types/route.types";

export const SCHEDULE_PATH = {
  BASE: "/lich",
};

export const SCHEDULE_CONFIG: RouteMeta[] = [
  {
    key: "schedule-main",
    path: SCHEDULE_PATH.BASE,
    pathOriginal: SCHEDULE_PATH.BASE,
    label: "Lịch",
    icon: <CalendarMonthIcon />,
    isAuth: true,
    roles: ["USER", "ADMIN"],
    hidden: false,
    component: lazy(() => import("@/modules/schedule/pages/schedule")),
  },
];
