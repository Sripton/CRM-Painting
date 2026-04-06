import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { api } from "../../../../lib/api";
import type { PublicArtwork } from "../../../../artworksTypes/model";
import { CATEGORY_LABELS, GROUP_LABELS } from "../../../../artworksTypes/model";

export default function PublicArtworkDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const [artwork, setArtwork] = useState<PublicArtwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // дергаем роутер get для получения всех картин 
  useEffect(() => {
    async function loadArtwork() {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/api/public/artworks/${slug}`);
        setArtwork(res.data);
      } catch  {
        setError("Не удалось загрузить картину");
      } finally {
        setLoading(false);
      }
    }
    loadArtwork();
  }, [slug]);

  const titleLine = useMemo(() => {
    if (!artwork) return "";
    const yearPart = artwork.year ? ` ${artwork.year}` : "";
    const baseTitle = `${artwork.title}${yearPart}`;
    return `${baseTitle}`;
  }, [artwork]);


  const materialsLine = useMemo(() => {
    if (!artwork) return "";
    const size =
      artwork.widthCm && artwork.heightCm
        ? `${artwork.widthCm}x${artwork.heightCm} см.`
        : "";
    const materials = artwork.materials ? artwork.materials : "";
    const parts = [materials, size].filter(Boolean).join(" ");
    return parts ? `@art-GDI ${parts}` : "";
  }, [artwork]);


  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        bgcolor: "transparent",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          bottom: -60,
          left: -120,
          width: 280,
          height: 220,
          background:
            "linear-gradient(135deg, rgba(127,173,140,0.5), rgba(190,224,206,0.65))",
          borderTopRightRadius: 180,
          filter: "blur(0.2px)",
          zIndex: 0,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: -50,
          right: -130,
          width: 300,
          height: 230,
          background:
            "linear-gradient(220deg, rgba(120,165,120,0.65), rgba(92,140,96,0.9))",
          borderTopLeftRadius: 180,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, md: 6 } }}>
        <Box sx={{ maxWidth: 1040, mx: "auto", pt: { xs: 5, md: 7 }, pb: 10 }}>
          <Stack alignItems="center" spacing={1.2} sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              sx={{
                textTransform: "uppercase",
                letterSpacing: 1.5,
                fontSize: 11,
                fontWeight: 700,
                color: "#6f8aa1",
                fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
              }}
            >
              Главная
            </Typography>
            <Typography sx={{ color: "#6f8aa1", fontSize: 12 }}>↓</Typography>
            <Typography
              sx={{
                textTransform: "uppercase",
                letterSpacing: 1.5,
                fontSize: 11,
                fontWeight: 700,
                color: "#6f8aa1",
                fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
              }}
            >
              {artwork?.artworkGroup ? GROUP_LABELS[artwork.artworkGroup] : "Живопись"}
            </Typography>
            <Typography sx={{ color: "#6f8aa1", fontSize: 12 }}>↓</Typography>
            <Typography
              sx={{
                textTransform: "uppercase",
                letterSpacing: 1.5,
                fontSize: 11,
                fontWeight: 700,
                color: "#6f8aa1",
                fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
              }}
            >
              {artwork?.category ? CATEGORY_LABELS[artwork.category] : "Картины"}
            </Typography>
          </Stack>

          <Box
            sx={{
              textAlign: "center",
              mt: { xs: 3, md: 4 },
              position: "relative",
              zIndex: 1,
            }}
          >
            <Typography
              sx={{
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: 2,
                color: "#2f3640",
                fontSize: { xs: 12, md: 13 },
                fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
              }}
            >
              {titleLine || "Загрузка..."}
            </Typography>
          </Box>

          <Box
            sx={{
              mt: { xs: 3, md: 4 },
              border: "1px solid #4a4f55",
              bgcolor: "#fbfbfa",
              borderRadius: 1.5,
              boxShadow:
                "0 18px 38px rgba(47, 54, 64, 0.16), 0 6px 14px rgba(47, 54, 64, 0.08)",
              px: { xs: 2, md: 3 },
              py: { xs: 2, md: 3 },
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                maxWidth: 760,
                mx: "auto",
                border: "1px solid #4a4f55",
                bgcolor: "#2b2f34",
                overflow: "hidden",
              }}
            >
              {artwork?.image?.url ? (
                <Box
                  component="img"
                  alt={artwork.title}
                  src={artwork.image.url}
                  sx={{ display: "block", width: "100%", height: "auto" }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    aspectRatio: "4 / 3",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#cbd1d8",
                    fontSize: 14,
                    letterSpacing: 1.1,
                    textTransform: "uppercase",
                    fontFamily: '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                  }}
                >
                  {loading ? "Загрузка..." : "Изображение отсутствует"}
                </Box>
              )}
            </Box>

            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={2}
              sx={{ mt: { xs: 2.5, md: 3 }, px: { xs: 0.5, md: 1 } }}
            >
              <Box>
                <Typography
                  sx={{
                    textTransform: "uppercase",
                    fontWeight: 700,
                    letterSpacing: 2,
                    color: "#2f3640",
                    fontSize: { xs: 11, md: 12 },
                    fontFamily:
                      '"Playfair Display", "Georgia", "Times New Roman", serif',
                  }}
                >
                  {titleLine || (loading ? "Загрузка..." : "Без названия")}
                </Typography>
                <Typography
                  sx={{
                    mt: 0.6,
                    fontSize: 12,
                    color: "#4a4f55",
                    fontFamily:
                      '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                  }}
                >
                  {materialsLine || (artwork ? "Описание отсутствует" : "")}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                sx={{
                  borderRadius: 0.8,
                  borderColor: "#4a4f55",
                  color: "#2f3640",
                  bgcolor: "#fbfbfa",
                  px: { xs: 2.2, md: 3 },
                  py: { xs: 0.8, md: 0.9 },
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.4,
                  textTransform: "uppercase",
                  lineHeight: 1,
                  boxShadow:
                    "0 10px 22px rgba(47, 54, 64, 0.12), 0 0 0 1px rgba(95, 111, 134, 0.15)",
                  "&:hover": {
                    borderColor: "#4f6480",
                    bgcolor: "#f1f4f7",
                    boxShadow:
                      "0 16px 30px rgba(47, 54, 64, 0.2), 0 0 0 1px rgba(95, 111, 134, 0.2)",
                  },
                }}
              >
                Оформить заказ
              </Button>
            </Stack>
          </Box>

          {error && (
            <Typography
              sx={{
                mt: 2,
                textAlign: "center",
                color: "#8b2f2f",
                fontSize: 12,
                fontFamily:
                  '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
              }}
            >
              {error}
            </Typography>
          )}

          <Box sx={{ mt: { xs: 3, md: 4 }, textAlign: "center", position: "relative", zIndex: 1 }}>
            <Button
              onClick={() => {
                if (from) {
                  navigate(from.pathname + from.search)
                } else {
                  navigate("/")
                }
              }}
              variant="text"
              sx={{
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: 1.8,
                fontSize: 11,
                color: "#2f3640",
                fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
                "&:hover": {
                  bgcolor: "transparent",
                  color: "#1f2a35",
                },
              }}
            >
              Вернуться назад
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
