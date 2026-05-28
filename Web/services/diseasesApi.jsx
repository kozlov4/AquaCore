import { apiJson } from "./apiClient";

function getDangerType(dangerLevel) {
  const value = String(dangerLevel || "").toLowerCase();

  if (
    value.includes("high") ||
    value.includes("вис") ||
    value.includes("небез") ||
    value.includes("крит")
  ) {
    return "high";
  }

  if (
    value.includes("low") ||
    value.includes("низ") ||
    value.includes("лег")
  ) {
    return "low";
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

export function mapDiseaseCardFromApi(item = {}) {
  return {
    id: item.id,
    title: item.name || "Без назви",
    name: item.name || "Без назви",
    tags: Array.isArray(item.tags) ? item.tags : [],
    symptoms: Array.isArray(item.tags) ? item.tags : [],
    danger: getDangerType(item.danger_level),
    dangerLabel: getDangerLabel(item.danger_level),
    avatarUrl: item.avatar_url || null,
    avatar_url: item.avatar_url || null,
  };
}

export function mapDiseaseDetailsFromApi(item = {}) {
  const diagnostics = Array.isArray(item.diagnostic_steps)
    ? item.diagnostic_steps
        .map((step) => step?.text)
        .filter(Boolean)
    : [];

  const treatment = Array.isArray(item.treatment_steps)
    ? item.treatment_steps
        .map((step) => {
          const text = step?.text || "";
          const subtext = step?.subtext || "";

          return `${text}${subtext ? ` ${subtext}` : ""}`.trim();
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
    avatar_url: item.avatar_url || null,
  };
}

export async function getDiseaseTags() {
  const data = await apiJson(
    "/api/diseases/tags",
    {
      method: "GET",
    },
    "Не вдалося завантажити теги хвороб"
  );

  return Array.isArray(data) ? data : [];
}

export async function getDiseases({
  targetType = "",
  searchText = "",
  categoryTags = [],
} = {}) {
  const params = new URLSearchParams();

  if (targetType && targetType !== "all") {
    params.append("target_type", targetType);
  }

  if (searchText && searchText.trim()) {
    params.append("search_text", searchText.trim());
  }

  if (Array.isArray(categoryTags) && categoryTags.length > 0) {
    categoryTags
      .filter(Boolean)
      .filter((tag) => tag !== "Всі" && tag !== "all")
      .forEach((tag) => {
        params.append("category_tags", tag);
      });
  }

  const query = params.toString();
  const data = await apiJson(
    `/api/diseases${query ? `?${query}` : ""}`,
    {
      method: "GET",
    },
    "Не вдалося завантажити хвороби"
  );

  return Array.isArray(data) ? data.map(mapDiseaseCardFromApi) : [];
}

export async function getDiseaseById(id) {
  if (!id) {
    throw new Error("Не передано id хвороби");
  }

  const data = await apiJson(
    `/api/diseases/${id}`,
    {
      method: "GET",
    },
    "Не вдалося завантажити деталі хвороби"
  );

  return mapDiseaseDetailsFromApi(data);
}