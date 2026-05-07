import { Box, Container, Stack, Typography } from '@mui/material'
import { NavLink } from "react-router-dom"

// иконки
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';



export default function PublicContacts() {
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
                        КОНТАКТЫ
                    </Typography>

                    <Stack
                        direction="column"
                        spacing={0}
                        alignItems="center"
                    >
                        <Box
                            sx={{
                                border: "1px solid #4a4f55",
                                borderRadius: 4,
                                bgcolor: "#fbfbfa",
                                px: { xs: 3, md: 4.5 },
                                py: { xs: 3, md: 3.5 },
                                width: "100%",
                                maxWidth: 520,
                                textAlign: "center",
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
                                ТЕЛЕФОН
                            </Typography>
                            <Stack spacing={0.8} alignItems="center">
                                <Typography
                                    sx={{
                                        fontSize: 15,
                                        color: "#1f242b",
                                        fontWeight: 600,
                                        fontFamily:
                                            '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                    }}
                                >
                                    +7 (495) 619-36-83
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: 15,
                                        color: "#1f242b",
                                        fontWeight: 600,
                                        fontFamily:
                                            '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                    }}
                                >
                                    +7 (926) 361-45-75
                                </Typography>
                            </Stack>

                            <Typography
                                sx={{
                                    fontFamily:
                                        '"Playfair Display", "Georgia", "Times New Roman", serif',
                                    fontSize: 13,
                                    fontWeight: 700,
                                    letterSpacing: 2,
                                    textTransform: "uppercase",
                                    color: "#5a6f8a",
                                    mt: 3,
                                    mb: 1.2,
                                }}
                            >
                                ПОЧТА
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: 15,
                                    color: "#1f242b",
                                    fontWeight: 600,
                                    fontFamily:
                                        '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                }}
                            >
                                gazali_d@mail.ru
                            </Typography>
                            <Typography
                                sx={{
                                    fontFamily:
                                        '"Playfair Display", "Georgia", "Times New Roman", serif',
                                    fontSize: 13,
                                    fontWeight: 700,
                                    letterSpacing: 2,
                                    textTransform: "uppercase",
                                    color: "#5a6f8a",
                                    mt: 1.5,
                                    mb: 2,
                                }}
                            >
                                СОЦИАЛЬНЫЕ СЕТИ
                            </Typography>
                            <Stack spacing={1} alignItems="center">
                                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", justifyContent: "center" }}>
                                    <Typography
                                        sx={{
                                            fontSize: 15,
                                            color: "#2f3640",
                                            fontFamily:
                                                '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                        }}
                                    >
                                        <NavLink to="https://www.facebook.com/gazali.d#">
                                            <FacebookIcon sx={{ cursor: "pointer" }} />
                                        </NavLink>

                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: 15,
                                            color: "#2f3640",
                                            fontFamily:
                                                '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
                                        }}
                                    >
                                        <NavLink to="#">
                                            <TwitterIcon />
                                        </NavLink>

                                    </Typography>
                                </Box>

                            </Stack>
                        </Box>
                    </Stack>
                </Box>
            </Container>
        </Box>
    )
}
