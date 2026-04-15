import { lazy } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import type { RouteMeta } from "@/libs/types/route.types";
import { USER, ADMIN } from "@/libs/constants/roles.constant";

export const LESSONS_PATH = {
  BASE: "/khoa-hoc/:courseSlug",
  of: (courseSlug: string) => `/khoa-hoc/${courseSlug}`,
};

export const LESSONS_CONFIG: RouteMeta[] = [
  {
    key: "lessons-main",
    path: LESSONS_PATH.BASE,
    pathOriginal: LESSONS_PATH.BASE,
    label: "Bài học",
    icon: <MenuBookIcon />,
    isAuth: true,
    roles: [USER, ADMIN],
    hidden: true,
    component: lazy(() => import("@/modules/lessons/pages")),
  },
];
