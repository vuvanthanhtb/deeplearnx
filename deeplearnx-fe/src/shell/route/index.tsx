import { Routes, Route } from "react-router-dom";
import MainLayout from "@/libs/components/layout";
import PrivateRoute from "./private.route";
import { PATHS_CONFIG, PUBLIC_PATHS_CONFIG } from "./path.config";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {PATHS_CONFIG.map((route) => {
          const Component = route.component;

          return (
            <Route
              key={route.key}
              path={route.path}
              element={
                <PrivateRoute>
                  <Component />
                </PrivateRoute>
              }
            />
          );
        })}
      </Route>
      {PUBLIC_PATHS_CONFIG.map((route) => {
        const Component = route.component;
        return (
          <Route key={route.key} path={route.path} element={<Component />} />
        );
      })}
    </Routes>
  );
};

export default AppRoutes;
