import {
  combineReducers,
  configureStore,
  createListenerMiddleware,
  type UnknownAction,
} from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import loadingReducer from "./loading.slice";

const storage = {
  getItem: (key: string) => Promise.resolve(window.localStorage.getItem(key)),
  setItem: (key: string, value: string) => {
    window.localStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: (key: string) => {
    window.localStorage.removeItem(key);
    return Promise.resolve();
  },
};

import authReducer, {
  logout,
  logoutUser,
} from "@/modules/auth/shell/auth.slice";
import { loadingMiddleware } from "./middleware";
import scheduleReducer from "@/modules/schedule/shell/schedule.slice";
import coursesReducer from "@/modules/courses/shell/courses.slice";
import lessonsReducer from "@/modules/lessons/shell/lessons.slice";
import accountsReducer from "@/modules/accounts/shell/account.slice";

const appReducer = combineReducers({
  app: loadingReducer,
  auth: authReducer,
  accounts: accountsReducer,
  schedule: scheduleReducer,
  courses: coursesReducer,
  lessons: lessonsReducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: UnknownAction,
) => {
  if (action.type === "auth/logout") {
    state = undefined; // 💣 reset toàn bộ store về initialState của từng slice
  }
  return appReducer(state, action);
};

// ⚡ Performance: Throttle persist writes to reduce localStorage operations
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth"],
  throttle: 1000, // Write to localStorage max once per second
  // This prevents excessive writes and improves performance
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// listener middleware để purge chỉ khi logoutUser.fulfilled
const listenerMiddleware = createListenerMiddleware();

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .prepend(listenerMiddleware.middleware)
      .concat(loadingMiddleware),
});

export const persistor = persistStore(store);

// đăng ký listener sau khi persistor đã có
listenerMiddleware.startListening({
  actionCreator: logoutUser.fulfilled,
  effect: async (_action, api) => {
    // chỉ purge khi logout API OK
    await persistor.flush();
    await persistor.purge();

    // dispatch logout để rootReducer reset toàn store
    api.dispatch(logout());
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
