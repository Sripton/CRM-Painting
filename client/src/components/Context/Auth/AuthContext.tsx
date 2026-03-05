import React, { useState, createContext, useContext } from 'react'


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
  setAuth: (token: string, user: User) => void; // функция для установки токена и пользователя (вызывается при успешном входе/регистрации)
  logout: () => void; // сбрасывает состояние
}

// Создание контекста
const AuthContext = createContext<AuthContextType | null>(null);

// Компонент AuthProvider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null); // хранит текущий токен
  const [user, setUser] = useState<User | null>(null); // хранит данные пользователя

  // обновляем оба состояния одновременно при успешной аутентификации
  function setAuth(token: string, user: User) {
    setAccessToken(token);
    setUser(user)
  }

  function logout() {
    setAccessToken(null);
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ accessToken, user, setAuth, logout }}>
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









