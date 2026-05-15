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

function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

function getDangerType(dangerLevel) {
  const value = String(dangerLevel || "").toLowerCase();

  if (
    value.includes("high") ||
    value.includes("вис") ||
    value.includes("небез")
  ) {
    return "high";
  }

  return "medium";
}

function getDangerLabel(dangerLevel) {
  const value = String(dangerLevel || "").trim();

  if (!value) {
    return "Помірна небезпека";
  }

  return value;
}

export function mapDiseaseCardFromApi(item) {
  return {
    id: item.id,
    title: item.name || "Без назви",
    name: item.name || "Без назви",
    tags: Array.isArray(item.tags) ? item.tags : [],
    symptoms: Array.isArray(item.tags) ? item.tags : [],
    danger: "medium",
    dangerLabel: "Помірна небезпека",
    avatarUrl: item.avatar_url || null,
  };
}

export function mapDiseaseDetailsFromApi(item) {
  const diagnostics = Array.isArray(item.diagnostic_steps)
    ? item.diagnostic_steps.map((step) => step.text).filter(Boolean)
    : [];

  const treatment = Array.isArray(item.treatment_steps)
    ? item.treatment_steps
        .map((step) => {
          if (step.subtext) {
            return `${step.text} ${step.subtext}`;
          }

          return step.text;
        })
        .filter(Boolean)
    : [];

  return {
    id: item.id,
    title: item.name || "Без назви",
    name: item.name || "Без назви",
    danger: getDangerType(item.danger_level),
    dangerLabel: getDangerLabel(item.danger_level),
    tags: Array.isArray(item.tags) ? item.tags : [],
    symptoms: Array.isArray(item.tags) ? item.tags : [],
    diagnostics,
    reason: item.causes_text || "Причини не вказані.",
    treatment,
    avatarUrl: item.avatar_url || null,
  };
}

export async function getDiseases({
  targetType = "",
  searchText = "",
  categoryTags = [],
} = {}) {
  const token = getAccessToken();

  if (!token) {
    throw new Error("Щоб переглядати хвороби, потрібно увійти в акаунт");
  }

  const params = new URLSearchParams();

  if (targetType) {
    params.append("target_type", targetType);
  }

  if (searchText.trim()) {
    params.append("search_text", searchText.trim());
  }

  if (categoryTags.length > 0) {
    params.append("category_tags", categoryTags.join(","));
  }

  const response = await fetch(
    `/api/diseases${params.toString() ? `?${params.toString()}` : ""}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося завантажити хвороби"));
  }

  return Array.isArray(data) ? data.map(mapDiseaseCardFromApi) : [];
}

export async function getDiseaseById(id) {
  const token = getAccessToken();

  if (!token) {
    throw new Error("Щоб переглянути деталі хвороби, потрібно увійти в акаунт");
  }

  const response = await fetch(`/api/diseases/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося завантажити деталі"));
  }

  return mapDiseaseDetailsFromApi(data);
}