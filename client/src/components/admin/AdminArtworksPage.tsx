import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Chip,
    CircularProgress,
    Grid,
    Pagination,
    Stack,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";

// тип списко картин 
type ArtworkListItem = {
    id: string;
    title: string;
    slug: string;
    category: "PAINTING" | "WATERCOLOR" | "WALL_PAINTING";
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    image: {
        id: string;
        url: string;
    } | null;
};

export default function AdminArtworksPage() {

    const [artwork, setArtwork] = useState<ArtworkListItem[]>([]);
    // для отображения индикатора загрузки, пока данные не получены.
    const [loading, setLoading] = useState(true);
    // для показа сообщения об ошибке, если запрос не удался.
    const [error, setError] = useState<string | null>(null);

    // состояние для пагинации 
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 4; // ко-во картин которые показываем 

    const navigate = useNavigate();

    console.log("artwork", artwork)


    // загрузка список картин при открытии страницы.
    useEffect(() => {
        async function loadArtworks() {
            try {
                const res = await api.get(`/api/admin/artworks`);
                setArtwork(res.data)
            } catch {
                setError("Ошибка загрузки картин")
            } finally {
                setLoading(false)
            }
        }
        loadArtworks();
    }, []);

    const handleEdit = (id: string) => {
        navigate(`/admin/artworks/${id}`);
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#f2f9ff",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    const pageCount = Math.max(1, Math.ceil(artwork.length / ITEMS_PER_PAGE));
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginated = artwork.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if (error) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#f2f9ff",
                }}
            >
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                position: "relative",
                overflow: "hidden",
                bgcolor: "#f2f9ff",
                backgroundImage:
                    "linear-gradient(140deg, rgba(236, 249, 255, 0.98) 0%, rgba(214, 235, 251, 0.92) 45%, rgba(185, 219, 244, 0.95) 100%)",
                p: 3,
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
            <Box
                sx={{
                    position: "relative",
                    zIndex: 1,
                    maxWidth: 1200,
                    mx: "auto",
                }}
            >
                <Typography
                    variant="overline"
                    sx={{
                        letterSpacing: 3,
                        color: "#8a5a3c",
                        fontWeight: 600,
                        fontFamily:
                            '"Playfair Display", "Georgia", "Times New Roman", serif',
                    }}
                >
                    Газали-Дибир Израилов
                </Typography>
                <Typography
                    variant="h4"
                    sx={{
                        mb: 3,
                        fontWeight: 700,
                        color: "#2f1b12",
                        fontFamily:
                            '"Playfair Display", "Georgia", "Times New Roman", serif',
                    }}
                >
                    Список картин
                </Typography>

                <Grid container spacing={3}>
                    {paginated.map((art) => (
                        <Grid item xs={12} sm={6} md={4} key={art.id}>
                            <Card
                                elevation={0}
                                sx={{
                                    height: "100%",
                                    borderRadius: 3,
                                    border: "1px solid rgba(140, 185, 220, 0.45)",
                                    bgcolor: "rgba(244, 250, 255, 0.96)",
                                    boxShadow:
                                        "0 18px 40px rgba(35, 85, 130, 0.16)",
                                    overflow: "hidden",
                                }}
                            >
                                <CardActionArea
                                    sx={{ alignItems: "stretch" }}
                                    onClick={() => handleEdit(art.id)}
                                >
                                    {art?.image ? (
                                        <CardMedia
                                            component="img"
                                            image={art?.image.url}
                                            alt={art.title}
                                            sx={{
                                                height: 220,
                                                objectFit: "cover",
                                            }}
                                        />
                                    ) : (
                                        <Box
                                            sx={{
                                                height: 220,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                bgcolor: "rgba(255, 248, 241, 0.9)",
                                                color: "rgba(86, 54, 33, 0.7)",
                                                fontFamily:
                                                    '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                            }}
                                        >
                                            Нет изображения
                                        </Box>
                                    )}

                                    <CardContent sx={{ p: 2.5 }}>
                                        <Stack spacing={1.2}>
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: "#2f1b12",
                                                    fontFamily:
                                                        '"Playfair Display", "Georgia", "Times New Roman", serif',
                                                }}
                                            >
                                                {art.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color:
                                                        "rgba(79, 54, 38, 0.8)",
                                                    fontFamily:
                                                        '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                                }}
                                            >
                                                slug: {art.slug}
                                            </Typography>
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                alignItems="center"
                                                flexWrap="wrap"
                                            >
                                                <Chip
                                                    label={art.category}
                                                    size="small"
                                                    sx={{
                                                        bgcolor:
                                                            "rgba(255, 248, 241, 0.9)",
                                                        borderRadius: 2,
                                                        border:
                                                            "1px solid rgba(143, 97, 70, 0.4)",
                                                        color: "#4f3626",
                                                        fontFamily:
                                                            '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                                    }}
                                                />
                                                <Chip
                                                    label={
                                                        art.isPublished
                                                            ? "Опубликовано"
                                                            : "Черновик"
                                                    }
                                                    size="small"
                                                    sx={{
                                                        bgcolor: art.isPublished
                                                            ? "rgba(34, 197, 94, 0.08)"
                                                            : "rgba(148, 163, 184, 0.12)",
                                                        borderRadius: 999,
                                                        border: "1px solid",
                                                        borderColor:
                                                            art.isPublished
                                                                ? "rgba(22, 163, 74, 0.6)"
                                                                : "rgba(148, 163, 184, 0.7)",
                                                        color: art.isPublished
                                                            ? "#166534"
                                                            : "#475569",
                                                        fontWeight: 500,
                                                        fontFamily:
                                                            '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                                    }}
                                                />
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </CardActionArea>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{
                                        px: 2.5,
                                        pb: 2.5,
                                        pt: 1,
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            textTransform: "none",
                                            borderRadius: 999,
                                            borderColor:
                                                "rgba(143, 97, 70, 0.7)",
                                            color: "#6b3f26",
                                            fontFamily:
                                                '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                            "&:hover": {
                                                borderColor:
                                                    "rgba(143, 97, 70, 0.95)",
                                                background:
                                                    "rgba(255, 248, 241, 0.7)",
                                            },
                                        }}
                                        onClick={() => handleEdit(art.id)}
                                    >
                                        Редактировать
                                    </Button>
                                    {/* <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        sx={{
                                            textTransform: "none",
                                            borderRadius: 999,
                                            borderColor:
                                                "rgba(225, 24, 58, 0.7)",
                                            color: "#e73488",
                                            fontFamily:
                                                '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                            "&:hover": {
                                                borderColor:
                                                    "rgba(214, 47, 111, 0.95)",
                                                background:
                                                    "rgba(255, 248, 241, 0.7)",
                                            },
                                        }}
                                        onClick={() => handleDelete(art.id)}
                                    >
                                        Удалить картину
                                    </Button> */}
                                </Stack>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Box
                    sx={{
                        mt: 4,
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Pagination
                        count={pageCount}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        shape="rounded"
                    />
                </Box>
            </Box>
        </Box>
    );
}
