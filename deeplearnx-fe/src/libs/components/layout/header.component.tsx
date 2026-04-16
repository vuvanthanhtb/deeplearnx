import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import AvatarUser from "@/assets/avatar.jpeg";

import { useAppDispatch, useAppSelector } from "@/shell/redux/hooks";
import { logoutUser } from "@/modules/auth/shell/auth.slice";
import { AUTH_PATH } from "@/modules/auth/shell/auth.route";
import BaseDrawerComponent from "../ui/base-drawer";
import ProfileComponent from "./profile";

const HeaderComponent = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [openProfile, setOpenProfile] = useState<boolean>(false);

  const handleLogout = async () => {
    setAnchor(null);
    await dispatch(logoutUser());
    navigate(AUTH_PATH.LOGIN, { replace: true });
  };

  const displayName = user?.fullName ?? user?.username ?? "User";

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography
        variant="body2"
        sx={{ color: "#3c4043", fontSize: 14, display: { xs: "none", sm: "block" } }}
      >
        {displayName}
      </Typography>

      <Tooltip title="Tài khoản">
        <IconButton
          size="small"
          onClick={(e) => {
            setAnchor(e.currentTarget);
            setOpenProfile(false);
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: 13,
              bgcolor: "#1a73e8",
              cursor: "pointer",
            }}
          >
            <img className="image-avatar" src={AvatarUser} alt="avatar" />
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            elevation: 3,
            sx: { mt: 0.5, minWidth: 200, borderRadius: 2 },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {displayName}
          </Typography>
          {user?.email && (
            <Typography variant="caption" color="text.secondary">
              {user.email}
            </Typography>
          )}
        </Box>

        <Divider />

        <MenuItem
          onClick={() => {
            setAnchor(null);
            setOpenProfile(true);
          }}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Hồ sơ
        </MenuItem>

        <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          Đăng xuất
        </MenuItem>
      </Menu>

      <BaseDrawerComponent
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        title="Hồ sơ"
      >
        <ProfileComponent handleClose={() => setOpenProfile(false)} />
      </BaseDrawerComponent>
    </Box>
  );
};

export default HeaderComponent;
