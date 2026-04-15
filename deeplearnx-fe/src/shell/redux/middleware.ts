import { type Middleware } from "@reduxjs/toolkit";

import { startLoading, stopLoading } from "./loading.slice";

export const loadingMiddleware: Middleware =
  (storeAPI) => (next) => (action) => {
    const { type } = action as { type: string };

    if (type.endsWith("/pending")) {
      storeAPI.dispatch(startLoading());
    } else if (type.endsWith("/fulfilled") || type.endsWith("/rejected")) {
      storeAPI.dispatch(stopLoading());
    }

    return next(action);
  };
