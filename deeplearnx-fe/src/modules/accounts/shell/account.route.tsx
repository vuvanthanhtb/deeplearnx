import { lazy } from "react";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import type { RouteMeta } from "@/libs/types/route.types";
import { ADMIN } from "@/libs/constants/roles.constant";

export const ACCOUNTS_PATH = {
  BASE: "/tai-khoan",
};

export const ACCOUNTS_CONFIG: RouteMeta[] = [
  {
    key: "accounts-main",
    path: ACCOUNTS_PATH.BASE,
    pathOriginal: ACCOUNTS_PATH.BASE,
    label: "Tài khoản",
    icon: <AdminPanelSettingsIcon />,
    isAuth: true,
    roles: [ADMIN],
    hidden: false,
    component: lazy(() => import("@/modules/accounts/pages")),
  },
];
