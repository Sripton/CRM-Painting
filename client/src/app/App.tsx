import { Routes, Route, BrowserRouter } from "react-router-dom";
import AdminRoute from "../routes/AdminRoute";

// Компоненты Admin
import Login from "../features/admin/auth/Login";
import AdminLayout from "../features/admin/layout/AdminLayout";
import AdminArtworksPage from "../features/admin/artworks/AdminArtworksPage";
import AdminArtworkCreatePage from "../features/admin/artworks/AdminArtworkCreatePage";
import AdminArtworkEditPage from "../features/admin/artworks/AdminArtworkEditPage";
import AdminPublicationPage from "../features/admin/publication/AdminPublicationPage";
import AdminPublicationCreatePage from "../features/admin/publication/AdminPublicationCreatePage";
import AdminPublicationEditPage from "../features/admin/publication/AdminPublicationEditPage";
import AdminPublicationDetailsPage from "../features/admin/publication/AdminPublicationDetailsPage";
// Компоненты Public
import PublicLayout from "../features/public/layout/PublicLayout";
import PublicArtworksPage from "../features/public/artworks/PublicArtworksPage";
import PublicArtworkDetailsPage from "../features/public/artworks/PublicArtworkDetailsPage";
import ArtworksCatalogPage from "../features/public/artworks/ArtworksCatalogPage";
import AuthorBiography from "../features/public/artworks/AuthorBiography";
import PublicPublicationNewsAphorismEssayPage from "../features/public/publications/PublicPublicationNewsAphorismEssayPage";
import PublicPublicationArticleReviewPage from "../features/public/publications/PublicPublicationArticleReviewPage";
import PublicContacts from "../features/public/publications/PublicContacts";
import PublicationDetailsPage from "../features/public/publications/PublicationDetailsPage/PublicationDetailsPage";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* public */}
          <Route element={<PublicLayout />} >
            <Route path="/" element={<PublicArtworksPage />} />
            <Route path="/artworks" element={<ArtworksCatalogPage />} />
            <Route path="/artworks/:slug" element={<PublicArtworkDetailsPage />} />
            <Route path="/artworks/bio" element={<AuthorBiography />} />
            <Route path="/publications-news-aphorizm-essay" element={<PublicPublicationNewsAphorismEssayPage />} />
            <Route path="/publications-article-review" element={<PublicPublicationArticleReviewPage />} />
            <Route path="/publications/:id" element={<PublicationDetailsPage />} />
            <Route path="/contacts" element={<PublicContacts />} />
          </Route>
          {/* admin login */}
          <Route path="/admin/login" element={<Login />} />

          {/* защищённая админка */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>

          }>
            {/* по умолчанию */}
            <Route index element={<AdminArtworksPage />} />
            <Route path="artworks/create" element={<AdminArtworkCreatePage />} />
            <Route path="artworks/:id" element={<AdminArtworkEditPage />} />
            <Route path="publications" element={<AdminPublicationPage />} />
            <Route path="publications/:id" element={<AdminPublicationDetailsPage />} />
            <Route path="publications/create" element={<AdminPublicationCreatePage />} />
            <Route path="publications/edit/:id" element={<AdminPublicationEditPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}
