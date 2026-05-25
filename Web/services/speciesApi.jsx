function getErrorMessage(data, fallbackMessage) {
  if (Array.isArray(data?.detail) && data.detail.length > 0) {
    return data.detail[0]?.msg || fallbackMessage;
  }

  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.message === "string") return data.message;

  return fallbackMessage;
}

function getToken() {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token")
  );
}

function authHeaders() {
  const token = getToken();

  if (!token) {
    throw new Error("Потрібно увійти в акаунт");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export const fallbackSpecies = [
  {
    id: 1,
    name: "Неон звичайний",
    latin: "Paracheirodon innesi",
    category: "Риби",
    water: "Прісна",
    character: "Мирні",
    icon: "🐟",
    minVolume: 40,
    size: "4–5 см",
    temperature: "22–26 °C",
    ph: "6.0–7.0",
    diet: "Всеїдний",
    difficulty: "Легкий",
    lifespan: "3–5 років",
    description:
      "Неон звичайний — популярна мирна зграйна рибка для прісноводних акваріумів.",
    tags: ["від 40 л", "Мирна", "Зграйна"],
  },
  {
    id: 2,
    name: "Астронотус",
    latin: "Astronotus ocellatus",
    category: "Риби",
    water: "Прісна",
    character: "Хижаки",
    icon: "🐠",
    minVolume: 250,
    size: "25–35 см",
    temperature: "23–28 °C",
    ph: "6.5–7.5",
    diet: "Хижий",
    difficulty: "Середній",
    lifespan: "10–15 років",
    description:
      "Астронотус — велика інтелектуальна цихліда, якій потрібен просторий акваріум.",
    tags: ["від 250 л", "Хижак", "Цихліда"],
  },
];

function getIconByCategory(category) {
  const value = String(category || "").toLowerCase();

  if (value.includes("рослин")) return "🌿";
  if (value.includes("крев") || value.includes("безхреб")) return "🦐";

  return "🐟";
}

function getMinVolume(item) {
  return (
    item.min_volume ||
    item.min_volume_l ||
    item.minVolume ||
    item.recommended_volume ||
    item.aquarium_min_volume ||
    0
  );
}

function getLatinName(item) {
  return (
    item.latin ||
    item.latin_name ||
    item.scientific_name ||
    item.scientificName ||
    ""
  );
}

function getWaterType(item) {
  return item.water || item.water_type || item.waterType || "Прісна";
}

function getCharacter(item) {
  return item.character || item.temperament || "Мирні";
}

function getDifficulty(item) {
  return item.difficulty || item.care_level || "Середній";
}

function getDiet(item) {
  return item.diet || item.food_type || item.feeding_type || "Всеїдний";
}

export function mapSpeciesFromApi(item) {
  const category = item.category || item.type || "Риби";
  const minVolume = getMinVolume(item);
  const character = getCharacter(item);
  const difficulty = getDifficulty(item);
  const diet = getDiet(item);

  const tags = Array.isArray(item.tags)
    ? item.tags
    : [
        minVolume ? `від ${minVolume} л` : null,
        character,
        difficulty,
      ].filter(Boolean);

  return {
    id: item.id,
    name: item.name || item.title || "Без назви",
    latin: getLatinName(item),
    category,
    water: getWaterType(item),
    character,
    icon: item.icon || item.emoji || getIconByCategory(category),
    minVolume,
    maxSize: item.max_size || item.maxSize || item.size_cm || item.size || "",
    size: item.size || item.max_size || item.maxSize || "—",
    temperature:
      item.temperature ||
      (item.temperature_min && item.temperature_max
        ? `${item.temperature_min}–${item.temperature_max} °C`
        : "—"),
    ph:
      item.ph ||
      (item.ph_min && item.ph_max ? `${item.ph_min}–${item.ph_max}` : "—"),
    diet,
    difficulty,
    lifespan: item.lifespan || item.life_span || "—",
    description: item.description || item.overview || "",
    imageUrl: item.image_url || item.cover_image_url || item.avatar_url || null,
    tags,
  };
}

export async function getSpeciesList(filters = {}) {
  const params = new URLSearchParams();

  if (filters.search) params.append("search", filters.search);
  if (filters.category && filters.category !== "all") {
    params.append("category", filters.category);
  }
  if (filters.waterType && filters.waterType !== "all") {
    params.append("water_type", filters.waterType);
  }
  if (filters.character && filters.character !== "all") {
    params.append("character", filters.character);
  }
  if (filters.maxSize && filters.maxSize !== "all") {
    params.append("max_size", filters.maxSize);
  }
  if (filters.difficulty && filters.difficulty !== "all") {
    params.append("difficulty", filters.difficulty);
  }
  if (filters.minVolume) {
    params.append("min_volume", String(filters.minVolume));
  }
  if (Array.isArray(filters.foodTypes) && filters.foodTypes.length > 0) {
    filters.foodTypes.forEach((foodType) => {
      params.append("food_type", foodType);
    });
  }
  if (filters.sortBy) {
    params.append("sort_by", filters.sortBy);
  }

  const response = await fetch(
    `/api/species${params.toString() ? `?${params.toString()}` : ""}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok || !Array.isArray(data)) {
    return fallbackSpecies;
  }

  return data.map(mapSpeciesFromApi);
}

export async function getSpeciesById(id) {
  const response = await fetch(`/api/species/${id}`, {
    method: "GET",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return (
      fallbackSpecies.find((item) => String(item.id) === String(id)) ||
      fallbackSpecies[0]
    );
  }

  return mapSpeciesFromApi(data);
}

export function normalizeCompatibility(data) {
  const rawStatus = String(
    data?.status ||
      data?.compatibility_status ||
      data?.level ||
      data?.type ||
      ""
  ).toLowerCase();

  const warnings = Array.isArray(data?.warnings)
    ? data.warnings
    : Array.isArray(data?.reasons)
      ? data.reasons
      : Array.isArray(data?.messages)
        ? data.messages
        : [];

  if (
    data?.is_compatible === false ||
    rawStatus.includes("critical") ||
    rawStatus.includes("incompatible") ||
    rawStatus.includes("несум") ||
    rawStatus.includes("крит")
  ) {
    return {
      type: "critical",
      title: "Критична несумісність",
      icon: "🚨",
      needsConfirm: true,
      points:
        warnings.length > 0
          ? warnings
          : ["Система виявила критичну несумісність для цього виду."],
      raw: data,
    };
  }

  if (
    rawStatus.includes("warning") ||
    rawStatus.includes("partial") ||
    rawStatus.includes("част") ||
    rawStatus.includes("ризик")
  ) {
    return {
      type: "warning",
      title: "Часткова сумісність",
      icon: "ℹ️",
      needsConfirm: true,
      points:
        warnings.length > 0
          ? warnings
          : ["Є рекомендації або ризики, які потрібно врахувати."],
      raw: data,
    };
  }

  return {
    type: "full",
    title: "Повна сумісність",
    icon: "✅",
    needsConfirm: false,
    points:
      warnings.length > 0
        ? warnings
        : ["Вид сумісний з поточними умовами акваріума."],
    raw: data,
  };
}

export async function checkSpeciesCompatibility({ aquariumId, speciesId }) {
  if (!aquariumId) throw new Error("Не передано id акваріума");
  if (!speciesId) throw new Error("Не передано id виду");

  const response = await fetch(
    `/api/aquariums/${encodeURIComponent(
      aquariumId
    )}/check-compability/${encodeURIComponent(speciesId)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...authHeaders(),
      },
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося перевірити сумісність"));
  }

  return normalizeCompatibility(data);
}

export async function addSpeciesToAquarium({
  speciesId,
  aquariumId,
  quantity,
  settlementDate,
  ignoreWarnings = false,
}) {
  const response = await fetch(
    `/api/aquariums/${encodeURIComponent(aquariumId)}/inhabitants`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        species_id: Number(speciesId),
        quantity: Number(quantity),
        settlement_date: settlementDate,
        ignore_warnings: Boolean(ignoreWarnings),
      }),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося заселити вид в акваріум"));
  }

  return data;
}