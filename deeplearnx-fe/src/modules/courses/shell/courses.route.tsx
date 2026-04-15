import { lazy } from "react";
import SchoolIcon from "@mui/icons-material/School";
import type { RouteMeta } from "@/libs/types/route.types";
import { ADMIN, USER } from "@/libs/constants/roles.constant";

export const COURSES_PATH = {
  BASE: "/khoa-hoc",
};

export const COURSES_CONFIG: RouteMeta[] = [
  {
    key: "courses-main",
    path: COURSES_PATH.BASE,
    pathOriginal: COURSES_PATH.BASE,
    label: "Khóa học",
    icon: <SchoolIcon />,
    isAuth: true,
    roles: [USER, ADMIN],
    hidden: false,
    component: lazy(() => import("@/modules/courses/pages")),
  },
];
