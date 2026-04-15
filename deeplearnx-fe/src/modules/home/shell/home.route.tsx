import { lazy } from "react";
import HomeIcon from "@mui/icons-material/Home";
import type { RouteMeta } from "@/libs/types/route.types";

export const HOME_PATH = {
  BASE: "/",
};

export const HOME_CONFIG: RouteMeta[] = [
  {
    key: "Cq53Dbde",
    path: HOME_PATH.BASE,
    pathOriginal: HOME_PATH.BASE,
    label: "Trang chủ",
    icon: <HomeIcon />,
    isAuth: false,
    roles: [],
    hidden: true,
    component: lazy(() => import("@/modules/home/page")),
  },
];
