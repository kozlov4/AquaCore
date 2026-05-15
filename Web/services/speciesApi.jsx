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
  return localStorage.getItem("access_token");
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
      "Неон звичайний — популярна мирна зграйна рибка для прісноводних акваріумів. Рекомендується утримувати групами від 6–10 особин.",
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
      "Астронотус — велика інтелектуальна цихліда, якій потрібен просторий акваріум, якісна фільтрація та обережний підбір сусідів.",
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
    temperature: "20–28 °C",
    ph: "6.0–7.5",
    diet: "Фотосинтез",
    difficulty: "Легкий",
    lifespan: "Багаторічна",
    description:
      "Анубіас нана — невибаглива акваріумна рослина, добре підходить для початківців і може рости при слабкому освітленні.",
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
    temperature: "22–26 °C",
    ph: "6.5–7.5",
    diet: "Водорості, корм",
    difficulty: "Легкий",
    lifespan: "2–3 роки",
    description:
      "Креветка Амано добре допомагає боротися з водоростями та підходить для мирних акваріумів із стабільними параметрами води.",
    tags: ["від 20 л", "Мирна", "Водорості"],
  },
];

export function mapSpeciesFromApi(item) {
  return {
    id: item.id,
    name: item.name || item.title || "Без назви",
    latin: item.latin || item.latin_name || item.scientific_name || "",
    category: item.category || "Риби",
    water: item.water || item.water_type || "Прісна",
    character: item.character || item.temperament || "Мирні",
    icon: item.icon || (item.category === "Рослини" ? "🌿" : "🐟"),

    minVolume: item.min_volume || item.min_volume_l || item.minVolume || 0,
    size: item.size || item.max_size || "—",
    temperature:
      item.temperature ||
      (item.temperature_min && item.temperature_max
        ? `${item.temperature_min}–${item.temperature_max} °C`
        : "—"),
    ph:
      item.ph ||
      (item.ph_min && item.ph_max ? `${item.ph_min}–${item.ph_max}` : "—"),
    diet: item.diet || item.food_type || "—",
    difficulty: item.difficulty || "—",
    lifespan: item.lifespan || item.life_span || "—",

    description: item.description || item.overview || "",
    imageUrl: item.image_url || item.cover_image_url || null,

    tags:
      item.tags ||
      [
        item.min_volume_l ? `від ${item.min_volume_l} л` : null,
        item.temperament || item.character,
        item.difficulty,
      ].filter(Boolean),
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

  const response = await fetch(
    `/api/species${params.toString() ? `?${params.toString()}` : ""}`,
    {
      method: "GET",
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return fallbackSpecies;
  }

  if (!Array.isArray(data)) {
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
    return fallbackSpecies.find((item) => String(item.id) === String(id)) || fallbackSpecies[0];
  }

  return mapSpeciesFromApi(data);
}

export async function addSpeciesToAquarium({
  speciesId,
  aquariumId,
  quantity,
  settlementDate,
  ignoreWarnings = false,
}) {
  const response = await fetch("/api/species/add-to-aquarium", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      aquarium_id: Number(aquariumId),
      species_id: Number(speciesId),
      quantity: Number(quantity),
      settlement_date: settlementDate,
      ignore_warnings: Boolean(ignoreWarnings),
    }),
  });

  const data = await response.json().catch(() => null);

  console.log("Add species to aquarium response:", {
    status: response.status,
    data,
  });

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося заселити вид в акваріум"));
  }

  return data;
}