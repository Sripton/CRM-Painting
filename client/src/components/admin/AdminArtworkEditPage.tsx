import React, { useEffect, useState } from 'react'
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
import { AxiosError } from "axios"; // ts не понимает error.responce
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api';

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


// тип Image
type ImageItem = {
    id: string;
    url: string;
    key: string;
    artworkId: string;
    createdAt: string;
};


// тип artwork
type Artwork = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    year: number | null;
    widthCm: number | null;
    heightCm: number | null;
    materials: string | null;
    priceCents: number | null;
    currency: string | null;
    artworkGroup: ArtworkGroup | null;
    category: ArtworkCategory;
    isPublished: boolean;
    image: ImageItem | null;
};

export default function AdminArtworkEditPage() {
    const navigate = useNavigate(); // навигация 
    const { id } = useParams(); // забираем id из useParams
    const [artwork, setArtwork] = useState<Artwork | null>(null)

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

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // состояние для удаления image 
    const [deleting, setDeleting] = useState(false);


    // Вспомонательная функция преобразования string значений в number
    function toNullableNumber(value: string) {
        // если значение пустое возвращаем undefined
        if (value.trim() === "") return undefined
        return Number(value);  // преобразуем string в typeof number
    }

    // получение одной картины с сервера
    async function loadArtwork() {
        try {
            setLoading(true);
            setError("");
            // маршрут для получения картины
            const res = await api.get(`/api/admin/artworks/${id}`);
            const data: Artwork = res.data
            setArtwork(data); // принимаем картину с сервера 
            setTitle(data.title ?? "");
            setSlug(data.slug ?? "");
            setDescription(data.description ?? "");
            setYear(data.year?.toString() ?? "");
            setWidthCm(data.widthCm?.toString() ?? "");
            setHeightCm(data.heightCm?.toString() ?? "");
            setMaterials(data.materials ?? "");
            setPriceCents(data.priceCents?.toString() ?? "");
            setCurrency(data.currency ?? "EUR");
            setCategory(data.category);
            setIsPublished(data.isPublished)
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            setError(err.response?.data?.message || "Ошибка загрузки картины");
        } finally {
            setLoading(false);
        }
    }

    // вызываем фуцнкцию для получения одной картины с помошью useEffect 
    useEffect(() => {
        if (!id) return;
        loadArtwork()
    }, [id]);

    async function handleSave(e: React.FormEvent) {
        // убираем стандарное поведение 
        e.preventDefault();
        setSaving(true);  // Блокировка повторных отправок
        setError("");
        setSuccess("");
        try {
            const payload = {
                title: title.trim(),
                slug: slug.trim(),
                description: description.trim(),
                year: toNullableNumber(year),
                widthCm: toNullableNumber(widthCm),
                heightCm: toNullableNumber(heightCm),
                materials: materials.trim(),
                priceCents: toNullableNumber(priceCents),
                currency: currency.trim(),
                artworkGroup, // к какой группе относится картина
                category, // к какой категрии относится картина
                isPublished // в patch не нужно менять 
            }
            const res = await api.patch(`/api/admin/artworks/${id}`, payload);
            setArtwork(res.data)
            setSuccess("Изменения сохранены");
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            setError(err.response?.data?.message || "Ошибка сохранения");
        } finally {
            setSaving(false);
        }

    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]; // извлекаем первый выбранный файл
        // Если файл не выбран или отсутствует id картины (из параметров маршрута), функция завершается досрочно.
        if (!file || !id) return

        // Создаём объект FormData, который позволяет отправлять файлы через HTTP-запросы
        const formData = new FormData();
        formData.append("file", file);

        try {
            // Управление состоянием загрузки
            setUploading(true); // индикатор загрузки (кнопка меняет текст на «Загрузка…» и блокируется повторный клик
            // Сбрасываются предыдущие сообщения об ошибке и успехе.
            setError("");
            setSuccess("");

            // Отправка запроса на сервер
            await api.post(`/api/admin/artworks/${id}/images`, formData, {
                headers: {
                    //явно указываем multipart/form-data, что необходимо для передачи файла (браузер установит правильную границу автоматически, но явное указание помогает избежать ошибок) 
                    "Content-type": "multipart/form-data",
                }
            });
            // Обновление данных после успешной загрузки
            await loadArtwork();
            setSuccess("Изображение загружено");
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            setError(err.response?.data?.message || "Ошибка загрузки изображения");
        } finally {
            setUploading(false);
        }
    }

    // функция для удаления 
    async function handleDeleteArtwork() {
        if (!id) return;

        try {
            setDeleting(true);
            setError("");
            setSuccess("");

            // маршрут удаления картины
            await api.delete(`/api/admin/artworks/${id}`);
            navigate("/admin");
        } catch (error) {
            const err = error as AxiosError<{ message?: string }>;
            setError(err.response?.data?.message || "Ошибка удаления картины");
        } finally {
            setDeleting(false);
        }
    }
    return (
        <Box sx={{
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
        }}>
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
                        variant="h5"
                        sx={{
                            mb: 2,
                            fontWeight: 700,
                            color: "#2f1b12",
                        }}
                    >
                        Редактировать картину
                    </Typography>
                    <Box component="form" onSubmit={handleSave}>
                        <Stack spacing={2.5}>
                            <TextField
                                label="Название"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                fullWidth
                                required
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
                                fullWidth
                                required
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
                            </Stack>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isPublished}
                                        onChange={(e) => setIsPublished(e.target.checked)}
                                    />
                                }
                                label="Опубликовано"
                            />
                            <Stack direction="row" spacing={2}>
                                <Button type="submit" variant="contained"
                                    disabled={saving} // блокируем кнопку, пока saving = true, то есть во время выполнения запроса на сервер
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
                                    }}>
                                    {saving ? "Сохранение..." : "Сохранить"}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outlined"
                                    onClick={() => navigate("/admin")}
                                >
                                    Назад
                                </Button>

                                <Button
                                    type='button'
                                    color='error'
                                    variant="outlined"
                                    disabled={deleting}
                                    onClick={handleDeleteArtwork}
                                >
                                    {deleting ? "Удаление..." : "Удалить картину"}
                                </Button>
                            </Stack>

                        </Stack>
                    </Box>


                    {/* Загрузка картины */}
                    <Box sx={{ mt: 5 }}>
                        {/* Загрузка файла */}

                        <Button variant="outlined"
                            component="label"
                            disabled={uploading} // блокировака кнопки
                        >
                            {uploading ? "Текущее изображение" : "Загрузить изображение"}
                            <input hidden type='file' accept="image/*" onChange={handleUpload} />
                        </Button>

                        <Stack spacing={2} sx={{ mt: 3 }}>
                            {!artwork?.image && (
                                <Typography variant="body2">Изображений пока нет</Typography>
                            )}
                            {artwork?.image && (
                                <Box sx={{ mt: 3 }}>

                                    <img
                                        src={artwork.image.url}
                                        alt={artwork.title}
                                        style={{
                                            width: "100%",
                                            maxWidth: 320,
                                            borderRadius: 12,
                                            display: "block",
                                        }}
                                    />
                                </Box>
                            )}
                        </Stack>
                    </Box>

                </CardContent>
            </Card>
        </Box >
    )
}
