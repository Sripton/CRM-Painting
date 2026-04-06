import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { api } from "../../../lib/api";

type PublicationType = "NEWS" | "APHORISM" | "ESSAY" | "ARTICLE" | "REVIEW";

type PublicationListItem = {
    id: string;
    type: PublicationType;
    title: string | null;
    slug: string | null;
    body: string | null;
    quoteText: string | null;

};


export default function AdminPublicationPage() {
    const navigate = useNavigate();
    const [publications, setPublications] = useState<PublicationListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // выбор типа публикации 
    const typeLabel = useMemo(
        () => ({
            NEWS: "Новости",
            APHORISM: "Афоризм",
            ESSAY: "Эссе",
            ARTICLE: "Статья",
            REVIEW: "Отзыв",
        }),
        [],
    );


    // дергаем router.get("/publications") для получения списка всех публикаций 
    useEffect(() => {
        async function loadPublications() {
            try {
                setLoading(true);
                setError(null);
                const res = await api.get("/api/admin/publications");
                setPublications(res.data);
            } catch {
                setError("Ошибка загрузки публикаций");
            } finally {
                setLoading(false);
            }
        }
        loadPublications();
    }, []);

    // кнопка перехода для создания публикаций
    const handleCreate = () => {
        navigate("/admin/publications/create");
    };

    // кнопка перехода для редатирования публикаций
    const handleEdit = (id: string) => {
        navigate(`/admin/publications/edit/${id}`);
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
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={2}
                    sx={{ mb: 3 }}
                >
                    <Box>
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
                                fontWeight: 700,
                                color: "#2f1b12",
                                fontFamily:
                                    '"Playfair Display", "Georgia", "Times New Roman", serif',
                            }}
                        >
                            Публикации
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        onClick={handleCreate}
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 999,
                            px: 3,
                            py: 1,
                            background:
                                "linear-gradient(135deg, #b86b3e 0%, #c67b4e 50%, #a85b33 100%)",
                            boxShadow:
                                "0 16px 30px rgba(93, 55, 33, 0.3), 0 0 0 1px rgba(140, 88, 58, 0.4)",
                            "&:hover": {
                                background:
                                    "linear-gradient(135deg, #d0834f 0%, #c67447 50%, #9e512c 100%)",
                                boxShadow:
                                    "0 18px 36px rgba(93, 55, 33, 0.38), 0 0 0 1px rgba(140, 88, 58, 0.55)",
                            },
                        }}
                    >
                        Создать публикацию
                    </Button>
                </Stack>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(3, 1fr)",
                        },
                        gap: 3,
                        alignItems: "stretch",
                    }}
                >
                    {publications.map((publication) => {
                        const displayTitle =
                            publication.title ??
                            publication.quoteText ??
                            publication.slug ??
                            "Без названия";
                        return (
                            <Card
                                key={publication.id}
                                elevation={0}
                                onClick={() => navigate(`/admin/publications/${publication.id}`)}
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    borderRadius: 3,
                                    border: "1px solid rgba(140, 185, 220, 0.45)",
                                    bgcolor: "rgba(244, 250, 255, 0.96)",
                                    boxShadow:
                                        "0 18px 40px rgba(35, 85, 130, 0.16)",
                                }}
                            >
                                <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
                                    <Stack spacing={1.3}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontWeight: 600,
                                                color: "#2f1b12",
                                                fontFamily:
                                                    '"Playfair Display", "Georgia", "Times New Roman", serif',
                                            }}
                                        >
                                            {displayTitle}
                                        </Typography>
                                        <Chip
                                            label={typeLabel[publication.type]}
                                            size="small"
                                            sx={{
                                                alignSelf: "flex-start",
                                                bgcolor: "rgba(255, 248, 241, 0.9)",
                                                borderRadius: 2,
                                                border:
                                                    "1px solid rgba(143, 97, 70, 0.4)",
                                                color: "#4f3626",
                                                fontFamily:
                                                    '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                            }}
                                        />
                                    </Stack>
                                </CardContent>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{
                                        px: 2.5,
                                        pb: 2.5,
                                        pt: 0,
                                        justifyContent: "flex-end",
                                    }}
                                >

                                </Stack>
                            </Card>
                        );
                    })}
                </Box>

                {publications.length === 0 && (
                    <Typography
                        variant="body1"
                        sx={{
                            mt: 3,
                            color: "rgba(79, 54, 38, 0.8)",
                            fontFamily:
                                '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                        }}
                    >
                        Публикаций пока нет
                    </Typography>
                )}
            </Box>
        </Box>
    );
}
