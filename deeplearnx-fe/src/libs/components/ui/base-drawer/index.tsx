import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import clsx from "clsx";

type Anchor = "top" | "left" | "bottom" | "right";

interface BaseDrawerComponentProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  anchor?: Anchor;
  width?: number | string;
  children: React.ReactNode;
  className?: string;
}

const BaseDrawerComponent: React.FC<BaseDrawerComponentProps> = (props) => {
  const {
    open,
    onClose,
    title,
    anchor = "right",
    width = 480,
    children,
    className,
  } = props;

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick") return;
        onClose();
      }}
      className={clsx(className)}
      sx={{ zIndex: (theme) => theme.zIndex.modal }}
      slotProps={{
        paper: {
          sx: { width, display: "flex", flexDirection: "column" },
        },
      }}
    >
      {title && (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 3,
              py: 2,
            }}
          >
            <Typography fontWeight={600} fontSize={16}>
              {title}
            </Typography>
          </Box>
          <Divider />
        </>
      )}

      <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2 }}>{children}</Box>
    </Drawer>
  );
};

export default BaseDrawerComponent;
