import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
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

// api.interceptors.response.use(
//   // принимает два колбэка:
//   (response) => response, // успешный ответ - просто возвращает ответ без изменений.
//   // ошибка — асинхронная функция, обрабатывающая ошибки ответа.
//   async (error) => {
//     // объект конфигурации, который использовался для неудачного запроса. Он содержит метод, url, заголовки, данные и т.д.
//     const originalRequest = error.config; // error.config — это тот самый axios запрос, который упал.

//     // Проверка условия для обновления токена
//     if (
//       error.response?.status === 401 && // проверяем, что ошибка именно из-за отсутствия авторизации.
//       // originalRequest._retry - повторяли запрос.
//       !originalRequest._retry // проверка не пытались ли обновить токен для этого запроса чтобы избежать бесконечного цикла.
//     ) {
//       originalRequest._retry = true; // чтобы при повторной ошибке не пытаться снова.

//       try {
//         // Отправка запроса на обновление токена
//         const res = await api.post(
//           `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
//           {},
//           { withCredentials: true },
//         );

//         // Сохранение нового токена
//         const newToken = res.data.accessToken; // Извлекаем новый accessToken из ответа
//         setAccessToken(newToken);

//         // Обновление заголовка авторизации в исходном запросе
//         originalRequest.headers.Authorization = `Bearer ${newToken}`;

//         // Повтор исходного запроса
//         return api(originalRequest);
//       } catch {
//         return Promise.reject(error);
//       }
//     }
//     return Promise.reject(error);
//   },
// );

// false — сейчас refresh не идет
// true — уже есть один запрос на /refresh
let isRefreshing = false;

// массив запросов, которые:
// уже получили 401
// но не должны сами делать refresh
// должны подождать, пока первый refresh закончится
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

// Эта функция “разбирает очередь”.
// Если refresh успешен: всем ожидающим запросам отдаем новый токен
// Если refresh упал: всем ожидающим запросам отдаем ошибку
function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
}

// Интерцептор ответов для обработки ошибки 401 (неавторизован)
api.interceptors.response.use(
  (response) => response, // Успешный ответ просто пропускаем
  async (error: AxiosError) => {
    // Получаем исходную конфигурацию запроса
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // Если конфигурации нет (редкий случай) — пробрасываем ошибку дальше
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Если статус не 401 — не наша ошибка, отклоняем
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Если запрос уже повторялся (_retry = true) — отклоняем, чтобы избежать цикла
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Помечаем, что этот запрос будет повторён после обновления токена
    originalRequest._retry = true;

    // Если в данный момент уже выполняется обновление токена
    if (isRefreshing) {
      // Возвращаем новый промис, который будет добавлен в очередь
      return new Promise((resolve, reject) => {
        // Сохраняем обработчики в очередь
        failedQueue.push({
          resolve: (token: string) => {
            // При получении нового токена устанавливаем его в заголовок
            originalRequest.headers.Authorization = `Bearer ${token}`;
            // Повторяем исходный запрос и резолвим промис его результатом
            resolve(api(originalRequest));
          },
          reject, // Если обновление токена не удастся — просто отклоняем
        });
      });
    }

    // Начинаем процесс обновления токена
    isRefreshing = true;

    try {
      // Отправляем запрос на обновление токена (с куками)
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
        {},
        { withCredentials: true },
      );

      const newToken = res.data.accessToken as string;

      // Сохраняем новый токен в глобальном состоянии (например, в сторе)
      setAccessToken(newToken);
      // Обрабатываем очередь ожидающих запросов — передаём им новый токен
      processQueue(null, newToken);

      // Устанавливаем новый токен в заголовок исходного запроса
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      // Повторяем исходный запрос и возвращаем его результат
      return api(originalRequest);
    } catch (refreshError) {
      // В случае ошибки обновления токена отклоняем все ожидающие запросы
      processQueue(refreshError, null);
      // Сбрасываем токен в состоянии
      setAccessToken(null);
      // Отклоняем исходный запрос с ошибкой обновления
      return Promise.reject(refreshError);
    } finally {
      // В любом случае снимаем флаг обновления
      isRefreshing = false;
    }
  },
);
