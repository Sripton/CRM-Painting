import axios from "axios";
import { getAccessToken, setAccessToken } from "./tokenStorage";

// Создаём отдельный экземпляр axios. в этот api мы добавляем interceptor
// api.get(...)
// api.post(...)
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// request interceptor добавляет access token, но не обновляет его, когда он истекает.
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// response interceptor
// перехватчик (interceptor) ответов axios для автоматического обновления токена доступа (accessToken) при получении ошибки 401 Unauthorized
// Если не делать в каждом месте  придётся писать одно и то же:
// сделать основной запрос
// если 401
// сделать /refresh
// сохранить новый токен
// повторить исходный запрос
// если refresh не сработал — разлогинить

api.interceptors.response.use(
  // принимает два колбэка:
  (response) => response, // успешный ответ - просто возвращает ответ без изменений.
  // ошибка — асинхронная функция, обрабатывающая ошибки ответа.
  async (error) => {
    // объект конфигурации, который использовался для неудачного запроса. Он содержит метод, url, заголовки, данные и т.д.
    const originalRequest = error.config; // error.config — это тот самый axios запрос, который упал.

    // Проверка условия для обновления токена
    if (
      error.response?.status === 401 && // проверяем, что ошибка именно из-за отсутствия авторизации.
      // originalRequest._retry - повторяли запрос.
      !originalRequest._retry // проверка не пытались ли обновить токен для этого запроса чтобы избежать бесконечного цикла.
    ) {
      originalRequest._retry = true; // чтобы при повторной ошибке не пытаться снова.

      try {
        // Отправка запроса на обновление токена
        const res = await api.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true },
        );

        // Сохранение нового токена
        const newToken = res.data.accessToken; // Извлекаем новый accessToken из ответа
        setAccessToken(newToken);

        // Обновление заголовка авторизации в исходном запросе
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Повтор исходного запроса
        return api(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);
