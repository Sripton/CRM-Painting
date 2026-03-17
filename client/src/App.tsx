import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AdminRoute from "./routes/AdminRoute";

// Компоненты
import Home from "./components/Home";
import Login from "./components/Login";
import AdminLayout from "./components/AdminLayout";
import AdminArtworksPage from "./components/admin/AdminArtworksPage";
import AdminArtworkCreatePage from "./components/admin/AdminArtworkCreatePage";
import AdminArtworkEditPage from "./components/admin/AdminArtworkEditPage";

export default function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Home />} />
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
