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
    Pagination,
    Stack,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem
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
    const navigate = useNavigate();

    const [artworks, setArtworks] = useState<ArtworkListItem[]>([]);
    // для отображения индикатора загрузки, пока данные не получены.
    const [loading, setLoading] = useState(true);
    // для показа сообщения об ошибке, если запрос не удался.
    const [error, setError] = useState<string | null>(null);

    // состояние для пагинации 
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 8; // ко-во картин которые показываем

    // поиск по названию
    const [search, setSearch] = useState("");

    // debounce для поиска, чтобы запрос не уходил на сервер при каждом символе.
    // search — что вводит пользователь
    // debouncedSearch — значение через небольшую задержку, например 300–400 мс запрос делать по debouncedSearch, а не по search
    // Пользователь быстро печатает в поле search, но реальный запрос к серверу будет отправляться только с тем значением, которое попадёт в debouncedSearch после паузы ввода.
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // page надо сбрасывать, когда меняется реальный фильтр, по которому идет запрос:
    // * debouncedSearch
    // * status
    const [status, setStatus] = useState<"all" | "published" | "draft">("all");

    // сброс страницы при новом поиске и фильтре
    // Если пользователь был, например, на 3 странице, а потом поиск дал 1 страницу результатов, UI может вести себя криво.
    // При каждом изменении debouncedSearch  номер текущей страницы сбрасывается на 1.
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, status])

    // При каждом изменении search запускается таймер на 400 мс.
    // Как только пользователь останавливается на 400 мс, вызывается setDebouncedSearch(search.trim()), 
    // и обновлённое значение попадает в состояние debouncedSearch.
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);


    // загрузка список картин при открытии страницы.
    useEffect(() => {
        async function loadArtworks() {
            try {
                setLoading(true);
                setError(null);
                // Без задержки каждый символ, введённый в поисковую строку, вызывал бы отдельный запрос к серверу. 
                // Это создаёт лишнюю нагрузку и может ухудшить производительность. Debounce позволяет подождать, 
                // пока пользователь закончит ввод, и только потом сделать один запрос с окончательным текстом.
                const res = await api.get(`/api/admin/artworks`, {
                    params:
                    {
                        search: debouncedSearch,
                        status
                    }
                }); // поисковой запрос
                setArtworks(res.data)
            } catch {
                setError("Ошибка загрузки картин");
            } finally {
                setLoading(false);
            }
        }
        loadArtworks();
    }, [debouncedSearch, status]);

    // редирект на компонент AdminArtworkEditPage.tsx 
    const handleEdit = (id: string) => {
        navigate(`/admin/artworks/${id}`);
    };

    // Пагинация 
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

    // фильтрация на клиенте 
    // const normalizedSearch = search.trim().toLowerCase();
    // const filtered = normalizedSearch
    //     ? artwork.filter((a) => a.title.toLowerCase().includes(normalizedSearch))
    //     : artwork;

    // Пагинация по filtered
    // const pageCount = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    // const startIndex = (page - 1) * ITEMS_PER_PAGE;
    // const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const pageCount = Math.max(1, Math.ceil(artworks.length / ITEMS_PER_PAGE));
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginated = artworks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

                <Box sx={{ mb: 3, maxWidth: 520, display: "flex", gap: 2 }}>
                    <TextField
                        label="Поиск по названию"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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

                    <FormControl sx={{ minWidth: 220 }}>
                        <InputLabel id="status-label">Статус</InputLabel>
                        <Select
                            labelId="status-label"
                            value={status}
                            label="Статус"
                            onChange={(e) =>
                                setStatus(e.target.value as "all" | "published" | "draft")
                            }
                        >
                            <MenuItem value="all">Все</MenuItem>
                            <MenuItem value="published">Опубликованные</MenuItem>
                            <MenuItem value="draft">Черновики</MenuItem>
                        </Select>
                    </FormControl>


                </Box>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(4, 1fr)",
                        },
                        gap: 3,
                        alignItems: "stretch",
                    }}
                >
                    {paginated.map((art) => (
                        <Card
                            key={art.id}
                            elevation={0}
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                borderRadius: 3,
                                border: "1px solid rgba(140, 185, 220, 0.45)",
                                bgcolor: "rgba(244, 250, 255, 0.96)",
                                boxShadow: "0 18px 40px rgba(35, 85, 130, 0.16)",
                                overflow: "hidden",
                            }}
                        >
                            <CardActionArea
                                sx={{ alignItems: "stretch" }}
                            // onClick={() => handleEdit(art.id)}
                            >
                                {art?.image ? (
                                    <CardMedia
                                        component="img"
                                        image={art?.image.url}
                                        alt={art.title}
                                        sx={{
                                            height: 200,
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    <Box
                                        sx={{
                                            height: 200,
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
                                                color: "rgba(79, 54, 38, 0.8)",
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
                                                    bgcolor: "rgba(255, 248, 241, 0.9)",
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
                                                    borderColor: art.isPublished
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
                                    mt: "auto",
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        textTransform: "none",
                                        borderRadius: 999,
                                        borderColor: "rgba(143, 97, 70, 0.7)",
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
                            </Stack>
                        </Card>
                    ))}

                    {/* если поиск не даль результатов */}
                    {paginated.length === 0 ? (
                        <Typography variant="body1">Картины не найдены</Typography>
                    ) : (
                        <Box>...</Box>
                    )}
                </Box>

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
                        color="standard"
                        shape="rounded"
                        sx={{
                            "& .MuiPaginationItem-root": {
                                fontFamily:
                                    '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                color: "#4f3626",
                            },
                            "& .MuiPaginationItem-root.Mui-selected": {
                                bgcolor: "rgba(184, 107, 62, 0.16)",
                                color: "#2f1b12",
                                border: "1px solid rgba(143, 97, 70, 0.45)",
                            },
                            "& .MuiPaginationItem-root.Mui-selected:hover": {
                                bgcolor: "rgba(184, 107, 62, 0.22)",
                            },
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
}
