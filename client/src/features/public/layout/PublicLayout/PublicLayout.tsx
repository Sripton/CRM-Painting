import { Box, Container, Stack, Typography } from "@mui/material";
import { Outlet, useLocation, useNavigate, NavLink } from "react-router-dom";
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';

export default function PublicLayout() {
  const navigation = useNavigate();
  const location = useLocation();

  // Массив навигационного меню 
  const navItems = [
    "ГЛАВНАЯ",
    "ЛИТЕРАТУРА. НОВОСТИ",
    "СТАТЬИ. ОТЗЫВЫ",
    "КОНТАКТЫ",
  ];



  const getPathByMenu = (menu: string) => {
    if (menu === "ГЛАВНАЯ") return "/";
    if (menu === "ЛИТЕРАТУРА. НОВОСТИ") return "/publications-news-aphorizm-essay";
    if (menu === "СТАТЬИ. ОТЗЫВЫ") return "/publications-article-review";
    if (menu === "КОНТАКТЫ") return "/contacts";
    return "";
  }

  // для отображения активного меню 
  const isActivePath = (menu: string) => {
    return location.pathname === getPathByMenu(menu);
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
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
            position: "relative",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            textAlign: "center",
            px: { xs: 2, md: 4 },
            pt: { xs: 2, md: 3 },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 16, md: 22 },
              letterSpacing: { xs: 2, md: 3 },
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#1f1f1f",
              fontFamily: '"Bebas Neue", "Arial Narrow", Arial, sans-serif',
            }}
          >
            ИСКУССТВО | ГАЗАЛИ-ДИБИР ИЗРАИЛОВ
          </Typography>
        </Box>
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
              gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
              gap: { xs: 0.8, md: 0.8 },
              py: { xs: 2, md: 1.5 },
              mt: { xs: -3, md: -4.5 },
            }}
          >
            {navItems.map((label) => (
              <Box
                key={label}
                onClick={() => navigation(getPathByMenu(label))}
                sx={{
                  width: "100%",
                  position: "relative",
                  border: "1px solid #4a4f55",
                  bgcolor: isActivePath(label) ? "#dfe7ef" : "#fbfbfa",
                  textAlign: "center",
                  px: { xs: 1.5, md: 2 },
                  py: { xs: 1.8, md: 1.7 },
                  fontSize: { xs: 13, md: 14 },
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  lineHeight: 1,
                  boxShadow: "0 1px 0 #cfd2d6",
                  borderRadius: 1.3,
                  cursor: "pointer",
                  color: "#2f3640",
                  fontFamily: '"Bebas Neue", "Arial Narrow", Arial, sans-serif',
                  "&:hover": {
                    borderColor: "#4f6480",
                    bgcolor: "#f1f4f7",
                    boxShadow:
                      "0 10px 22px rgba(47, 54, 64, 0.14), 0 0 0 1px rgba(90, 111, 138, 0.2)",
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

      <Box sx={{ flex: 1 }}>
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          borderTop: "1px solid #4a4f55",
          bgcolor: "#f2f2f1",
          backgroundImage: 'url("/img/footer.png")',
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          px: { xs: 2.5, md: 4 },
          py: { xs: 3, md: 3.5 },
        }}
      >
        <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, md: 6 } }}>
          <Box sx={{ maxWidth: 1040, mx: "auto" }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={{ xs: 2, md: 6 }}
              justifyContent="space-between"
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: 15,
                    letterSpacing: 1.4,
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "#1f2a35",
                    mb: 1,
                    fontFamily: '"Bebas Neue", "Arial Narrow", Arial, sans-serif',
                  }}
                >
                  Социальные сети
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      letterSpacing: 1,
                      fontFamily: '"Bebas Neue", "Arial Narrow", Arial, sans-serif',
                    }}
                  >
                    <NavLink to="https://www.facebook.com/gazali.d#">
                      <FacebookIcon sx={{ cursor: "pointer" }} />
                    </NavLink>
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 13,
                      letterSpacing: 1,
                      fontFamily: '"Bebas Neue", "Arial Narrow", Arial, sans-serif',
                    }}
                  >
                    <NavLink to="#">
                      <TwitterIcon sx={{ cursor: "pointer" }} />
                    </NavLink>

                  </Typography>
                </Stack>
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: 15,
                    letterSpacing: 1.4,
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "#1f2a35",
                    mb: 1,
                    fontFamily: '"Bebas Neue", "Arial Narrow", Arial, sans-serif',
                  }}
                >
                  Контакты
                </Typography>
                <Typography
                  sx={{
                    fontSize: 14,
                    letterSpacing: 0.6,
                    color: "#1f2a35",
                    fontFamily: '"Bebas Neue", "Arial Narrow", Arial, sans-serif',
                  }}
                >
                  8 (926) 361-45-75
                </Typography>
                <Typography
                  sx={{
                    fontSize: 14,
                    letterSpacing: 0.6,
                    color: "#1f2a35",
                    fontFamily: '"Bebas Neue", "Arial Narrow", Arial, sans-serif',
                  }}
                >
                  Художник Газали-Дибир Израилов
                </Typography>
                <Typography
                  sx={{
                    fontSize: 14,
                    letterSpacing: 0.6,
                    color: "#1f2a35",
                    fontFamily: '"Bebas Neue", "Arial Narrow", Arial, sans-serif',
                  }}
                >
                  gazali_d@mail.ru
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
