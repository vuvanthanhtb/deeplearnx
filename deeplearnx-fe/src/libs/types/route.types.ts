import type { LazyExoticComponent, ComponentType } from "react";

export type RouteMeta = {
  key: string;
  path: string;
  pathOriginal: string;
  label?: string;
  roles: string[];
  icon?: React.ReactNode | string;
  hidden?: boolean;
  isAuth: boolean;
  component: LazyExoticComponent<ComponentType<Record<string, never>>>;
};

export type PublicRouteMeta = {
  key: string;
  path: string;
  component: LazyExoticComponent<ComponentType<Record<string, never>>>;
};
