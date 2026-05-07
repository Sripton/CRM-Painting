import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import type { PublicArtwork } from "../../../../artworksTypes/model";
import { api } from "../../../../lib/api"
import { Box, Container, Typography } from '@mui/material';
export default function ArtworksCatalogPage() {
    const navigate = useNavigate();
    const location = useLocation();
    // читаем  параметры  внутри страницы с помошью  searchParams
    const [searchParams] = useSearchParams();

    const [artworks, setArtworks] = useState<PublicArtwork[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const group = searchParams.get("group"); // для фильтрации по группам 
    const category = searchParams.get("category"); // для фильтрации по категориям


    useEffect(() => {
        async function loadArtworks() {
            try {
                setLoading(true);
                setError("");

                // дергаем маршрут get
                const res = await api.get('/api/public/artworks');

                // забираем данные 
                setArtworks(res.data);
            } catch {
                setError("Не удалось загрузить картины");

            } finally {
                setLoading(false);
            }

        }
        loadArtworks();
    }, []);


    // фильруем картины по группе и катенории
    const filteredArtworks = useMemo(() => {
        return artworks.filter((artwork) => {
            return artwork?.artworkGroup === group &&
                artwork.category === category;
        })
    }, [artworks, group, category]);

    if (loading) return <Typography>Загрузка...</Typography>;
    if (error) return <Typography>{error}</Typography>;

    return (
        <Box sx={{ py: 4 }}>
            <Container maxWidth="lg">
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "repeat(2, 1fr)",
                        sm: "repeat(3, 1fr)",
                        md: "repeat(6, 1fr)",
                    },
                    gap: 2,
                }}>
                    {filteredArtworks.map((artwork) => (
                        <Box key={artwork.id}
                            sx={{
                                width: "100%",
                                aspectRatio: "4 / 3",
                                border: "1px solid #4a4f55",
                                backgroundImage: artwork.image?.url
                                    ? `url(${artwork.image.url})`
                                    : "none",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                navigate(`/artworks/${artwork?.slug}`, { state: { from: location } });
                                return;
                            }}
                        />
                    ))}
                </Box>
            </Container>
        </Box>
    )
}
