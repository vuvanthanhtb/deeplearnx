import type { RouteMeta } from "@/libs/types/route.types";

export const matchRoute = (
  routes: RouteMeta[],
  pathname: string,
): RouteMeta | undefined => {
  return routes.find(
    (r) => pathname === r.path || pathname.startsWith(`${r.path}/`),
  );
};
