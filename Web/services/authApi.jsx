export async function googleCallbackLogin(code) {
  if (!code) {
    throw new Error("Google code відсутній");
  }

  const response = await fetch(
    `/api/google/callback?code=${encodeURIComponent(String(code))}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Не вдалося завершити Google авторизацію")
    );
  }

  saveAuthTokens(data);

  return data;
} 