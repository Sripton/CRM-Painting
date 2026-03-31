import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  // Массив навигационного меню 
  const navItems = [
    "ЛИТЕРАТУРА. НОВОСТИ",
    "СТАТЬИ. ОТЗЫВЫ",
    "КОНТАКТЫ",
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#efefee",
        backgroundImage:
          "repeating-linear-gradient(90deg, #f2f2f1 0, #f2f2f1 30px, #fbfbfa 30px, #fbfbfa 60px)",
        color: "#1f1f1f",
      }}
    >
      <Box
        component="header"
        sx={{
          width: "100%",
          bgcolor: "transparent",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: "100%",
            aspectRatio: "2048 / 430",
            backgroundImage: 'url("/img/header.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Box>
      <Box sx={{ maxWidth: 1040, mx: "auto" }}>
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            bgcolor: "transparent",
            borderTop: "3px solid #5a6f8a",
            boxShadow: "inset 0 1px 0 #fbfbfa",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, minmax(0, 220px))",
              },
              justifyContent: "center",
              gap: { xs: 0.8, md: 0.8 },
              py: { xs: 2, md: 1.5 },
              mt: { xs: -3, md: -4.5 },
            }}
          >
            {navItems.map((label) => (
              <Box
                key={label}
                sx={{
                  position: "relative",
                  border: "1px solid #4a4f55",
                  bgcolor: "#fbfbfa",
                  textAlign: "center",
                  py: { xs: 1.8, md: 1.7 },
                  px: { xs: 1.5, md: 2 },
                  fontSize: { xs: 12, md: 13 },
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  lineHeight: 1,
                  boxShadow: "0 1px 0 #cfd2d6",
                  borderRadius: 2,
                  cursor: "pointer",
                  color: "#2f3640",
                  fontFamily:
                    '"Playfair Display", "Georgia", "Times New Roman", serif',
                  transition:
                    "transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease, border-color 160ms ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    borderColor: "#4f6480",
                    bgcolor: "#f1f4f7",
                    boxShadow:
                      "0 14px 30px rgba(47, 54, 64, 0.16), 0 0 0 1px rgba(90, 111, 138, 0.28)",
                    color: "#1f2a35",
                  },
                }}
              >
                {label}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Outlet />
    </Box>
  );
}
