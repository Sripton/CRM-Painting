import axios from 'axios';
import React, { useState, createContext, useContext, useEffect, useMemo } from 'react'
import { setAccessToken as saveAccessToken } from "../../../lib/tokenStorage"
import { api } from '../../../lib/api';

// Тип User
// Определяем структуру объекта пользователя
type User = {
  id: string; // id 
  email: string; // email
  role: string; // role ADMIN 
}

// Тип AuthContextType
// Описывает форму значения, которое будет предоставлять контекст
type AuthContextType = {
  accessToken: string | null; // токен доступа
  user: User | null; // данные пользователя
  isLoading: boolean;
  setAuth: (token: string, user: User) => void; // функция для установки токена и пользователя (вызывается при успешном входе/регистрации)
  logout: () => void; // сбрасывает состояние
}

// Создание контекста
const AuthContext = createContext<AuthContextType | null>(null);

// Компонент AuthProvider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null); // хранит текущий токен
  const [user, setUser] = useState<User | null>(null); // хранит данные пользователя
  const [isLoading, setIsLoading] = useState(true); // чтобы приложение знало: мы ещё проверяем авторизацию/или уже проверили

  // обновляем оба состояния одновременно при успешной аутентификации
  function setAuth(token: string, user: User) {
    setAccessToken(token);
    saveAccessToken(token);
    setUser(user)
  }

  // функция выхода 
  function logout() {
    setAccessToken(null);
    saveAccessToken(null);
    setUser(null);
  }

  // при старте приложения делаем попытку восстановить сессию через cookie
  // refresh_token - лежит в httpOnly cookie, JavaScript не читает его напрямую, браузер сам отправляет cookie на сервер
  useEffect(() => {
    let isMounted = true;
    async function refreshAuth() {
      try {
        // Запрос на сервер 
        const res = await api.post('/api/auth/refresh');

        // если admin размонтировал к этому времени
        if (!isMounted) {
          return
        }
        // обновляем token
        setAccessToken(res.data.accessToken);
        //  пришел новый token
        saveAccessToken(res.data.accessToken);
        // обновляем данные admin
        setUser(res.data.user);
      } catch {
        // если admin размонтировал к этому времени
        if (!isMounted) {
          return
        }
        setAccessToken(null);
        setUser(null);
      }
      finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    refreshAuth();
    return () => { isMounted = false }
  }, []);

  // оптимизации производительности. гарантирует, что новый объект будет создаваться только при изменении зависимостей — accessToken, user или isLoading
  // Без useMemo при каждом рендере AuthProvider создавался бы новый объект, даже если данные не поменялись, что приводило бы к ненужным ререндерам всех компонентов, использующих useAuth()
  const value = useMemo(() => ({
    accessToken,
    user,
    isLoading,
    setAuth,
    logout
  }), [accessToken, user, isLoading]);


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// кастомный хук
export function useAuth() {
  const context = useContext(AuthContext);
  // проверкa на null
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}









