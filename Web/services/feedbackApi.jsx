import { getAccessToken } from "./authStorage";

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

export async function getFeedbacks({
  limit = 6,
  offset = 0,
  minRate = 0,
  sortBy = "newest",
} = {}) {
  const params = new URLSearchParams();

  params.append("limit", String(limit));
  params.append("offset", String(offset));
  params.append("min_rate", String(minRate));
  params.append("sort_by", sortBy);

  const response = await fetch(`/api/feedbacks?${params.toString()}`, {
    method: "GET",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося завантажити відгуки"));
  }

  return data;
}

export async function createOrUpdateFeedback({ rate, description }) {
  const token = getAccessToken();

  if (!token) {
    throw new Error("Щоб залишити відгук, потрібно увійти в акаунт");
  }

  const response = await fetch("/api/feedbacks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      rate: Number(rate),
      description: String(description || "").trim(),
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося зберегти відгук"));
  }

  return data;
}