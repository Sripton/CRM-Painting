import { useAuth } from '../components/Context/Auth/AuthContext'
import type { JSX } from "react"
import { Navigate } from 'react-router-dom';
// Компонент-защитник (Protected Route) для админ-панели в приложении 
// Проверяем, авторизован ли пользователь и имеет ли он роль "ADMIN". 
// Если проверка не пройдена – происходит редирект на страницу входа для администратора
export default function AdminRoute({ children }: { children: JSX.Element }) {
    const { user } = useAuth();

    // если user пришел без данных 
    if (!user || user.role !== "ADMIN") {
        // отправляем логиниться 
        return <Navigate to="/admin/login" replace />
    }
    return children
}
