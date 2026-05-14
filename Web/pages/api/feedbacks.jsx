export async function createOrUpdateFeedback({ rate, description }) {
  const token = localStorage.getItem("access_token");

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
      description: String(description),
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.detail?.[0]?.msg ||
        data?.detail ||
        data?.message ||
        "Не вдалося зберегти відгук"
    );
  }

  return data;
}