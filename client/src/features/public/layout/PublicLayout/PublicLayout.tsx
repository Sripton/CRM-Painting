import React from "react";
import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f7f7f7",
        color: "#1f1f1f",
      }}
    >
      <Container maxWidth={false} disableGutters sx={{ pt: 0, pb: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
