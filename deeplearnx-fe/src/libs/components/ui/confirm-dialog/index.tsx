import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface ConfirmOptions {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

interface DialogState extends ConfirmOptions {
  open: boolean;
  message: string;
}

type ConfirmFn = (message: string, options?: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export const ConfirmDialogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<DialogState>({
    open: false,
    message: "",
    title: "Xác nhận",
    confirmText: "Xác nhận",
    cancelText: "Hủy",
    danger: false,
  });

  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirm: ConfirmFn = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setState({
        open: true,
        message,
        title: options.title ?? "Xác nhận",
        confirmText: options.confirmText ?? "Xác nhận",
        cancelText: options.cancelText ?? "Hủy",
        danger: options.danger ?? false,
      });
    });
  }, []);

  const handleClose = (confirmed: boolean) => {
    setState((prev) => ({ ...prev, open: false }));
    resolveRef.current?.(confirmed);
    resolveRef.current = null;
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog
        open={state.open}
        onClose={() => handleClose(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          backdrop: { sx: { backdropFilter: "blur(2px)" } },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: 16 }}>
          {state.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#3c4043", fontSize: 14 }}>
            {state.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleClose(false)}
            sx={{ textTransform: "none", minWidth: 72 }}
          >
            {state.cancelText}
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleClose(true)}
            color={state.danger ? "error" : "primary"}
            sx={{ textTransform: "none", minWidth: 72 }}
            autoFocus
          >
            {state.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmContext.Provider>
  );
};

export const useConfirm = (): ConfirmFn => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm must be used inside ConfirmDialogProvider");
  }
  return ctx;
};
