import type { JSX } from "react";
import { useLocation, Navigate } from "react-router-dom";

import { useAppSelector } from "@/shell/redux/hooks";
import { AUTH_PATH } from "@/modules/auth/shell/auth.route";
import AccessDeniedComponent from "@/libs/components/access-denied";

import { matchRoute } from "./helpers";
import { PATHS_CONFIG } from "./path.config";
import { SUPERADMIN } from "@/libs/constants/roles.constant";

type Props = {
  children: JSX.Element;
};

const PrivateRoute = ({ children }: Props) => {
  const location = useLocation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const userRoles = useAppSelector((state) => state.auth.roles);
  const route = matchRoute(PATHS_CONFIG, location.pathname);

  if (!isAuthenticated) {
    return <Navigate to={AUTH_PATH.LOGIN} replace state={{ from: location }} />;
  }

  if (userRoles.includes(SUPERADMIN)) {
    return children;
  }

  if (!route?.isAuth) {
    return children;
  }

  if (userRoles.some((role) => route.roles.includes(role))) {
    return children;
  }

  return <AccessDeniedComponent />;
};

export default PrivateRoute;
