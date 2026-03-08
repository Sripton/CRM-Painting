import React, { useState, FormEvent } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    TextField,
    Typography,
    Stack,
} from "@mui/material";
import { api } from "../../lib/api"

import { useAuth } from "../Context/Auth/AuthContext"
import { useNavigate } from "react-router-dom";


export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);


    // забираем из context setAuth
    const { setAuth } = useAuth();

    async function handleSubmit(e: React.FormEvent) {
        // отключение стандартных функций
        e.preventDefault();
        setError("");
        setIsSubmitting(true)

        try {
            const res = await api.post("/api/auth/login", {
                email, password
            })

            //сохраняем в context
            setAuth(res.data.accessToken, res.data.user);

            // redirect
            navigate('/admin')

        } catch (error: any) {
            setError(error?.response?.data?.message || "Ошибка входа");
            setIsSubmitting(false)
        }
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                bgcolor: "#f2f9ff",
                backgroundImage:
                    "linear-gradient(140deg, rgba(236, 249, 255, 0.98) 0%, rgba(214, 235, 251, 0.92) 45%, rgba(185, 219, 244, 0.95) 100%)",
                p: 2,
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
                elevation={0}
                sx={{
                    width: "100%",
                    maxWidth: 440,
                    position: "relative",
                    zIndex: 1,
                    borderRadius: 4,
                    border: "1px solid rgba(140, 185, 220, 0.45)",
                    bgcolor: "rgba(244, 250, 255, 0.92)",
                    boxShadow:
                        "0 25px 60px rgba(35, 85, 130, 0.16), 0 10px 24px rgba(35, 85, 130, 0.1)",
                }}
            >
                <CardContent
                    sx={{
                        p: 4,
                    }}
                >
                    <Stack spacing={3.5}>
                        <Box>
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
                                variant="h4"
                                component="h1"
                                gutterBottom
                                sx={{
                                    fontWeight: 700,
                                    color: "#2f1b12",
                                    fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
                                }}
                            >
                                Вход в систему
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "rgba(79, 54, 38, 0.8)",
                                    fontFamily: '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                }}
                            >
                                Введите свои учетные данные для доступа к сайту.
                            </Typography>
                        </Box>

                        <Divider
                            sx={{
                                borderColor: "rgba(143, 97, 70, 0.35)",
                            }}
                        />

                        <Box
                            component="form"
                            noValidate
                            onSubmit={handleSubmit}
                        >
                            <Stack spacing={2.5}>
                                {/* ввод email */}
                                <TextField
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    variant="outlined"
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
                                {/* ввод пароля */}
                                <TextField
                                    label="Пароль"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    variant="outlined"
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

                                {/* ошибка при логировании */}
                                {error && (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "#b3261e",
                                            fontWeight: 500,
                                            textAlign: "center",
                                        }}
                                    >
                                        {error}
                                    </Typography>
                                )}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    sx={{
                                        mt: 1,
                                        textTransform: "none",
                                        fontWeight: 600,
                                        borderRadius: 999,
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
                                    {isSubmitting ? "Вход..." : "Войти"}
                                </Button>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        textAlign: "center",
                                        color: "rgba(86, 54, 33, 0.7)",
                                        fontFamily:
                                            '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                    }}
                                >
                                    Доступ только для сотрудника.
                                </Typography>
                            </Stack>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};


