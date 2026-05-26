import { apiJson } from "./apiClient";

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

  return apiJson(
    `/api/feedbacks?${params.toString()}`,
    {
      method: "GET",
      auth: false,
    },
    "Не вдалося завантажити відгуки"
  );
}

export async function createOrUpdateFeedback({ rate, description }) {
  const preparedRate = Number(rate);
  const preparedDescription = String(description || "").trim();

  if (!Number.isInteger(preparedRate) || preparedRate < 1 || preparedRate > 5) {
    throw new Error("Оцініть сервіс від 1 до 5 зірок");
  }

  if (preparedDescription.length < 30) {
    throw new Error("Відгук має містити мінімум 30 символів");
  }

  if (preparedDescription.length > 500) {
    throw new Error("Відгук не може перевищувати 500 символів");
  }

  return apiJson(
    "/api/feedbacks",
    {
      method: "POST",
      body: JSON.stringify({
        rate: preparedRate,
        description: preparedDescription,
      }),
    },
    "Не вдалося зберегти відгук"
  );
}