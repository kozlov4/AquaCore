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

function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

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
    maxSize: "5",
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
    maxSize: "35",
    temperature: "23–28 °C",
    ph: "6.5–7.5",
    diet: "Хижий",
    difficulty: "Середній",
    lifespan: "10–15 років",
    description:
      "Астронотус — велика інтелектуальна цихліда, якій потрібен просторий акваріум.",
    tags: ["від 250 л", "Хижак", "Цихліда"],
  },
  {
    id: 3,
    name: "Анубіас нана",
    latin: "Anubias barteri var. nana",
    category: "Рослини",
    water: "Прісна",
    character: "Мирні",
    icon: "🌿",
    minVolume: 10,
    size: "5–15 см",
    maxSize: "15",
    temperature: "20–28 °C",
    ph: "6.0–7.5",
    diet: "Фотосинтез",
    difficulty: "Легкий",
    lifespan: "Багаторічна",
    description:
      "Анубіас нана — невибаглива акваріумна рослина, добре підходить для початківців.",
    tags: ["Слабке світло", "Без CO2", "Невибаглива"],
  },
  {
    id: 4,
    name: "Креветка Амано",
    latin: "Caridina multidentata",
    category: "Безхребетні",
    water: "Прісна",
    character: "Мирні",
    icon: "🦐",
    minVolume: 20,
    size: "4–5 см",
    maxSize: "5",
    temperature: "22–26 °C",
    ph: "6.5–7.5",
    diet: "Водорості",
    difficulty: "Легкий",
    lifespan: "2–3 роки",
    description:
      "Креветка Амано допомагає боротися з водоростями та підходить для мирних акваріумів.",
    tags: ["від 20 л", "Мирна", "Водоростейд"],
  },
];

function getIconByCategory(category) {
  const value = String(category || "").toLowerCase();

  if (value.includes("рослин")) {
    return "🌿";
  }

  if (value.includes("крев") || value.includes("безхреб")) {
    return "🦐";
  }

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

function getMaxSize(item) {
  return item.max_size || item.maxSize || item.size_cm || item.size || "";
}

function getAquariumId(item) {
  return item?.id || item?.aquarium_id || item?.aquariumId;
}

function getAquariumName(item) {
  return item?.name || item?.title || "Акваріум";
}

function getAquariumVolume(item) {
  return (
    item?.volume ||
    item?.liters ||
    item?.capacity_liters ||
    item?.capacity ||
    null
  );
}

export function mapSpeciesFromApi(item) {
  const category = item.category || item.type || "Риби";
  const minVolume = getMinVolume(item);
  const character = getCharacter(item);
  const difficulty = getDifficulty(item);
  const diet = getDiet(item);
  const maxSize = getMaxSize(item);

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
    maxSize,
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

function sizeToBackendValue(size) {
  if (size === "S") return "S";
  if (size === "M") return "M";
  if (size === "L") return "L";
  if (size === "XL") return "XL";

  return null;
}

export async function getSpeciesList(filters = {}) {
  const params = new URLSearchParams();

  if (filters.search) {
    params.append("search", filters.search);
  }

  if (filters.category && filters.category !== "all") {
    params.append("category", filters.category);
  }

  if (filters.waterType && filters.waterType !== "all") {
    params.append("water_type", filters.waterType);
  }

  if (filters.character && filters.character !== "all") {
    params.append("character", filters.character);
  }

  if (filters.minVolume && Number(filters.minVolume) < 500) {
    params.append("maxVolume", String(filters.minVolume));
  }

  const backendSize = sizeToBackendValue(filters.maxSize);

  if (backendSize && backendSize !== "XL") {
    params.append("maxSizes", backendSize);
  }

  if (filters.difficulty && filters.difficulty !== "all") {
    params.append("careLevels", filters.difficulty);
  }

  if (Array.isArray(filters.foodTypes) && filters.foodTypes.length > 0) {
    filters.foodTypes.forEach((foodType) => {
      params.append("diets", foodType);
    });
  }

  const response = await fetch(
    `/api/species${params.toString() ? `?${params.toString()}` : ""}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...authHeaders(),
      },
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok || !Array.isArray(data)) {
    return fallbackSpecies;
  }

  return data.map(mapSpeciesFromApi);
}

export function mapSpeciesDetailFromApi(item) {
  const category = item.category || item.type || "Риби";

  return {
    id: item.id,
    name: item.name || "Без назви",
    latin: item.scientific_name || item.latin || item.latin_name || "",
    category,
    water: item.water_type || item.water || "—",
    character: item.character || "—",
    icon:
      item.icon ||
      item.emoji ||
      (String(category).toLowerCase().includes("рослин")
        ? "🌿"
        : String(category).toLowerCase().includes("безхреб")
          ? "🦐"
          : "🐟"),
    imageUrl: item.image_url || null,
    minVolume: item.min_volume || 0,
    size: item.max_size || "—",
    maxSize: item.max_size || "—",
    temperature: item.temperature || "—",
    ph: item.ph || "—",
    diet: item.diet || "—",
    difficulty: item.care_level || "—",
    lifespan: item.lifespan || "—",
    description: item.description || "Опис для цього виду поки відсутній.",
    lighting: item.lighting || null,
    co2: item.co2 || null,
    tags: [
      item.water_type,
      category,
      item.care_level,
      item.character,
      item.min_volume ? `від ${item.min_volume} л` : null,
    ].filter(Boolean),
  };
}

export async function getSpeciesById(id) {
  if (!id) {
    throw new Error("Не передано id виду");
  }

  const response = await fetch(`/api/species/${encodeURIComponent(id)}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const fallbackItem =
      fallbackSpecies.find((item) => String(item.id) === String(id)) ||
      fallbackSpecies[0];

    return fallbackItem;
  }

  return mapSpeciesDetailFromApi(data);
}

export async function getAquariumNames() {
  const response = await fetch("/api/aquariums/names", {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося завантажити акваріуми"));
  }

  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((item) => ({
      id: getAquariumId(item),
      name: getAquariumName(item),
      volume: getAquariumVolume(item),
      ...item,
    }))
    .filter((item) => item.id);
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
          : [
              "Система виявила критичну несумісність.",
              "Додавання виду може бути небезпечним для поточних жителів.",
            ],
      raw: data,
    };
  }

  if (
    rawStatus.includes("aggression") ||
    rawStatus.includes("warning") ||
    rawStatus.includes("risk") ||
    rawStatus.includes("агрес") ||
    rawStatus.includes("ризик")
  ) {
    return {
      type: "aggression",
      title: "Можлива агресія",
      icon: "⚠️",
      needsConfirm: true,
      points:
        warnings.length > 0
          ? warnings
          : [
              "Вид може проявляти територіальність.",
              "Рекомендується уважно стежити за поведінкою після заселення.",
            ],
      raw: data,
    };
  }

  if (
    rawStatus.includes("partial") ||
    rawStatus.includes("част") ||
    rawStatus.includes("recommend")
  ) {
    return {
      type: "partial",
      title: "Часткова сумісність",
      icon: "ℹ️",
      needsConfirm: true,
      points:
        warnings.length > 0
          ? warnings
          : [
              "Є певні рекомендації для цього виду.",
              "Перед заселенням перевірте умови утримання.",
            ],
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
        : [
            "Ідеальний вибір. Цей вид має схожі вимоги до параметрів води.",
            "Конфлікти виключені або малоймовірні.",
          ],
    raw: data,
  };
}

export async function checkSpeciesCompatibility({ aquariumId, speciesId }) {
  const cleanAquariumId =
    aquariumId?.id ||
    aquariumId?.aquarium_id ||
    aquariumId?.aquariumId ||
    aquariumId;

  const cleanSpeciesId =
    speciesId?.id ||
    speciesId?.species_id ||
    speciesId?.speciesId ||
    speciesId;

  if (!cleanAquariumId) {
    throw new Error("Не передано id акваріума");
  }

  if (!cleanSpeciesId) {
    throw new Error("Не передано id виду");
  }

  const params = new URLSearchParams({
    aquarium_id: String(cleanAquariumId),
    species_id: String(cleanSpeciesId),
  });

  const response = await fetch(
    `/api/aquariums/check-compatibility?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...authHeaders(),
      },
    }
  );

  const data = await response.json().catch(() => null);

  console.log("CHECK SPECIES COMPATIBILITY FRONTEND:", {
    aquariumId: cleanAquariumId,
    speciesId: cleanSpeciesId,
    status: response.status,
    data,
  });

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Не вдалося перевірити сумісність")
    );
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