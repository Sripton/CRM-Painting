import React, { useMemo, useState } from 'react'
import { Box, Button, Container, Stack, Typography } from '@mui/material'

export default function PublicPublicationNewsAphorismEssayPage() {
    const [activeSection, setActiveSection] = useState<'news' | 'aphorisms' | 'essay'>('news');

    const sections = useMemo(() => ({
        news: {
            label: 'Новости',
            title: 'Хроника мастерской',
            subtitle: 'Короткие заметки и объявленные события',
            content: [
                'В этом сезоне основное внимание уделено серии этюдов, в которых свет и тень ведут почти музыкальный диалог. В мастерской появился новый цикл работ, посвященный городскому ритму и архитектурной пластике.',
                'Параллельно идет работа над каталогом и обновлением публичной экспозиции. Мы открыли доступ к архиву работ, где можно увидеть редкие эскизы и авторские заметки к каждой серии.',
                'В ближайшие недели ожидается публикация материалов о технике лессировок и подготовке холста, а также анонс новой экспозиции, посвященной теме «память места».',
            ],
            footer: 'Подготовлено редакцией. Дата выпуска: текущий сезон.',
        },
        aphorisms: {
            label: 'Афоризмы',
            title: 'Афоризмы о мастерстве',
            subtitle: 'Короткие формулы, которые держат направление мысли',
            content: [
                'В линии слышен характер, в паузе — дисциплина.',
                'Цвет — это время, которое художник превращает в свет.',
                'Холст молчит, пока рука не начнет задавать вопросы.',
                'Повтор — это не копия, а поисковая система для истины.',
                'Тишина мастерской — лучший редактор.',
            ],
            footer: 'Записано в полевых блокнотах.',
        },
        essay: {
            label: 'Эссе',
            title: 'О природе внимательного взгляда',
            subtitle: 'Небольшой текст в форме исследовательского наблюдения',
            content: [
                'Наблюдение — это не пассивное состояние, а метод. Художник, как исследователь, выделяет значимое, строит гипотезы и проверяет их на материале. В этом смысле мастерская напоминает лабораторию: здесь ведутся опыты с цветом, светом и формой.',
                'Внимание действует как линза: оно увеличивает детали и меняет масштаб. То, что вчера было фоном, сегодня становится предметом. Так формируется личная система координат, где каждая точка окрашена опытом.',
                'Научная аккуратность не исключает поэзии. Напротив, строгость формы дает возможность выявить тончайшие оттенки смысла. Результат — не столько ответ, сколько хорошо заданный вопрос.',
            ],
            footer: 'Фрагмент из серии авторских заметок.',
        },
    }), []);

    const current = sections[activeSection];

    return (
        <Box
            sx={{
                bgcolor: "transparent",
                py: { xs: 3, md: 4 },
            }}
        >
            <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, md: 6 } }}>
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
                        ПУБЛИКАЦИИ · ГАЗЕТНАЯ ПОЛОСА
                    </Typography>

                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={{ xs: 2.5, md: 3 }}
                        alignItems="stretch"
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
                                {(Object.keys(sections) as Array<keyof typeof sections>).map((key) => (
                                    <Button
                                        key={key}
                                        variant={activeSection === key ? "contained" : "outlined"}
                                        onClick={() => setActiveSection(key)}
                                        sx={{
                                            justifyContent: "flex-start",
                                            textTransform: "uppercase",
                                            letterSpacing: 1.4,
                                            fontSize: 12,
                                            fontWeight: 700,
                                            borderRadius: 2,
                                            px: 2,
                                            py: 1.1,
                                            color:
                                                activeSection === key ? "#f7f7f7" : "#2f3640",
                                            borderColor: "#5a6f8a",
                                            background:
                                                activeSection === key
                                                    ? "linear-gradient(135deg, #5a6f8a 0%, #8094aa 45%, #465a72 100%)"
                                                    : "transparent",
                                            boxShadow:
                                                activeSection === key
                                                    ? "0 16px 30px rgba(47, 54, 64, 0.22), 0 0 0 1px rgba(95, 111, 134, 0.35)"
                                                    : "none",
                                            "&:hover": {
                                                background:
                                                    activeSection === key
                                                        ? "linear-gradient(135deg, #6a7f99 0%, #8ea0b4 45%, #4f657e 100%)"
                                                        : "rgba(90, 111, 138, 0.08)",
                                                borderColor: "#4f6480",
                                            },
                                        }}
                                    >
                                        {sections[key].label}
                                    </Button>
                                ))}
                            </Stack>
                        </Box>

                        <Box
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
                                    {current.title}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily:
                                            '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                        fontSize: { xs: 12, md: 13 },
                                        textTransform: "uppercase",
                                        letterSpacing: 2,
                                        color: "#5a6f8a",
                                        mt: 0.6,
                                    }}
                                >
                                    {current.subtitle}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    columnCount: { xs: 1, md: 2 },
                                    columnGap: { xs: 24, md: 36 },
                                }}
                            >
                                {current.content.map((paragraph, index) => (
                                    <Typography
                                        key={`${activeSection}-${index}`}
                                        className={index === 0 ? "dropcap" : undefined}
                                        sx={{
                                            fontFamily:
                                                '"Playfair Display", "Georgia", "Times New Roman", serif',
                                            fontSize: { xs: 15.5, md: 17 },
                                            lineHeight: 1.7,
                                            color: "#2f3640",
                                            textAlign: "justify",
                                            mb: 2,
                                            "&.dropcap:first-letter": {
                                                float: "left",
                                                fontSize: { xs: 42, md: 54 },
                                                lineHeight: 0.9,
                                                paddingRight: 8,
                                                paddingTop: 4,
                                                fontWeight: 700,
                                                color: "#5a6f8a",
                                            },
                                        }}
                                    >
                                        {paragraph}
                                    </Typography>
                                ))}
                            </Box>

                            <Typography
                                sx={{
                                    borderTop: "1px solid #4a4f55",
                                    pt: 1.5,
                                    mt: { xs: 2, md: 3 },
                                    fontFamily:
                                        '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                    fontSize: 12,
                                    textTransform: "uppercase",
                                    letterSpacing: 1.6,
                                    color: "#5a6f8a",
                                }}
                            >
                                {current.footer}
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            </Container>
        </Box>
    )
}
