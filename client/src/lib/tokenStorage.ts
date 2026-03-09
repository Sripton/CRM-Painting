let accessToken: string | null = null;

// утановим token. записываем токен в tokenStorage, откуда его потом читает interceptor
export function setAccessToken(token: string | null) {
  // записываем токен в переменную модуля
  accessToken = token;
}

console.log("accessToken", accessToken);
// получение token
export function getAccessToken() {
  // возвращаем установленный token
  return accessToken;
}
