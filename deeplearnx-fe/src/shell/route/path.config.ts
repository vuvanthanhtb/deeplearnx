import type { RouteMeta, PublicRouteMeta } from "@/libs/types/route.types";
import { HOME_CONFIG } from "@/modules/home/shell/home.route";
import { AUTH_CONFIG } from "@/modules/auth/shell/auth.route";
import { SCHEDULE_CONFIG } from "@/modules/schedule/shell/schedule.route";
import { COURSES_CONFIG } from "@/modules/courses/shell/courses.route";
import { LESSONS_CONFIG } from "@/modules/lessons/shell/lessons.route";
import { lazy } from "react";
import { ACCOUNTS_CONFIG } from "@/modules/accounts/shell/account.route";

export const PATHS_CONFIG: RouteMeta[] = [
  ...HOME_CONFIG,
  ...ACCOUNTS_CONFIG,
  ...COURSES_CONFIG,
  ...LESSONS_CONFIG,
  ...SCHEDULE_CONFIG,
];

export const PUBLIC_PATHS_CONFIG: PublicRouteMeta[] = [
  ...AUTH_CONFIG,
  {
    key: "oauth-callback",
    path: "/oauth-callback",
    component: lazy(() => import("@/libs/pages/oauth-callback")),
  },
  {
    key: "not-found",
    path: "*",
    component: lazy(() => import("@/libs/pages/not-found")),
  },
];
