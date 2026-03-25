import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AdminRoute from "../routes/AdminRoute";

// Компоненты Admin
import Login from "../features/admin/auth/Login";
import AdminLayout from "../features/admin/layout/AdminLayout";
import AdminArtworksPage from "../features/admin/artworks/AdminArtworksPage";
import AdminArtworkCreatePage from "../features/admin/artworks/AdminArtworkCreatePage";
import AdminArtworkEditPage from "../features/admin/artworks/AdminArtworkEditPage";

// Компоненты Public
import PublicLayout from "../features/public/layout/PublicLayout";
import PublicArtworksPage from "../features/public/artworks/PublicArtworksPage";

export default function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* public */}
          <Route element={<PublicLayout />} >
            <Route path="/" element={<PublicArtworksPage />} />
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
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}
