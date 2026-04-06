import React, { useMemo, useState } from "react";
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

export default function AdminPublicationEditPage() {
    const [type, setType] = useState<PublicationType>("NEWS");
    const [title, setTitle] = useState("");
    const [titleEn, setTitleEn] = useState("");
    const [slug, setSlug] = useState("");
    const [body, setBody] = useState("");
    const [bodyEn, setBodyEn] = useState("");
    const [quoteText, setQuoteText] = useState("");
    const [quoteTextEn, setQuoteTextEn] = useState("");
    const [isPublished, setIsPublished] = useState(false);
    const [publishedAt, setPublishedAt] = useState("");

    const sharedInputLabelSx = useMemo(
        () => ({
            color: "rgba(86, 54, 33, 0.8)",
            fontFamily: '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
        }),
        [],
    );

    const sharedInputSx = useMemo(
        () => ({
            color: "#2f1b12",
            backgroundColor: "rgba(255, 248, 241, 0.7)",
            borderRadius: 2,
            fontFamily: '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(143, 97, 70, 0.5)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(143, 97, 70, 0.85)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#b26b3a",
            },
        }),
        [],
    );

    const isAphorism = type === "APHORISM";

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
            <Card
                sx={{
                    width: "100%",
                    maxWidth: 820,
                    position: "relative",
                    zIndex: 1,
                    borderRadius: 4,
                    border: "1px solid rgba(140, 185, 220, 0.45)",
                    bgcolor: "rgba(244, 250, 255, 0.92)",
                    boxShadow:
                        "0 25px 60px rgba(35, 85, 130, 0.16), 0 10px 24px rgba(35, 85, 130, 0.1)",
                }}
            >
                <CardContent sx={{ p: 3 }}>
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
                        variant="h5"
                        sx={{
                            mb: 2,
                            fontWeight: 700,
                            color: "#2f1b12",
                            fontFamily:
                                '"Playfair Display", "Georgia", "Times New Roman", serif',
                        }}
                    >
                        Редактировать публикацию
                    </Typography>

                    <Stack spacing={2.5}>
                        <FormControl fullWidth>
                            <InputLabel id="publication-type-label">
                                Тип публикации
                            </InputLabel>
                            <Select
                                labelId="publication-type-label"
                                label="Тип публикации"
                                value={type}
                                onChange={(event) =>
                                    setType(event.target.value as PublicationType)
                                }
                            >
                                {TYPE_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Название на русском"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            required={!isAphorism}
                            fullWidth
                            InputLabelProps={{ sx: sharedInputLabelSx }}
                            InputProps={{ sx: sharedInputSx }}
                        />

                        <TextField
                            label="Название на английском  (не обязательно)"
                            value={titleEn}
                            onChange={(event) => setTitleEn(event.target.value)}
                            required={false}
                            fullWidth
                            InputLabelProps={{ sx: sharedInputLabelSx }}
                            InputProps={{ sx: sharedInputSx }}
                        />

                        <TextField
                            label="Slug"
                            value={slug}
                            onChange={(event) => setSlug(event.target.value)}
                            required={!isAphorism}
                            fullWidth
                            helperText="Например: gory-na-zakate"
                            InputLabelProps={{ sx: sharedInputLabelSx }}
                            InputProps={{ sx: sharedInputSx }}
                        />

                        <TextField
                            label="Текст на русском"
                            value={body}
                            onChange={(event) => setBody(event.target.value)}
                            required={!isAphorism}
                            multiline
                            minRows={5}
                            fullWidth
                            InputLabelProps={{ sx: sharedInputLabelSx }}
                            InputProps={{ sx: sharedInputSx }}
                        />

                        <TextField
                            label="Текст на английском (не обязательно)"
                            value={bodyEn}
                            onChange={(event) => setBodyEn(event.target.value)}
                            required={false}
                            multiline
                            minRows={5}
                            fullWidth
                            InputLabelProps={{ sx: sharedInputLabelSx }}
                            InputProps={{ sx: sharedInputSx }}
                        />

                        <TextField
                            label="Цитата"
                            value={quoteText}
                            onChange={(event) => setQuoteText(event.target.value)}
                            required={isAphorism}
                            multiline
                            minRows={3}
                            fullWidth
                            InputLabelProps={{ sx: sharedInputLabelSx }}
                            InputProps={{ sx: sharedInputSx }}
                        />

                        <TextField
                            label="Цитата (EN)  (не обязательно)"
                            value={quoteTextEn}
                            onChange={(event) => setQuoteTextEn(event.target.value)}
                            required={false}
                            multiline
                            minRows={3}
                            fullWidth
                            InputLabelProps={{ sx: sharedInputLabelSx }}
                            InputProps={{ sx: sharedInputSx }}
                        />

                        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                            <TextField
                                label="Дата публикации"
                                value={publishedAt}
                                onChange={(event) => setPublishedAt(event.target.value)}
                                type="datetime-local"
                                fullWidth
                                InputLabelProps={{ shrink: true, sx: sharedInputLabelSx }}
                                InputProps={{ sx: sharedInputSx }}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isPublished}
                                        onChange={(event) =>
                                            setIsPublished(event.target.checked)
                                        }
                                    />
                                }
                                label="Опубликовать"
                            />
                        </Stack>

                        <Stack spacing={1}>
                            <Button
                                variant="outlined"
                                component="label"
                                sx={{
                                    alignSelf: "flex-start",
                                    textTransform: "none",
                                    borderRadius: 999,
                                    borderColor: "rgba(143, 97, 70, 0.7)",
                                    color: "#6b3f26",
                                    fontFamily:
                                        '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                    "&:hover": {
                                        borderColor: "rgba(143, 97, 70, 0.95)",
                                        background: "rgba(255, 248, 241, 0.7)",
                                    },
                                }}
                            >
                                Загрузить изображение
                                <input hidden type="file" accept="image/*" />
                            </Button>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "rgba(79, 54, 38, 0.7)",
                                    fontFamily:
                                        '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                }}
                            >
                                Поддерживаются JPG, PNG, WEBP
                            </Typography>
                        </Stack>

                        <Button
                            variant="contained"
                            type="button"
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
                            Сохранить
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}

type PublicationType = "NEWS" | "APHORISM" | "ESSAY" | "ARTICLE" | "REVIEW";

const TYPE_OPTIONS: Array<{ value: PublicationType; label: string }> = [
    { value: "NEWS", label: "Новости" },
    { value: "APHORISM", label: "Афоризм" },
    { value: "ESSAY", label: "Эссе" },
    { value: "ARTICLE", label: "Статья" },
    { value: "REVIEW", label: "Отзыв" },
];
