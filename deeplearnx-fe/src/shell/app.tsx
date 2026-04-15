import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./route";
import LoadingPage from "@/libs/pages/loading";
import { ConfirmDialogProvider } from "@/libs/components/ui/confirm-dialog";

const App = () => {
  return (
    <ConfirmDialogProvider>
      <BrowserRouter>
        <Suspense fallback={null}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
      <LoadingPage />
    </ConfirmDialogProvider>
  );
};

export default App;
