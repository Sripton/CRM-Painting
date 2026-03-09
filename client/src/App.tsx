import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AdminRoute from "./routes/AdminRoute";

// Компоненты
import Home from "./components/Home";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminLayout";

import { useAuth } from "./components/Context/Auth/AuthContext"


export default function App() {
  const { user } = useAuth();
  console.log("user", user)

  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<Login />} />
          {/* защищённая админка */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>

          } />
        </Routes>
      </BrowserRouter>
    </>
  )
}
