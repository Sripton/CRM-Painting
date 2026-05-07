import { useEffect, useMemo, useState } from "react";
import { Box, Button, CircularProgress, Container, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import type { AxiosError } from "axios";
import { api } from "../../../../lib/api";

type PublicationType = "NEWS" | "APHORISM" | "ESSAY" | "ARTICLE" | "REVIEW";

type PublicationFull = {
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
    coverImage: {
        id: string;
        url: string;
    } | null;
};

export default function PublicationDetailsPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [publication, setPublication] = useState<PublicationFull | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const displayTitle = useMemo(() => {
        if (!publication) {
            return "";
        }
        return (
            publication.title ??
            publication.quoteText ??
            publication.slug ??
            "Без названия"
        );
    }, [publication]);

    const hasText = (value: string | null) => (value ?? "").trim().length > 0;

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
                const res = await api.get("/api/public/publications");
                const found = (res.data as PublicationFull[]).find(
                    (item) => item.id === id,
                );
                if (!found) {
                    setError("Публикация не найдена");
                    setPublication(null);
                } else {
                    setPublication(found);
                }
            } catch (error) {
                const err = error as AxiosError<{ message?: string }>;
                setError(err.response?.data?.message || "Ошибка загрузки публикации");
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
                    bgcolor: "transparent",
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
                    bgcolor: "transparent",
                }}
            >
                <Typography color="error">
                    {error ?? "Публикация не найдена"}
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                bgcolor: "transparent",
                py: { xs: 3, md: 4 },
            }}
        >
            <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, md: 6 } }}>
                <Box sx={{ maxWidth: 980, mx: "auto" }}>
                    <Typography
                        sx={{
                            textAlign: "center",
                            fontWeight: 700,
                            fontSize: { xs: 12, md: 13 },
                            letterSpacing: 2,
                            textTransform: "uppercase",
                            color: "#5a6f8a",
                            fontFamily:
                                '"Playfair Display", "Georgia", "Times New Roman", serif',
                            mb: { xs: 2.5, md: 3 },
                        }}
                    >
                        ПУБЛИКАЦИЯ
                    </Typography>


                    <Box
                        sx={{
                            border: "1px solid #4a4f55",
                            borderRadius: 4,
                            bgcolor: "#fbfbfa",
                            boxShadow:
                                "0 20px 45px rgba(47, 54, 64, 0.12), 0 8px 18px rgba(47, 54, 64, 0.06)",
                            px: { xs: 3, md: 5 },
                            py: { xs: 3, md: 4 },
                        }}
                    >
                        <Box
                            sx={{
                                borderBottom: "2px solid #4a4f55",
                                pb: 1.5,
                                mb: { xs: 2, md: 3 },
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily:
                                        '"Playfair Display", "Georgia", "Times New Roman", serif',
                                    fontWeight: 700,
                                    fontSize: { xs: 26, md: 34 },
                                    color: "#2f3640",
                                    letterSpacing: 1,
                                }}
                            >
                                {displayTitle}
                            </Typography>
                        </Box>

                        <Stack spacing={2.5}>
                            {(hasText(publication.body) || hasText(publication.bodyEn)) && (
                                <Box>
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
                                        {hasText(publication.body) && (
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: "#2f1b12",
                                                    whiteSpace: "pre-wrap",
                                                    fontFamily:
                                                        '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                                }}
                                            >
                                                {publication.body!.trim()}
                                            </Typography>
                                        )}
                                        {hasText(publication.bodyEn) && (
                                            <TextBlock
                                                label="Текст (EN)"
                                                value={publication.bodyEn!.trim()}
                                                preserveLines
                                            />
                                        )}
                                    </Stack>
                                </Box>
                            )}
                            {(hasText(publication.quoteText) || hasText(publication.quoteTextEn)) && (
                                <Box>
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
                                        {hasText(publication.quoteText) && (
                                            <TextBlock
                                                label="Цитата (RU)"
                                                value={publication.quoteText!.trim()}
                                                preserveLines
                                            />
                                        )}
                                        {hasText(publication.quoteTextEn) && (
                                            <TextBlock
                                                label="Цитата (EN)"
                                                value={publication.quoteTextEn!.trim()}
                                                preserveLines
                                            />
                                        )}
                                    </Stack>
                                </Box>
                            )}
                        </Stack>
                    </Box>
                     {/* Кнопка назад */}
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/publications-news-aphorizm-essay")}
                            sx={{
                                textTransform: "none",
                                borderRadius: 2,
                                borderColor: "rgba(90, 111, 138, 0.7)",
                                color: "#2f3640",
                                "&:hover": {
                                    borderColor: "rgba(90, 111, 138, 0.95)",
                                    background: "rgba(90, 111, 138, 0.08)",
                                },
                            }}
                        >
                            Назад
                        </Button>
                    </Box>
                </Box>

            </Container>

        </Box>
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
