import { lazy } from "react";
import type { PublicRouteMeta } from "@/libs/types/route.types";

export const AUTH_PATH = {
  BASE: "/dang-nhap",
  LOGIN: "/dang-nhap",
  REGISTER: "/dang-ky",
};

export const AUTH_CONFIG: PublicRouteMeta[] = [
  {
    key: "auth-login",
    path: AUTH_PATH.LOGIN,
    component: lazy(() => import("@/modules/auth/page/login")),
  },
  {
    key: "auth-register",
    path: AUTH_PATH.REGISTER,
    component: lazy(() => import("@/modules/auth/page/register")),
  },
];
