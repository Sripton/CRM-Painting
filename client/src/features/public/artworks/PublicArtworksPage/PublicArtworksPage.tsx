import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { api } from "../../../../lib/api";
import type {
    PublicArtwork,
    ArtworkGroup,
    ArtworkCategory
} from "../../../../artworksTypes/model";
import { GROUP_CATEGORY_MAP, groupArtworksByGroupAndCategory, CATEGORY_LABELS } from "../../../../artworksTypes/model"

export default function PublicArtworksPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [artworks, setArtworks] = useState<PublicArtwork[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    // для отображения картин текущей категории 
    const [selectedCategoryByGroup, setSelectedCategoryByGroup] = useState<Partial<Record<ArtworkGroup, ArtworkCategory | null>>>({});

    // загружаем картины с сервера при рендере страницы
    useEffect(() => {
        async function loadArtworks() {
            try {
                setLoading(true);
                setError("");

                // дергаем маршрут get
                const res = await api.get(`/api/public/artworks`);

                // забираем данные 
                setArtworks(res.data);
            } catch {
                setError("Не удалось загрузить картины");
            } finally {
                setLoading(false);
            }
        }
        loadArtworks();
    }, []);

    // Группировка картин 
    const groupedArtworks = useMemo(() => {
        return groupArtworksByGroupAndCategory(artworks);
    }, [artworks]);

    console.log("artworks", artworks);


    if (loading) return <Typography>Загрузка...</Typography>;
    if (error) return <Typography>{error}</Typography>;


    return (
        <Box
            sx={{
                bgcolor: "transparent",
            }}
        >

            <Box
                sx={{
                    pt: { xs: 3, md: 4 },
                    pb: 0,
                }}
            >
                <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, md: 6 }, pt: 0 }}>
                    <Box sx={{ maxWidth: 1040, mx: "auto" }}>
                        <Box
                            sx={{
                                border: "1px solid #4a4f55",
                                bgcolor: "#fbfbfa",
                                borderRadius: 4,
                                boxShadow:
                                    "0 20px 45px rgba(47, 54, 64, 0.12), 0 8px 18px rgba(47, 54, 64, 0.06)",
                                px: { xs: 3, md: 6 },
                                py: { xs: 3.5, md: 4.5 },
                                mt: { xs: 4, md: 5 },
                            }}
                        >
                            <Typography
                                sx={{
                                    textAlign: "center",
                                    fontWeight: 700,
                                    letterSpacing: 2,
                                    textTransform: "uppercase",
                                    fontSize: { xs: 12, md: 13 },
                                    mb: { xs: 2.5, md: 3 },
                                    fontFamily:
                                        '"Playfair Display", "Georgia", "Times New Roman", serif',
                                    color: "#5a6f8a",
                                }}
                            >
                                БИОГРАФИЯ | ХУДОЖНИК ГАЗАЛИ-ДИБИР ИЗРАИЛОВ
                            </Typography>

                            <Stack
                                direction={{ xs: "column", md: "row" }}
                                spacing={{ xs: 2.5, md: 4 }}
                                alignItems="flex-start"
                            >
                                <Box
                                    sx={{
                                        width: { xs: "100%", md: 320 },
                                        height: { xs: 200, md: 210 },
                                        border: "1px solid #4a4f55",
                                        borderRadius: 3,
                                        backgroundImage: 'url("/img/author.jpg")',
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                />
                                <Box sx={{ flex: 1 }}>
                                    <Typography
                                        sx={{
                                            fontSize: { xs: 13, md: 14 },
                                            fontWeight: 600,
                                            lineHeight: 1.3,
                                            color: "#222831",
                                            whiteSpace: "pre-line",
                                            fontFamily:
                                                '"Spectral", "Georgia", "Times New Roman", serif',
                                        }}
                                    >
                                        {`Родился в 1942 году.
В 1975 году окончил Московское Высшее художественно-промышленное училище
(бывшее Строгановское).
С 1978 - член Союза художников СССР, член Московского Союза художника, член Союза
художников России, член Международного художественного фонда. Работал главным
художником с 1999 по 2015гг.
Всероссийского выставочного Центра ВДНХ.
Кандидат в Интернациональный союз писателей.
Заслуженный художник Дагестана.`}
                                    </Typography>
                                </Box>
                            </Stack>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    mt: { xs: 2.5, md: 3 },
                                    mb: { xs: 10, md: 12 },
                                }}
                            >
                                <Button
                                    variant="contained"
                                    sx={{
                                        borderRadius: 999,
                                        border: "1px solid #5a6f8a",
                                        color: "#f7f7f7",
                                        background:
                                            "linear-gradient(135deg, #5a6f8a 0%, #8094aa 45%, #465a72 100%)",
                                        px: { xs: 2.6, md: 3.2 },
                                        py: { xs: 0.9, md: 1 },
                                        fontSize: 12,
                                        letterSpacing: 1.2,
                                        textTransform: "uppercase",
                                        lineHeight: 1,
                                        boxShadow:
                                            "0 16px 30px rgba(47, 54, 64, 0.22), 0 0 0 1px rgba(95, 111, 134, 0.35)",
                                        "&:hover": {
                                            border: "1px solid #4f6480",
                                            boxShadow:
                                                "0 18px 36px rgba(47, 54, 64, 0.3), 0 0 0 1px rgba(90, 111, 138, 0.5)",
                                            background:
                                                "linear-gradient(135deg, #6a7f99 0%, #8ea0b4 45%, #4f657e 100%)",
                                        },
                                        "@keyframes catalogDots": {
                                            "0%": { opacity: 0 },
                                            "20%": { opacity: 1 },
                                            "100%": { opacity: 0 },
                                        },
                                        "& .catalog-dots": {
                                            display: "inline-block",
                                            minWidth: 24,
                                            textAlign: "left",
                                            marginLeft: 6,
                                        },
                                        "& .catalog-dot": {
                                            display: "inline-block",
                                            opacity: 0,
                                            animation: "catalogDots 1.2s infinite",
                                        },
                                        "& .catalog-dot:nth-of-type(1)": {
                                            animationDelay: "0s",
                                        },
                                        "& .catalog-dot:nth-of-type(2)": {
                                            animationDelay: "0.2s",
                                        },
                                        "& .catalog-dot:nth-of-type(3)": {
                                            animationDelay: "0.4s",
                                        },
                                    }}
                                    onClick={() => navigate(`/artworks/bio`)}
                                >
                                    Подробнее
                                    <Box component="span" className="catalog-dots">
                                        <Box component="span" className="catalog-dot">{" "}{">"}</Box>
                                        <Box component="span" className="catalog-dot">{">"}</Box>
                                        <Box component="span" className="catalog-dot">{">"}</Box>
                                    </Box>
                                </Button>
                            </Box>
                        </Box>

                        {(Object.keys(GROUP_CATEGORY_MAP) as ArtworkGroup[]).map((group) => {
                            const categories = GROUP_CATEGORY_MAP[group];
                            // const groupItems = categories.flatMap((category) => groupedArtworks[group][category]);
                            const selectedCategory = selectedCategoryByGroup[group] ?? categories[0];
                            const visibleItems = groupedArtworks[group][selectedCategory] ?? [];
                            const displayedItems =
                                visibleItems.length >= 24 ?
                                    visibleItems.slice(0, 24) :
                                    visibleItems.slice(0, 12)

                            return (
                                <React.Fragment key={group}>
                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
                                            gap: { xs: 1.5, md: 2 },
                                            mt: { xs: 10, md: 12 },
                                        }}
                                    >
                                        {categories.map((category) => (
                                            <Button
                                                key={`${category}-outside`}
                                                variant="outlined"
                                                onClick={() => {
                                                    setSelectedCategoryByGroup((prev) => ({
                                                        // prev = {}
                                                        ...prev,
                                                        [group]: category
                                                    }))
                                                }}
                                                sx={{
                                                    borderColor: "#4a4f55",
                                                    color: "#2f3640",
                                                    bgcolor: selectedCategory === category ? "#dfe7ef" : "#fbfbfa",
                                                    width: "100%",
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
                                                    fontFamily:
                                                        '"Bebas Neue", "Arial Narrow", Arial, sans-serif',
                                                    "&:hover": {
                                                        borderColor: "#4f6480",
                                                        bgcolor: "#f1f4f7",
                                                        boxShadow:
                                                            "0 10px 22px rgba(47, 54, 64, 0.14), 0 0 0 1px rgba(90, 111, 138, 0.2)",
                                                        color: "#1f2a35",
                                                    },

                                                }}
                                            >
                                                {`${CATEGORY_LABELS[category]}`}
                                            </Button>
                                        ))}
                                    </Box>

                                    <Box
                                        sx={{
                                            mt: { xs: 3, md: 4 },
                                            bgcolor: "#fbfbfa",
                                            border: "1px solid #4a4f55",
                                            p: { xs: 2, md: 3 },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "grid",
                                                gridTemplateColumns: {
                                                    xs: "repeat(2, 1fr)",
                                                    sm: "repeat(3, 1fr)",
                                                    md: "repeat(6, 1fr)",
                                                },
                                                gap: { xs: 1, md: 1.2 },
                                            }}
                                        >
                                            {displayedItems.length === 0 ? (
                                                <Box
                                                    sx={{
                                                        gridColumn: "1 / -1",
                                                        border: "1px dashed #4a4f55",
                                                        bgcolor: "#f7f7f5",
                                                        borderRadius: 2,
                                                        px: { xs: 2, md: 3 },
                                                        py: { xs: 2.5, md: 3 },
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: { xs: 12, md: 13 },
                                                            fontWeight: 700,
                                                            letterSpacing: 1.4,
                                                            textTransform: "uppercase",
                                                            color: "#5a6f8a",
                                                            mb: 0.6,
                                                            fontFamily:
                                                                '"Playfair Display", "Georgia", "Times New Roman", serif',
                                                        }}
                                                    >
                                                        Данный раздел пока не доступен
                                                    </Typography>

                                                </Box>
                                            ) : displayedItems.map((artwork) => (
                                                <Box
                                                    key={artwork.id}
                                                    sx={{
                                                        width: "100%",
                                                        aspectRatio: "4 / 3",
                                                        bgcolor: "#2b2f34",
                                                        border: "1px solid #4a4f55",
                                                        backgroundColor: "#2b2f34",
                                                        // отображение картин
                                                        backgroundImage: artwork.image?.url ?
                                                            `url(${artwork.image.url})`
                                                            : "none",
                                                        backgroundSize: "cover",
                                                        backgroundPosition: "center",
                                                        cursor: "pointer",
                                                        transition: "transform 160ms ease, box-shadow 160ms ease",
                                                        "&:hover": {
                                                            transform: "translateY(-2px)",
                                                            boxShadow: "0 10px 22px rgba(47, 54, 64, 0.18)",
                                                        },
                                                    }}
                                                    onClick={() => navigate(`/artworks/${artwork.slug}`,
                                                        {
                                                            state: { from: location }  // вручную передаём в страницу деталей объект location той страницы, с которой был переход.

                                                        })}
                                                />
                                            ))}

                                        </Box>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            mt: { xs: 2.5, md: 3 },
                                            mb: { xs: 10, md: 12 },
                                        }}
                                    >
                                        <Button
                                            variant="outlined"
                                            onClick={() => navigate(`/artworks?group=${group}&category=${selectedCategory}`)}
                                            sx={{
                                                borderRadius: 999,
                                                border: "1px solid #5a6f8a",
                                                color: "#2f3640",
                                                bgcolor: "#fbfbfa",
                                                px: { xs: 2.6, md: 3.2 },
                                                py: { xs: 0.9, md: 1 },
                                                fontSize: 12,
                                                fontWeight: 700,
                                                letterSpacing: 1.2,
                                                textTransform: "uppercase",
                                                lineHeight: 1,
                                                boxShadow: "0 16px 30px rgba(47, 54, 64, 0.14), 0 0 0 1px rgba(95, 111, 134, 0.22)",
                                                "&:hover": {
                                                    border: "1px solid #4f6480",
                                                    boxShadow:
                                                        "0 18px 36px rgba(47, 54, 64, 0.26), 0 0 0 1px rgba(95, 111, 134, 0.35)",
                                                    bgcolor: "#f1f4f7",
                                                    color: "#1f2a35",
                                                },
                                                "@keyframes catalogDots": {
                                                    "0%": { opacity: 0 },
                                                    "20%": { opacity: 1 },
                                                    "100%": { opacity: 0 },
                                                },
                                                "& .catalog-dots": {
                                                    display: "inline-block",
                                                    minWidth: 24,
                                                    textAlign: "left",
                                                    marginLeft: 6,
                                                },
                                                "& .catalog-dot": {
                                                    display: "inline-block",
                                                    opacity: 0,
                                                    animation: "catalogDots 1.2s infinite",
                                                },
                                                "& .catalog-dot:nth-of-type(1)": {
                                                    animationDelay: "0s",
                                                },
                                                "& .catalog-dot:nth-of-type(2)": {
                                                    animationDelay: "0.2s",
                                                },
                                                "& .catalog-dot:nth-of-type(3)": {
                                                    animationDelay: "0.4s",
                                                },
                                            }}
                                        >
                                            Перейти в каталог
                                            <Box component="span" className="catalog-dots">
                                                <Box component="span" className="catalog-dot">{" "}{">"}</Box>
                                                <Box component="span" className="catalog-dot">{">"}</Box>
                                                <Box component="span" className="catalog-dot">{">"}</Box>
                                            </Box>
                                        </Button>
                                    </Box>
                                </React.Fragment>
                            )
                        })}
                    </Box>
                </Container>
            </Box>

        </Box >
    )
}
