import React, { useState } from 'react'
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { AxiosError } from "axios";

import { api } from '../../lib/api';
import { useNavigate } from 'react-router-dom';

// Тип категории картин
type ArtworkCategory =
    "PAINTING" | "WATERCOLOR" | "WALL_PAINTING" | "RELIEF" |
    "LITHOGRAPHY" | "DRAWING" | "EASEL_GRAPHICS" | "UNIQUE_GRAPHICS" |
    "BRAND_IDENTITY" | "POSTER" | "PROJECT" | "ADVERTISING" | "SOUVENIR" |
    "PORTRAIT" | "ARCHITECTURE" | "SUBJECT" | "LANDSCAPE"


// Тип подгруппа картин
type ArtworkGroup =
    | "PAINTING_AND_WALL_ART"
    | "GRAPHICS_AND_PRINTS"
    | "DESIGN_AND_ADVERTISING"
    | "SUBJECTS_AND_THEMES";

export default function AdminArtworkCreatePage() {
    // для навигации на AdminArtworkEditPage после успешной загрузки
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [year, setYear] = useState("");
    const [widthCm, setWidthCm] = useState("");
    const [heightCm, setHeightCm] = useState("");
    const [materials, setMaterials] = useState("");
    const [priceCents, setPriceCents] = useState("");
    const [currency, setCurrency] = useState("EUR");
    const [category, setCategory] = useState<ArtworkCategory>("PAINTING");
    const [artworkGroup, setArtworkGroup] = useState<ArtworkGroup>("PAINTING_AND_WALL_ART");
    const [isPublished, setIsPublished] = useState(false);

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // преобразование string значений в number
    function toNullableNumber(value: string) {
        // если значение пустое возвращаем undefined
        if (value.trim() === "") return undefined;
        return Number(value); // преобразуем string в typeof number
    }

    // функция создания кратины
    async function handleSubmit(e: React.FormEvent) {
        // убираем стандарное поведение 
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            const payload = {
                title: title.trim(),
                slug: slug.trim(),
                description: description.trim() || undefined,
                year: toNullableNumber(year),
                widthCm: toNullableNumber(widthCm),
                heightCm: toNullableNumber(heightCm),
                materials: materials.trim() || undefined,
                priceCents: toNullableNumber(priceCents),
                currency: currency.trim() || undefined,
                artworkGroup, // к какой группе относится картина
                category, // к какой категрии относится картина
                isPublished
            }
            const res = await api.post("/api/admin/artworks", payload);
            // переход к редактирвоанию 
            navigate(`/admin/artworks/${res.data.id}`);
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            setError(err?.response?.data?.message || "Ошибка создания картины");
        }
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                pt: 5,
                pb: 4,
                px: 1.5,
                position: "relative",
                overflow: "hidden",
                bgcolor: "#f2f9ff",
                backgroundImage:
                    "linear-gradient(140deg, rgba(236, 249, 255, 0.98) 0%, rgba(214, 235, 251, 0.92) 45%, rgba(185, 219, 244, 0.95) 100%)",
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
            <Card sx={{
                width: "100%",
                maxWidth: 760,
                position: "relative",
                zIndex: 1,
                borderRadius: 4,
                border: "1px solid rgba(140, 185, 220, 0.45)",
                bgcolor: "rgba(244, 250, 255, 0.92)",
                boxShadow:
                    "0 25px 60px rgba(35, 85, 130, 0.16), 0 10px 24px rgba(35, 85, 130, 0.1)",
            }}>
                <CardContent sx={{ p: 3 }}>
                    <Typography
                        variant="overline"
                        sx={{
                            letterSpacing: 3,
                            color: "#8a5a3c",
                            fontWeight: 600,
                            fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
                        }}
                    >
                        Газали-Дибир Израилов
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            mb: 2,
                            fontWeight: 700,
                            color: "#2f1b12",
                            fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
                        }}
                    >
                        Создать картину
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={2.5}>
                            <TextField
                                label="Название"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                fullWidth
                                InputLabelProps={{
                                    sx: {
                                        color: "rgba(86, 54, 33, 0.8)",
                                        fontFamily:
                                            '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                    },
                                }}
                                InputProps={{
                                    sx: {
                                        color: "#2f1b12",
                                        backgroundColor: "rgba(255, 248, 241, 0.7)",
                                        borderRadius: 2,
                                        fontFamily:
                                            '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgba(143, 97, 70, 0.5)",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgba(143, 97, 70, 0.85)",
                                        },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#b26b3a",
                                        },
                                    },
                                }}
                            />

                            <TextField
                                label="Slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                required
                                fullWidth
                                helperText="Например: gory-na-zakate"
                                InputLabelProps={{
                                    sx: {
                                        color: "rgba(86, 54, 33, 0.8)",
                                        fontFamily:
                                            '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                    },
                                }}
                                InputProps={{
                                    sx: {
                                        color: "#2f1b12",
                                        backgroundColor: "rgba(255, 248, 241, 0.7)",
                                        borderRadius: 2,
                                        fontFamily:
                                            '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgba(143, 97, 70, 0.5)",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgba(143, 97, 70, 0.85)",
                                        },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#b26b3a",
                                        },
                                    },
                                }}
                            />

                            <TextField
                                label="Описание"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                multiline
                                minRows={4}
                                fullWidth
                                InputLabelProps={{
                                    sx: {
                                        color: "rgba(86, 54, 33, 0.8)",
                                        fontFamily:
                                            '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                    },
                                }}
                                InputProps={{
                                    sx: {
                                        color: "#2f1b12",
                                        backgroundColor: "rgba(255, 248, 241, 0.7)",
                                        borderRadius: 2,
                                        fontFamily:
                                            '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgba(143, 97, 70, 0.5)",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgba(143, 97, 70, 0.85)",
                                        },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#b26b3a",
                                        },
                                    },
                                }}
                            />
                            {/* Выбор к какой группе будет относиться картина */}
                            <FormControl fullWidth>
                                <InputLabel id="artwork-group-label">Группа</InputLabel>
                                <Select
                                    labelId="artwork-group-label"
                                    label="Группа"
                                    value={artworkGroup}
                                    onChange={(e) => setArtworkGroup(e.target.value as ArtworkGroup)}
                                >
                                    <MenuItem value="PAINTING_AND_WALL_ART">PAINTING_AND_WALL_ART</MenuItem>
                                    <MenuItem value="GRAPHICS_AND_PRINTS">GRAPHICS_AND_PRINTS</MenuItem>
                                    <MenuItem value="DESIGN_AND_ADVERTISING">DESIGN_AND_ADVERTISING</MenuItem>
                                    <MenuItem value="SUBJECTS_AND_THEMES">SUBJECTS_AND_THEMES</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Выбор к какой категории будет относиться картина */}
                            <FormControl fullWidth>
                                <InputLabel id="category-label">Категория</InputLabel>
                                <Select
                                    labelId="category-label"
                                    label="Категория"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as ArtworkCategory)}
                                >
                                    <MenuItem value="PAINTING">PAINTING</MenuItem>
                                    <MenuItem value="WATERCOLOR">WATERCOLOR</MenuItem>
                                    <MenuItem value="WALL_PAINTING">WALL_PAINTING</MenuItem>
                                </Select>
                            </FormControl>

                            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                                <TextField
                                    label="Год"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    type="number"
                                    fullWidth
                                />

                                <TextField
                                    label="Ширина (см)"
                                    value={widthCm}
                                    onChange={(e) => setWidthCm(e.target.value)}
                                    type="number"
                                    fullWidth
                                />

                                <TextField
                                    label="Высота (см)"
                                    value={heightCm}
                                    onChange={(e) => setHeightCm(e.target.value)}
                                    type="number"
                                    fullWidth
                                />
                            </Stack>
                            <TextField
                                label="Материалы"
                                value={materials}
                                onChange={(e) => setMaterials(e.target.value)}
                                fullWidth
                            />
                            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                                <TextField
                                    label="Цена в центах"
                                    value={priceCents}
                                    onChange={(e) => setPriceCents(e.target.value)}
                                    type="number"
                                    fullWidth
                                />
                                <TextField
                                    label="Валюта"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    fullWidth
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isPublished}
                                            onChange={(e) => setIsPublished(e.target.checked)}
                                        />
                                    }
                                    label="Публикую"
                                />
                                {error && (
                                    <Typography color="error" variant="body2">
                                        {error}
                                    </Typography>
                                )}

                            </Stack>
                            <Button
                                variant="contained"
                                type='submit'
                                disabled={isSubmitting}
                                sx={{
                                    alignSelf: "flex-start",
                                    mt: 1,
                                    textTransform: "none",
                                    fontWeight: 600,
                                    borderRadius: 999,
                                    px: 4,
                                    py: 1.1,
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
                                {isSubmitting ? "Создание..." : "Создать"}
                            </Button>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}
