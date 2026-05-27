function getErrorMessage(data, fallbackMessage) {
  if (Array.isArray(data?.detail) && data.detail.length > 0) {
    return data.detail[0]?.msg || fallbackMessage;
  }

  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.message === "string") return data.message;

  return fallbackMessage;
}

function saveAuthTokens(data) {
  const accessToken =
    data?.access_token ||
    data?.accessToken ||
    data?.token ||
    data?.access;

  const refreshToken =
    data?.refresh_token ||
    data?.refreshToken ||
    data?.refresh;

  const tokenType = data?.token_type || data?.tokenType || "bearer";

  if (accessToken) {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("token", accessToken);
  }

  if (refreshToken) {
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  if (tokenType) {
    localStorage.setItem("token_type", tokenType);
  }
}

export async function registerUser({ name, email, password }) {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Помилка реєстрації"));
  }

  return data;
}

export async function loginUser({ email, password }) {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Невірний email або пароль"));
  }

  saveAuthTokens(data);

  return data;
}

export function startGoogleLogin() {
  if (typeof window === "undefined") return;

  window.location.href = "/api/google/login";
}

export async function googleCallbackLogin(code) {
  if (!code) {
    throw new Error("Google code відсутній");
  }

  const params = new URLSearchParams({
    code: String(code),
  });

  const response = await fetch(`/api/google/callback?${params.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Не вдалося завершити Google авторизацію")
    );
  }

  saveAuthTokens(data);

  return data;
}

export function logoutUser() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("token_type");
}