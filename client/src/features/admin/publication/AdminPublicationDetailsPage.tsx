import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Stack,
    Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../lib/api";

export default function AdminPublicationDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [publication, setPublication] = useState<PublicationDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    const formatDate = (value: string | null) => {
        if (!value) {
            return "—";
        }
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) {
            return value;
        }
        return parsed.toLocaleString("ru-RU");
    };

    useEffect(() => {
        async function loadPublication() {
            if (!id) {
                setError("Не найден идентификатор публикации");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);
                const res = await api.get(`/api/admin/publications/${id}`);
                setPublication(res.data);
            } catch {
                setError("Ошибка загрузки публикации");
            } finally {
                setLoading(false);
            }
        }
        loadPublication();
    }, [id]);

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

    if (error || !publication) {
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
                <Typography color="error">
                    {error ?? "Публикация не найдена"}
                </Typography>
            </Box>
        );
    }

    const displayTitle =
        publication.title ??
        publication.quoteText ??
        publication.slug ??
        "Без названия";

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
                    maxWidth: 1100,
                    mx: "auto",
                }}
            >
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", md: "center" }}
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
                            {displayTitle}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                            <Chip
                                label={typeLabel[publication.type]}
                                size="small"
                                sx={{
                                    bgcolor: "rgba(255, 248, 241, 0.9)",
                                    borderRadius: 2,
                                    border: "1px solid rgba(143, 97, 70, 0.4)",
                                    color: "#4f3626",
                                    fontFamily:
                                        '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                }}
                            />
                            <Chip
                                label={publication.isPublished ? "Опубликовано" : "Черновик"}
                                size="small"
                                sx={{
                                    bgcolor: publication.isPublished
                                        ? "rgba(214, 244, 228, 0.9)"
                                        : "rgba(255, 235, 230, 0.9)",
                                    borderRadius: 2,
                                    border: "1px solid rgba(143, 97, 70, 0.35)",
                                    color: "#4f3626",
                                    fontFamily:
                                        '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                }}
                            />
                        </Stack>
                    </Box>

                    <Stack direction="row" spacing={1.5}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/admin/publications")}
                            sx={{
                                textTransform: "none",
                                borderRadius: 999,
                                borderColor: "rgba(143, 97, 70, 0.7)",
                                color: "#6b3f26",
                                minWidth: 200,
                                height: 44,
                                fontFamily:
                                    '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                "&:hover": {
                                    borderColor: "rgba(143, 97, 70, 0.95)",
                                    background: "rgba(255, 248, 241, 0.7)",
                                },
                            }}
                        >
                            Назад к списку
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => navigate(`/admin/publications/edit/${publication.id}`)}
                            sx={{
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: 999,
                                px: 3,
                                minWidth: 200,
                                height: 44,
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
                            Редактировать
                        </Button>
                    </Stack>
                </Stack>

                <Stack spacing={3}>
                    {publication.coverImage?.url && (
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: "1px solid rgba(140, 185, 220, 0.45)",
                                bgcolor: "rgba(244, 250, 255, 0.96)",
                                boxShadow: "0 18px 40px rgba(35, 85, 130, 0.16)",
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        color: "#2f1b12",
                                        fontFamily:
                                            '"Playfair Display", "Georgia", "Times New Roman", serif',
                                        mb: 2,
                                    }}
                                >
                                    Обложка
                                </Typography>
                                <Box
                                    component="img"
                                    src={publication.coverImage.url}
                                    alt={displayTitle}
                                    sx={{
                                        width: "100%",
                                        maxHeight: 420,
                                        objectFit: "cover",
                                        borderRadius: 2,
                                        border: "1px solid rgba(140, 185, 220, 0.45)",
                                        boxShadow: "0 12px 30px rgba(35, 85, 130, 0.12)",
                                    }}
                                />
                            </CardContent>
                        </Card>
                    )}
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: "1px solid rgba(140, 185, 220, 0.45)",
                            bgcolor: "rgba(244, 250, 255, 0.96)",
                            boxShadow: "0 18px 40px rgba(35, 85, 130, 0.16)",
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    color: "#2f1b12",
                                    fontFamily:
                                        '"Playfair Display", "Georgia", "Times New Roman", serif',
                                    mb: 2,
                                }}
                            >
                                Основная информация
                            </Typography>
                            <Stack spacing={1.5}>
                                <InfoRow label="ID" value={publication.id} />
                                <InfoRow label="Slug" value={publication.slug ?? "—"} />
                                <InfoRow
                                    label="Дата публикации"
                                    value={formatDate(publication.publishedAt)}
                                />
                                <InfoRow
                                    label="Создано"
                                    value={formatDate(publication.createdAt)}
                                />
                                <InfoRow
                                    label="Обновлено"
                                    value={formatDate(publication.updatedAt)}
                                />
                            </Stack>
                        </CardContent>
                    </Card>

                    {(publication.title || publication.titleEn) && (
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: "1px solid rgba(140, 185, 220, 0.45)",
                                bgcolor: "rgba(244, 250, 255, 0.96)",
                                boxShadow: "0 18px 40px rgba(35, 85, 130, 0.16)",
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        color: "#2f1b12",
                                        fontFamily:
                                            '"Playfair Display", "Georgia", "Times New Roman", serif',
                                        mb: 2,
                                    }}
                                >
                                    Заголовки
                                </Typography>
                                <Stack spacing={2}>
                                    <TextBlock
                                        label="Название (RU)"
                                        value={publication.title ?? "—"}
                                    />
                                    <TextBlock
                                        label="Название (EN)"
                                        value={publication.titleEn ?? "—"}
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    )}

                    {(publication.body || publication.bodyEn) && (
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: "1px solid rgba(140, 185, 220, 0.45)",
                                bgcolor: "rgba(244, 250, 255, 0.96)",
                                boxShadow: "0 18px 40px rgba(35, 85, 130, 0.16)",
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        color: "#2f1b12",
                                        fontFamily:
                                            '"Playfair Display", "Georgia", "Times New Roman", serif',
                                        mb: 2,
                                    }}
                                >
                                    Текст публикации
                                </Typography>
                                <Stack spacing={2.5}>
                                    <TextBlock
                                        label="Текст (RU)"
                                        value={publication.body ?? "—"}
                                        preserveLines
                                    />
                                    <Divider />
                                    <TextBlock
                                        label="Текст (EN)"
                                        value={publication.bodyEn ?? "—"}
                                        preserveLines
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    )}

                    {(publication.quoteText || publication.quoteTextEn) && (
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: "1px solid rgba(140, 185, 220, 0.45)",
                                bgcolor: "rgba(244, 250, 255, 0.96)",
                                boxShadow: "0 18px 40px rgba(35, 85, 130, 0.16)",
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        color: "#2f1b12",
                                        fontFamily:
                                            '"Playfair Display", "Georgia", "Times New Roman", serif',
                                        mb: 2,
                                    }}
                                >
                                    Цитата
                                </Typography>
                                <Stack spacing={2}>
                                    <TextBlock
                                        label="Цитата (RU)"
                                        value={publication.quoteText ?? "—"}
                                        preserveLines
                                    />
                                    <TextBlock
                                        label="Цитата (EN)"
                                        value={publication.quoteTextEn ?? "—"}
                                        preserveLines
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    )}
                </Stack>
            </Box>
        </Box>
    );
}

type PublicationType = "NEWS" | "APHORISM" | "ESSAY" | "ARTICLE" | "REVIEW";

type PublicationDetails = {
    id: string;
    type: PublicationType;
    title: string | null;
    titleEn: string | null;
    slug: string | null;
    body: string | null;
    bodyEn: string | null;
    quoteText: string | null;
    quoteTextEn: string | null;
    isPublished: boolean;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
    coverImage: { id: string; url: string } | null;
};

type InfoRowProps = {
    label: string;
    value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
    return (
        <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 0.5, sm: 2 }}
        >
            <Typography
                variant="subtitle2"
                sx={{
                    minWidth: 180,
                    color: "rgba(79, 54, 38, 0.8)",
                    fontFamily: '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                }}
            >
                {label}
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    color: "#2f1b12",
                    fontFamily: '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                }}
            >
                {value}
            </Typography>
        </Stack>
    );
}

type TextBlockProps = {
    label: string;
    value: string;
    preserveLines?: boolean;
};

function TextBlock({ label, value, preserveLines }: TextBlockProps) {
    return (
        <Box>
            <Typography
                variant="subtitle2"
                sx={{
                    color: "rgba(79, 54, 38, 0.85)",
                    mb: 0.5,
                    fontFamily: '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                }}
            >
                {label}
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    color: "#2f1b12",
                    whiteSpace: preserveLines ? "pre-wrap" : "normal",
                    fontFamily: '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                }}
            >
                {value}
            </Typography>
        </Box>
    );
}
