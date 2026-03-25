import { Box, Button, Container, Stack, Typography } from '@mui/material'
import React from 'react'

export default function PublicArtworksPage() {
    const navItems = [
        "FINE ART",
        "ЛИТЕРАТУРА. НОВОСТИ",
        "СТАТЬИ. ОТЗЫВЫ",
        "КОНТАКТЫ",
    ]

    return (
        <Box
            sx={{
                bgcolor: "#f3f3f3",
                backgroundImage:
                    "repeating-linear-gradient(90deg, #f1f1f1 0, #f1f1f1 30px, #ffffff 30px, #ffffff 60px)",
            }}
        >
            <Box
                component="header"
                sx={{
                    width: "100%",
                    bgcolor: "#f5f5f5",
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        aspectRatio: "2048 / 430",
                        backgroundImage: 'url("/img/header/header.jpg")',
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
            </Box>

            <Box
                sx={{
                    pt: 0,
                    pb: 0,
                }}
            >
                <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, md: 6 }, pt: 0 }}>
                    <Box sx={{ maxWidth: 1040, mx: "auto" }}>
                        <Box
                            sx={{
                                bgcolor: "#f6f6f6",
                                borderTop: "3px solid #c72626",
                                boxShadow: "inset 0 1px 0 #ffffff",
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
                                        sx={{
                                            position: "relative",
                                            border: "1px solid #3d3d3d",
                                            bgcolor: "#ffffff",
                                            textAlign: "center",
                                            py: { xs: 1.8, md: 1.7 },
                                            px: { xs: 1.5, md: 2 },
                                            fontSize: { xs: 12, md: 13 },
                                            letterSpacing: 1.5,
                                            textTransform: "uppercase",
                                            lineHeight: 1,
                                            boxShadow: "0 1px 0 #bfbfbf",
                                            borderRadius: 1.3,
                                            cursor: "pointer",
                                        }}
                                    >
                                        {label}
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                border: "1px solid #3d3d3d",
                                bgcolor: "#ffffff",
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
                                        border: "1px solid #3d3d3d",
                                        backgroundImage: 'url("/img/content/author.jpg")',
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                />
                                <Box sx={{ flex: 1 }}>
                                    <Typography
                                        sx={{
                                            fontSize: { xs: 13, md: 14 },
                                            lineHeight: 1.3,
                                            color: "#1f1f1f",
                                            whiteSpace: "pre-line",
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
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 0,
                                        border: "none",
                                        color: "#1f1f1f",
                                        bgcolor: "transparent",
                                        px: { xs: 2.6, md: 3.2 },
                                        py: { xs: 0.9, md: 1 },
                                        fontSize: 12,
                                        letterSpacing: 1.2,
                                        textTransform: "uppercase",
                                        lineHeight: 1,
                                        boxShadow: "none",
                                        "&:hover": {
                                            border: "none",
                                            boxShadow: "none",
                                            bgcolor: "transparent",
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
                                    Подробнее
                                    <Box component="span" className="catalog-dots">
                                        <Box component="span" className="catalog-dot">{" "}{">"}</Box>
                                        <Box component="span" className="catalog-dot">{">"}</Box>
                                        <Box component="span" className="catalog-dot">{">"}</Box>
                                    </Box>
                                </Button>
                            </Box>

                        </Box>

                        {/* --------- Катеории картин первой группы -------- */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
                                gap: { xs: 1.5, md: 2 },
                                mt: { xs: 10, md: 12 },
                            }}
                        >
                            {[
                                "Картины-живопись",
                                "Акварель",
                                "Стено-роспись",
                                "Рельеф (скульптура)",
                            ].map((label) => (
                                <Button
                                    key={`${label}-outside`}
                                    variant="outlined"
                                    sx={{
                                        borderColor: "#3d3d3d",
                                        color: "#1f1f1f",
                                        bgcolor: "#ffffff",
                                        width: "100%",
                                        px: { xs: 1.5, md: 2 },
                                        py: { xs: 1.8, md: 1.7 },
                                        fontSize: { xs: 12, md: 13 },
                                        letterSpacing: 1.5,
                                        textTransform: "uppercase",
                                        lineHeight: 1,
                                        boxShadow: "0 1px 0 #bfbfbf",
                                        borderRadius: 1.3,
                                        cursor: "pointer",

                                    }}
                                >
                                    {label}
                                </Button>
                            ))}
                        </Box>

                        {/* --------- Первый блок ---------*/}
                        <Box
                            sx={{
                                mt: { xs: 3, md: 4 },
                                bgcolor: "#ffffff",
                                border: "1px solid #3d3d3d",
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
                                {Array.from({ length: 18 }).map((_, idx) => (
                                    <Box
                                        key={`artwork-slot-${idx}`}
                                        sx={{
                                            width: "100%",
                                            aspectRatio: "4 / 3",
                                            bgcolor: "#111111",
                                            border: "1px solid #3d3d3d",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>

                        {/* --------- Кнопка перейти в каталог первого блока ----------- */}
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
                                sx={{
                                    borderRadius: 0,
                                    border: "none",
                                    color: "#1f1f1f",
                                    bgcolor: "transparent",
                                    px: { xs: 2.6, md: 3.2 },
                                    py: { xs: 0.9, md: 1 },
                                    fontSize: 12,
                                    letterSpacing: 1.2,
                                    textTransform: "uppercase",
                                    lineHeight: 1,
                                    boxShadow: "none",
                                    "&:hover": {
                                        border: "none",
                                        boxShadow: "none",
                                        bgcolor: "transparent",
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


                        {/* ----------- Катеории картин второй группы ----------  */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
                                gap: { xs: 1.5, md: 2 },
                                mt: { xs: 5, md: 6 },
                            }}
                        >
                            {[
                                "Литографии",
                                "Рисунки",
                                "Станковая-графика",
                                "Уникальная графика",
                            ].map((label) => (
                                <Button
                                    key={`${label}-outside`}
                                    variant="outlined"
                                    sx={{
                                        borderColor: "#3d3d3d",
                                        color: "#1f1f1f",
                                        bgcolor: "#ffffff",
                                        width: "100%",
                                        px: { xs: 1.5, md: 2 },
                                        py: { xs: 1.8, md: 1.7 },
                                        fontSize: { xs: 12, md: 13 },
                                        letterSpacing: 1.5,
                                        textTransform: "uppercase",
                                        lineHeight: 1,
                                        boxShadow: "0 1px 0 #bfbfbf",
                                        borderRadius: 1.3,
                                        cursor: "pointer",

                                    }}
                                >
                                    {label}
                                </Button>
                            ))}
                        </Box>


                        {/* --------- Второй блок ---------*/}
                        <Box
                            sx={{
                                mt: { xs: 3, md: 4 },
                                bgcolor: "#ffffff",
                                border: "1px solid #3d3d3d",
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
                                {Array.from({ length: 18 }).map((_, idx) => (
                                    <Box
                                        key={`artwork-slot-2-${idx}`}
                                        sx={{
                                            width: "100%",
                                            aspectRatio: "4 / 3",
                                            bgcolor: "#111111",
                                            border: "1px solid #3d3d3d",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>

                        {/* --------- Кнопка перейти в каталог Второго блока ----------- */}
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
                                sx={{
                                    borderRadius: 0,
                                    border: "none",
                                    color: "#1f1f1f",
                                    bgcolor: "transparent",
                                    px: { xs: 2.6, md: 3.2 },
                                    py: { xs: 0.9, md: 1 },
                                    fontSize: 12,
                                    letterSpacing: 1.2,
                                    textTransform: "uppercase",
                                    lineHeight: 1,
                                    boxShadow: "none",
                                    "&:hover": {
                                        border: "none",
                                        boxShadow: "none",
                                        bgcolor: "transparent",
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



                        {/* --------- Катеории картин третьей группы -------- */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
                                gap: { xs: 1.5, md: 2 },
                                mt: { xs: 5, md: 6 },
                            }}
                        >
                            {[
                                "Фирменные стили",
                                "Плакаты",
                                "Проекты",
                                "Реклама, Сувениры",
                            ].map((label) => (
                                <Button
                                    key={`${label}-outside`}
                                    variant="outlined"
                                    sx={{
                                        borderColor: "#3d3d3d",
                                        color: "#1f1f1f",
                                        bgcolor: "#ffffff",
                                        width: "100%",
                                        px: { xs: 1.5, md: 2 },
                                        py: { xs: 1.8, md: 1.7 },
                                        fontSize: { xs: 12, md: 13 },
                                        letterSpacing: 1.5,
                                        textTransform: "uppercase",
                                        lineHeight: 1,
                                        boxShadow: "0 1px 0 #bfbfbf",
                                        borderRadius: 1.3,
                                        cursor: "pointer",

                                    }}
                                >
                                    {label}
                                </Button>
                            ))}
                        </Box>

                        {/* --------- Третий блок ---------*/}
                        <Box
                            sx={{
                                mt: { xs: 3, md: 4 },
                                bgcolor: "#ffffff",
                                border: "1px solid #3d3d3d",
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
                                {Array.from({ length: 18 }).map((_, idx) => (
                                    <Box
                                        key={`artwork-slot-3-${idx}`}
                                        sx={{
                                            width: "100%",
                                            aspectRatio: "4 / 3",
                                            bgcolor: "#111111",
                                            border: "1px solid #3d3d3d",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>


                        {/* --------- Кнопка перейти в каталог третьего блока ----------- */}
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
                                sx={{
                                    borderRadius: 0,
                                    border: "none",
                                    color: "#1f1f1f",
                                    bgcolor: "transparent",
                                    px: { xs: 2.6, md: 3.2 },
                                    py: { xs: 0.9, md: 1 },
                                    fontSize: 12,
                                    letterSpacing: 1.2,
                                    textTransform: "uppercase",
                                    lineHeight: 1,
                                    boxShadow: "none",
                                    "&:hover": {
                                        border: "none",
                                        boxShadow: "none",
                                        bgcolor: "transparent",
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

                        {/* --------- Категории картин четвертой группы -------- */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
                                gap: { xs: 1.5, md: 2 },
                                mt: { xs: 5, md: 6 },
                            }}
                        >
                            {[
                                "Портреты",
                                "Архитектура",
                                "Сюжеты. темы",
                                "Пейзажи",
                            ].map((label) => (
                                <Button
                                    key={`${label}-outside`}
                                    variant="outlined"
                                    sx={{
                                        borderColor: "#3d3d3d",
                                        color: "#1f1f1f",
                                        bgcolor: "#ffffff",
                                        width: "100%",
                                        px: { xs: 1.5, md: 2 },
                                        py: { xs: 1.8, md: 1.7 },
                                        fontSize: { xs: 12, md: 13 },
                                        letterSpacing: 1.5,
                                        textTransform: "uppercase",
                                        lineHeight: 1,
                                        boxShadow: "0 1px 0 #bfbfbf",
                                        borderRadius: 1.3,
                                        cursor: "pointer",

                                    }}
                                >
                                    {label}
                                </Button>
                            ))}
                        </Box>

                        {/* --------- Четвертый блок ---------*/}
                        <Box
                            sx={{
                                mt: { xs: 3, md: 4 },
                                bgcolor: "#ffffff",
                                border: "1px solid #3d3d3d",
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
                                {Array.from({ length: 18 }).map((_, idx) => (
                                    <Box
                                        key={`artwork-slot-3-${idx}`}
                                        sx={{
                                            width: "100%",
                                            aspectRatio: "4 / 3",
                                            bgcolor: "#111111",
                                            border: "1px solid #3d3d3d",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>


                        {/* --------- Кнопка перейти в каталог четвертого блока ----------- */}
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
                                sx={{
                                    borderRadius: 0,
                                    border: "none",
                                    color: "#1f1f1f",
                                    bgcolor: "transparent",
                                    px: { xs: 2.6, md: 3.2 },
                                    py: { xs: 0.9, md: 1 },
                                    fontSize: 12,
                                    letterSpacing: 1.2,
                                    textTransform: "uppercase",
                                    lineHeight: 1,
                                    boxShadow: "none",
                                    "&:hover": {
                                        border: "none",
                                        boxShadow: "none",
                                        bgcolor: "transparent",
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




                    </Box>

                </Container>
            </Box >

            <Box
                component="footer"
                sx={{
                    borderTop: "1px solid #3d3d3d",
                    bgcolor: "#f6f6f6",
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
                                        fontSize: 12,
                                        letterSpacing: 1.4,
                                        textTransform: "uppercase",
                                        fontWeight: 700,
                                        mb: 1,
                                    }}
                                >
                                    Социальные сети
                                </Typography>
                                <Stack direction="row" spacing={2}>
                                    <Typography sx={{ fontSize: 12, letterSpacing: 1 }}>
                                        FACEBOOK
                                    </Typography>
                                    <Typography sx={{ fontSize: 12, letterSpacing: 1 }}>
                                        TWITTER
                                    </Typography>
                                </Stack>
                            </Box>
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: 12,
                                        letterSpacing: 1.4,
                                        textTransform: "uppercase",
                                        fontWeight: 700,
                                        mb: 1,
                                    }}
                                >
                                    Контакты
                                </Typography>
                                <Typography sx={{ fontSize: 12, letterSpacing: 0.6 }}>
                                    8 (926) 361-45-75
                                </Typography>
                                <Typography sx={{ fontSize: 12, letterSpacing: 0.6 }}>
                                    Художник Газали-Дибир Израилов
                                </Typography>
                                <Typography sx={{ fontSize: 12, letterSpacing: 0.6 }}>
                                    gazali_d@mail.ru
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                </Container>
            </Box>
        </Box >
    )
}
