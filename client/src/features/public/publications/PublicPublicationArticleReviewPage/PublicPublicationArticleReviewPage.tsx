import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import type { AxiosError } from 'axios';
import { api } from "../../../../lib/api";
import { useNavigate } from 'react-router-dom';

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
    isPublished: boolean;           // всегда есть, не null
    publishedAt: string | null;     // может быть null
    coverImage: {
        id: string;
        url: string;
    } | null;                       // может быть null
};

type VisibleSection = "ARTICLE" | "REVIEW";

const sectionTabs: { key: VisibleSection; label: string }[] = [
    {
        key: "ARTICLE",
        label: "Статьи"
    },
    {
        key: "REVIEW",
        label: "Отзывы"
    },
];

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





export default function PublicPublicationArticleReviewPage() {
    const navigate = useNavigate();
    const [publications, setPublications] = useState<PublicationFull[]>([]);
    const [activeSection, setActiveSection] = useState<'ARTICLE' | 'REVIEW'>('ARTICLE');

    useEffect(() => {
        async function loadPublications() {
            try {
                // дергаем маршрту get
                const res = await api.get(`/api/public/publications`);
                setPublications(res.data);
            } catch (error) {
                console.error("Не удалось загрузить публикации ARTICLE/REVIEW", error as AxiosError);
            }
        }
        loadPublications();
    }, []);

    // фильтрируем те публикации котрые активны по разделу
    const filteredPublications = useMemo(() => {
        return publications.filter((publication) => publication.type === activeSection)
    }, [publications, activeSection]);

    // лимит отображаемого текста 
    const textPreviewLimit = 600; // 600 строк 

    // если текст существует и не пустой 
    const hasText = (value: string | null) => (value ?? "").trim().length > 0;

    const getPreviewText = (value: string) => {
        if (value.length <= textPreviewLimit) {
            return value;
        }
        return `${value.slice(0, textPreviewLimit).trim()}...`
    }


    // функция на проверку превышел ли допустимый лимит отображаемого текста
    const hasLongText = (publication: PublicationFull) => {
        const value = [
            publication.body,
            publication.bodyEn,
            publication.quoteText,
            publication.quoteTextEn,
        ];
        return value.some((value) => (value?.length ?? 0) > textPreviewLimit);
    }



    return (
        <Box sx={{
            bgcolor: "transparent",
            py: { xs: 3, md: 4 },
        }}>
            <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, md: 6 } }} >
                <Box sx={{ maxWidth: 1180, mx: "auto" }}>
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
                        ПУБЛИКАЦИИ
                    </Typography>
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={{ xs: 2.5, md: 3 }}
                        alignItems={{ xs: "stretch", md: "flex-start" }}
                    >
                        <Box
                            sx={{
                                width: { xs: "100%", md: 240 },
                                border: "1px solid #4a4f55",
                                borderRadius: 4,
                                bgcolor: "#fbfbfa",
                                px: 2,
                                py: 2.5,
                                boxShadow:
                                    "0 20px 45px rgba(47, 54, 64, 0.12), 0 8px 18px rgba(47, 54, 64, 0.06)",
                                alignSelf: { xs: "stretch", md: "flex-start" },
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily:
                                        '"Playfair Display", "Georgia", "Times New Roman", serif',
                                    fontSize: 13,
                                    fontWeight: 700,
                                    letterSpacing: 2,
                                    textTransform: "uppercase",
                                    color: "#5a6f8a",
                                    mb: 2,
                                }}
                            >
                                Разделы
                            </Typography>
                            <Stack spacing={1.2}>
                                {sectionTabs.map((tabs) => (
                                    <Button
                                        key={tabs.key}
                                        variant={activeSection === tabs.key ? "contained" : "outlined"}
                                        onClick={() => setActiveSection(tabs.key)}
                                        sx={{
                                            justifyContent: "flex-start",
                                            textTransform: "uppercase",
                                            letterSpacing: 1.4,
                                            fontSize: 12,
                                            fontWeight: 700,
                                            fontFamily:
                                                '"Bebas Neue", "Arial Narrow", Arial, sans-serif',
                                            borderRadius: 2,
                                            px: 2,
                                            py: 1.1,
                                            color:
                                                activeSection === tabs.key ? "#f7f7f7" : "#2f3640",
                                            borderColor: "#5a6f8a",
                                            background:
                                                activeSection === tabs.key
                                                    ? "linear-gradient(135deg, #5a6f8a 0%, #8094aa 45%, #465a72 100%)"
                                                    : "transparent",
                                            boxShadow:
                                                activeSection === tabs.key
                                                    ? "0 16px 30px rgba(47, 54, 64, 0.22), 0 0 0 1px rgba(95, 111, 134, 0.35)"
                                                    : "none",
                                            "&:hover": {
                                                background:
                                                    activeSection === tabs.key
                                                        ? "linear-gradient(135deg, #6a7f99 0%, #8ea0b4 45%, #4f657e 100%)"
                                                        : "rgba(90, 111, 138, 0.08)",
                                                borderColor: "#4f6480",
                                            },
                                        }}
                                    >
                                        {tabs?.label}
                                    </Button>
                                ))}
                            </Stack>
                        </Box>
                        <Stack spacing={4}>
                            {filteredPublications.map((publication) => {
                                const displayTitle =
                                    publication.title ??
                                    publication.quoteText ??
                                    publication.slug ??
                                    "Без названия";
                                return (
                                    <Box
                                        key={publication.id}
                                        sx={{
                                            flex: 1,
                                            border: "1px solid #4a4f55",
                                            borderRadius: 4,
                                            bgcolor: "#fbfbfa",
                                            boxShadow:
                                                "0 20px 45px rgba(47, 54, 64, 0.12), 0 8px 18px rgba(47, 54, 64, 0.06)",
                                            px: { xs: 3, md: 5 },
                                            py: { xs: 3, md: 4 },
                                            position: "relative",
                                        }}>
                                        <Box sx={{
                                            borderBottom: "2px solid #4a4f55",
                                            pb: 1.5,
                                            mb: { xs: 2, md: 3 },
                                        }}>
                                            <Typography sx={{
                                                fontFamily:
                                                    '"Bebas Neue", "Arial Narrow", Arial, sans-serif',
                                                fontWeight: 700,
                                                fontSize: { xs: 26, md: 34 },
                                                color: "#2f3640",
                                                letterSpacing: 1,
                                            }}>
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
                                                            <Typography variant="body1"
                                                                sx={{
                                                                    color: "#2f1b12",
                                                                    whiteSpace: "pre-wrap",
                                                                    fontFamily:
                                                                        '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                                                }}>
                                                                {getPreviewText(publication.body!.trim())}
                                                            </Typography>
                                                        )}
                                                        {hasText(publication.bodyEn) && (
                                                            <TextBlock
                                                                label="Текст (EN)"
                                                                value={getPreviewText(publication.bodyEn!.trim())}
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
                                                                value={getPreviewText(publication.quoteText!.trim())}
                                                                preserveLines
                                                            />
                                                        )}
                                                        {hasText(publication.quoteTextEn) && (
                                                            <TextBlock
                                                                label="Цитата (EN)"
                                                                value={getPreviewText(publication.quoteTextEn!.trim())}
                                                                preserveLines
                                                            />
                                                        )}
                                                    </Stack>
                                                </Box>
                                            )}

                                            {hasLongText(publication) && (
                                                <Box>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() => navigate(`/publications/${publication.id}`)}
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
                                                        Читать полностью
                                                    </Button>
                                                </Box>
                                            )}
                                        </Stack>
                                    </Box>
                                )
                            })}
                        </Stack>
                    </Stack>
                </Box>
            </Container>
        </Box>
    )
}
