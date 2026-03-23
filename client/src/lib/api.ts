import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getAccessToken, setAccessToken } from "./tokenStorage";

// Создаём отдельный экземпляр axios. в  api  добавляем interceptor
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

  // После обработки очередь очищается (failedQueue = []).
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

    // Если конфигурации нет (редкий случай) — пробрасываем ошибку
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Если статус не 401 — не наша ошибка, отклоняем
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }
    // исключение для auth-маршрутов, чтобы interceptor не пытался refresh-ить refresh/login/logout запросы.
    const requestUrl = originalRequest.url || "";

    if (
      // если пользователь вышел из системы. интерцептор попытается обработать эту 401 и снова отправить запрос на обновление токена, возникнет бесконечный цикл
      // гарантируем, что при ошибке обновления токена интерцептор сразу отклонит запрос, и приложение сможет корректно обработать ситуацию (например, разлогинить пользователя)
      requestUrl.includes("/api/auth/refresh") ||
      // Если он почему-то вернёт 401 (например, из-за неверных учётных данных), не нужно пытаться обновлять токен — логин должен завершиться ошибкой
      requestUrl.includes("/api/auth/login") ||
      // выполняется с токеном, но его неудача (например, токен уже недействителен) не должна запускать цикл обновления. Пользователь уже выходит из системы, и повторять запрос на обновление токена бессмысленно.
      requestUrl.includes("/api/auth/logout")
    ) {
      return Promise.reject(error);
    }

    // Если запрос уже повторялся (_retry = true) — отклоняем, чтобы избежать цикла
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Помечаем, что этот запрос будет повторён после обновления токена
    originalRequest._retry = true;

    // Если в данный момент уже выполняется обновление токена
    // Если isRefreshing === true, то запрос не инициирует обновление, а попадает в очередь через new Promise(...). Обработчики resolve и reject сохраняются в failedQueue.
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
      // Вызывается после того, как запрос на обновление токена завершился (успешно или с ошибкой).
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
