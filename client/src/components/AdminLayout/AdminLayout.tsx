import React from "react";
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Auth/AuthContext";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const handleNav = (path: string) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        bgcolor: "#f2f9ff",
        backgroundImage:
          "linear-gradient(140deg, rgba(236, 249, 255, 0.98) 0%, rgba(214, 235, 251, 0.92) 45%, rgba(185, 219, 244, 0.95) 100%)",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(255, 255, 255, 0.85), transparent 55%), radial-gradient(circle at 80% 10%, rgba(215, 235, 250, 0.6), transparent 45%), radial-gradient(circle at 70% 80%, rgba(170, 210, 240, 0.45), transparent 50%)",
          opacity: 0.9,
          pointerEvents: "none",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          inset: "-30% -20% -25% -20%",
          backgroundImage:
            "repeating-linear-gradient(115deg, rgba(255, 255, 255, 0.07) 0 8px, transparent 8px 16px)",
          opacity: 0.5,
          pointerEvents: "none",
        },
      }}
    >
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{
          position: "relative",
          zIndex: 1,
          borderBottom: "1px solid rgba(143, 97, 70, 0.25)",
          bgcolor: "rgba(244, 250, 255, 0.94)",
          backdropFilter: "blur(16px)",
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: 1.2,
              color: "#2f1b12",
              fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
            }}
          >
            Панель администратора
          </Typography>

          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              gap: 1.5,
              ml: 4,
              fontFamily:
                '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
            }}
          >
            <Button
              color="inherit"
              sx={{
                textTransform: "none",
                color: "#4f3626",
                "&:hover": { bgcolor: "rgba(178, 107, 58, 0.06)" },
              }}
              onClick={() => handleNav("/admin")}
            >
              Главная
            </Button>
            <Button
              color="inherit"
              sx={{
                textTransform: "none",
                color: "#4f3626",
                "&:hover": { bgcolor: "rgba(178, 107, 58, 0.06)" },
              }}
              onClick={() => handleNav("/admin/orders")}
            >
              Заказы
            </Button>
            <Button
              color="inherit"
              sx={{
                textTransform: "none",
                color: "#4f3626",
                "&:hover": { bgcolor: "rgba(178, 107, 58, 0.06)" },
              }}
              onClick={() => handleNav("/admin/clients")}
            >
              Клиенты
            </Button>
            <Button
              color="inherit"
              sx={{
                textTransform: "none",
                color: "#4f3626",
                "&:hover": { bgcolor: "rgba(178, 107, 58, 0.06)" },
              }}
              onClick={() => handleNav("/admin/settings")}
            >
              Настройки
            </Button>
          </Box>

          <Button
            variant="outlined"
            color="inherit"
            sx={{
              textTransform: "none",
              borderRadius: 999,
              px: 3,
              borderColor: "rgba(143, 97, 70, 0.65)",
              color: "#6b3f26",
              fontWeight: 600,
              fontFamily:
                '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
              "&:hover": {
                borderColor: "rgba(143, 97, 70, 0.95)",
                background:
                  "linear-gradient(135deg, rgba(184, 107, 62, 0.08) 0%, rgba(198, 123, 78, 0.12) 50%, rgba(168, 91, 51, 0.16) 100%)",
              },
            }}
            onClick={handleLogout}
          >
            Выход
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          p: 4,
          maxWidth: 1200,
          mx: "auto",
        }}
      >
        {/* Делаем AdminDashboard.tsx Layout компонентом 
        Если есть Outlet, компонент говорит:
        я не страница с контентом, я оболочка, внутри которой будут другие страницы*/}
        <Outlet />
      </Box>
    </Box>
  );
}
