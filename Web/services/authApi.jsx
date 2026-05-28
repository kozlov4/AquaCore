function getErrorMessage(data, fallbackMessage) {
  if (Array.isArray(data?.detail) && data.detail.length > 0) {
    return data.detail[0]?.msg || fallbackMessage;
  }

  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.message === "string") return data.message;

  return fallbackMessage;
}

function parseJwtPayload(token) {
  try {
    const payload = token.split(".")[1];

    if (!payload) return null;

    const decodedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(decodedPayload)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
}

function saveUserFromToken(accessToken) {
  if (typeof window === "undefined" || !accessToken) return;

  const payload = parseJwtPayload(accessToken);

  if (!payload) return;

  const email = payload.email || payload.sub || "";
  const name = payload.name || payload.username || payload.nickname || "";

  if (email) {
    localStorage.setItem("user_email", email);
  }

  if (name) {
    localStorage.setItem("user_name", name);
  }

  if (payload.nickname) {
    localStorage.setItem("user_nickname", payload.nickname);
  }
}

export function saveAuthTokens(data) {
  if (typeof window === "undefined") return;

  const accessToken =
    data?.access_token ||
    data?.accessToken ||
    data?.token ||
    data?.access ||
    data?.accessTokenValue;

  const refreshToken =
    data?.refresh_token ||
    data?.refreshToken ||
    data?.refresh ||
    data?.refreshTokenValue;

  const tokenType = data?.token_type || data?.tokenType || "bearer";

  if (accessToken) {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("token", accessToken);

    saveUserFromToken(accessToken);
  }

  if (refreshToken) {
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  if (tokenType) {
    localStorage.setItem("token_type", tokenType);
  }

  if (data?.email) {
    localStorage.setItem("user_email", data.email);
  }

  if (data?.name) {
    localStorage.setItem("user_name", data.name);
  }

  if (data?.nickname) {
    localStorage.setItem("user_nickname", data.nickname);
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

  if (typeof window !== "undefined") {
    localStorage.setItem("user_name", name || "");
    localStorage.setItem("user_email", email || "");
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

  if (typeof window !== "undefined") {
    localStorage.setItem("user_email", email || "");

    if (data?.name) {
      localStorage.setItem("user_name", data.name);
    }

    if (data?.nickname) {
      localStorage.setItem("user_nickname", data.nickname);
    }
  }

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
  if (typeof window === "undefined") return;

  localStorage.removeItem("access_token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("token_type");

  localStorage.removeItem("user_name");
  localStorage.removeItem("user_email");
  localStorage.removeItem("user_nickname");
}