let refreshPromise = null;

function isBrowser() {
  return typeof window !== "undefined";
}

export function getAccessToken() {
  if (!isBrowser()) return null;

  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token")
  );
}

export function getRefreshToken() {
  if (!isBrowser()) return null;

  return (
    localStorage.getItem("refresh_token") ||
    localStorage.getItem("refreshToken")
  );
}

export function saveTokens(data) {
  if (!isBrowser() || !data) return;

  if (data.access_token) {
    localStorage.setItem("access_token", data.access_token);
  }

  if (data.refresh_token) {
    localStorage.setItem("refresh_token", data.refresh_token);
  }

  if (data.token_type) {
    localStorage.setItem("token_type", data.token_type);
  }
}

export function clearTokens() {
  if (!isBrowser()) return;

  localStorage.removeItem("access_token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("token");

  localStorage.removeItem("refresh_token");
  localStorage.removeItem("refreshToken");

  localStorage.removeItem("token_type");
}

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

function parseJwtPayload(token) {
  try {
    const base64Url = token.split(".")[1];

    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function isAccessTokenExpired(token) {
  const payload = parseJwtPayload(token);

  if (!payload?.exp) {
    return false;
  }

  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  const safetyOffsetInSeconds = 30;

  return payload.exp <= currentTimeInSeconds + safetyOffsetInSeconds;
}

async function requestNewAccessToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    clearTokens();

    throw new Error("Refresh token is missing");
  }

  const response = await fetch("/api/refresh", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    clearTokens();

    throw new Error(getErrorMessage(data, "Не вдалося оновити сесію"));
  }

  saveTokens(data);

  return data.access_token;
}

export async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = requestNewAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

function buildHeaders(init = {}, token) {
  const headers = new Headers(init.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  return headers;
}

export async function apiFetch(url, init = {}) {
  const requiresAuth = init.auth !== false;

  let token = getAccessToken();

  if (requiresAuth && token && isAccessTokenExpired(token)) {
    token = await refreshAccessToken();
  }

  const firstResponse = await fetch(url, {
    ...init,
    headers: buildHeaders(init, requiresAuth ? token : null),
  });

  if (
    requiresAuth &&
    (firstResponse.status === 401 || firstResponse.status === 403)
  ) {
    const newToken = await refreshAccessToken();

    return fetch(url, {
      ...init,
      headers: buildHeaders(init, newToken),
    });
  }

  return firstResponse;
}

export async function apiJson(url, init = {}, fallbackMessage = "Помилка запиту") {
  const response = await apiFetch(url, init);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, fallbackMessage));
  }

  return data;
}