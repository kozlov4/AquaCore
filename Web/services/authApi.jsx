import {
  saveTokens,
  clearTokens,
  refreshAccessToken,
  getAccessToken,
  getRefreshToken,
} from "./apiClient";

function getErrorMessage(data, fallbackMessage) {
  if (Array.isArray(data?.detail) && data.detail.length > 0) {
    return data.detail[0]?.msg || fallbackMessage;
  }

  if (typeof data?.detail === "string") {
    return data.detail;
  }

  if (typeof data?.message === "string") {
    return data.message;
  }

  return fallbackMessage;
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

  saveTokens(data);

  return data;
}

export async function refreshUserToken() {
  return refreshAccessToken();
}

export function logoutUser() {
  clearTokens();

  if (typeof window !== "undefined") {
    window.location.href = "/signIn";
  }
}

export function isAuthenticated() {
  return Boolean(getAccessToken() && getRefreshToken());
}