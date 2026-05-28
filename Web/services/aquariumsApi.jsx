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

function extractImageId(data) {
  return (
    data?.id ||
    data?.image_id ||
    data?.imageId ||
    data?.image?.id ||
    data?.data?.id ||
    data?.data?.image_id ||
    null
  );
}

function getAquariumImageUrl(item = {}) {
  return (
    item.image_url ||
    item.cover_image_url ||
    item.avatar_url ||
    item.image?.url ||
    item.image?.image_url ||
    null
  );
}

function getSavedAquariumCreatedAt(aquariumId) {
  if (typeof window === "undefined" || !aquariumId) return "";

  try {
    const saved = localStorage.getItem("aquarium_created_dates");

    if (!saved) return "";

    const parsed = JSON.parse(saved);

    return parsed?.[String(aquariumId)] || "";
  } catch {
    return "";
  }
}

function saveAquariumCreatedAt(aquariumId, createdAt) {
  if (typeof window === "undefined" || !aquariumId || !createdAt) return;

  try {
    const saved = localStorage.getItem("aquarium_created_dates");
    const parsed = saved ? JSON.parse(saved) : {};

    parsed[String(aquariumId)] = createdAt;

    localStorage.setItem("aquarium_created_dates", JSON.stringify(parsed));
  } catch {
    // Якщо localStorage недоступний, не блокуємо роботу застосунку
  }
}

function getAquariumCreatedAt(item = {}) {
  return (
    item.created_at ||
    item.createdAt ||
    item.launch_date ||
    item.launchDate ||
    item.started_at ||
    item.startedAt ||
    item.start_date ||
    item.startDate ||
    item.setup_date ||
    item.setupDate ||
    item.date ||
    getSavedAquariumCreatedAt(item.id) ||
    ""
  );
}

export function formatAquariumDate(value) {
  if (!value) return "";

  try {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return new Intl.DateTimeFormat("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return String(value);
  }
}

export function toInputDate(value) {
  if (!value) return new Date().toISOString().slice(0, 10);

  try {
    return new Date(value).toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function formatWaterValue(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return String(value);
}

function getLastTestDateText(lastTest) {
  if (!lastTest || typeof lastTest !== "object") {
    return "Тестів ще немає";
  }

  if (lastTest.days_ago === 0) {
    return "сьогодні";
  }

  if (lastTest.days_ago === 1) {
    return "1 день тому";
  }

  if (typeof lastTest.days_ago === "number") {
    return `${lastTest.days_ago} днів тому`;
  }

  const testDate =
    lastTest.test_date ||
    lastTest.created_at ||
    lastTest.date ||
    lastTest.createdAt ||
    null;

  if (!testDate) {
    return "є дані тесту";
  }

  return formatAquariumDate(testDate);
}

function getLastTestParamsText(lastTest) {
  if (!lastTest || typeof lastTest !== "object") {
    return "pH — · GH — · KH —";
  }

  return [
    `pH ${formatWaterValue(lastTest.ph)}`,
    `GH ${formatWaterValue(lastTest.gh)}`,
    `KH ${formatWaterValue(lastTest.kh)}`,
    `NH3 ${formatWaterValue(lastTest.nh3)}`,
    `NO2 ${formatWaterValue(lastTest.no2)}`,
    `NO3 ${formatWaterValue(lastTest.no3)}`,
  ].join(" · ");
}

export function mapAquariumFromApi(item = {}) {
  const volumeValue = item.volume ?? item.liters ?? 0;
  const imageUrl = getAquariumImageUrl(item);
  const rawPopulation = item.population;

  let populationText = "Жителів ще немає";

  if (rawPopulation && typeof rawPopulation === "object") {
    const totalQuantity =
      rawPopulation.total_quantity ??
      rawPopulation.total_count ??
      rawPopulation.count ??
      0;

    const speciesNames = Array.isArray(rawPopulation.species_names)
      ? rawPopulation.species_names
      : [];

    if (totalQuantity > 0 && speciesNames.length > 0) {
      populationText = `${totalQuantity} особин: ${speciesNames.join(", ")}`;
    } else if (totalQuantity > 0) {
      populationText = `${totalQuantity} особин`;
    }
  } else if (typeof rawPopulation === "string") {
    populationText = rawPopulation;
  } else if (typeof rawPopulation === "number") {
    populationText = `${rawPopulation} особин`;
  }

  const lastTest = item.last_test || item.lastTest || null;
  const createdAt = getAquariumCreatedAt(item);

  if (createdAt && item.id) {
    saveAquariumCreatedAt(item.id, createdAt);
  }

  return {
    id: item.id,
    name: item.name || "Без назви",

    volume: `${volumeValue} л`,
    volumeValue,

    environment: item.type || item.environment || "Прісноводний",
    type: item.type || item.environment || "Прісноводний",
    status: item.status || "Активний",

    image: imageUrl || "/images/fish-card.jpg",
    imageUrl,
    image_url: imageUrl,
    cover_image_url: item.cover_image_url || null,

    createdAt,
    created_at: createdAt,
    createdDate: formatAquariumDate(createdAt),

    population: populationText,
    populationData: rawPopulation || null,

    lastTest,
    last_test: lastTest,

    lastTestText: getLastTestDateText(lastTest),
    params: getLastTestParamsText(lastTest),

    raw: item,
  };
}

export async function uploadAquariumImage(file) {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload-image", {
    method: "POST",
    headers: {
      ...authHeaders(),
    },
    body: formData,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося завантажити фото"));
  }

  const imageId = extractImageId(data);

  if (!imageId) {
    console.log("Upload image response:", data);

    throw new Error("Backend не повернув image_id після завантаження фото");
  }

  return imageId;
}

export async function getMyAquariums() {
  const response = await fetch("/api/aquariums", {
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

  return Array.isArray(data) ? data.map(mapAquariumFromApi) : [];
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
    throw new Error(
      getErrorMessage(data, "Не вдалося завантажити назви акваріумів")
    );
  }

  return Array.isArray(data) ? data : [];
}

export async function createAquarium({
  name,
  volume,
  type,
  createdAt,
  file = null,
}) {
  const imageId = file ? await uploadAquariumImage(file) : null;
  const finalCreatedAt = createdAt || new Date().toISOString();

  const response = await fetch("/api/aquariums", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      name,
      volume: Number(volume),
      type,
      created_at: finalCreatedAt,
      image_id: imageId,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося створити акваріум"));
  }

  if (data?.id) {
    saveAquariumCreatedAt(data.id, finalCreatedAt);
  }

  return data;
}

export async function updateAquarium({
  id,
  name,
  volume,
  type,
  createdAt,
  file = null,
  keepImage = true,
}) {
  let imageId;
  const finalCreatedAt = createdAt || new Date().toISOString();

  if (file) {
    imageId = await uploadAquariumImage(file);
  } else if (!keepImage) {
    imageId = null;
  }

  const payload = {
    name,
    volume: Number(volume),
    type,
    created_at: finalCreatedAt,
  };

  if (file || !keepImage) {
    payload.image_id = imageId;
  }

  const response = await fetch(`/api/aquariums/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося оновити акваріум"));
  }

  saveAquariumCreatedAt(id, finalCreatedAt);

  return data;
}

export async function deleteAquarium(id) {
  const response = await fetch(`/api/aquariums/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  if (response.status === 204) {
    return true;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося видалити акваріум"));
  }

  return data;
}

function getSpeciesIcon(species) {
  const value = `
    ${species?.icon || ""}
    ${species?.name || ""}
    ${species?.title || ""}
    ${species?.category || ""}
    ${species?.type || ""}
    ${species?.target_type || ""}
    ${species?.species_type || ""}
    ${species?.scientific_name || ""}
    ${species?.latin || ""}
    ${species?.latin_name || ""}
  `.toLowerCase();

  if (
    value.includes("кревет") ||
    value.includes("shrimp") ||
    value.includes("caridina") ||
    value.includes("neocaridina") ||
    value.includes("amano")
  ) {
    return "🦐";
  }

  if (
    value.includes("рослин") ||
    value.includes("plant") ||
    value.includes("anubias") ||
    value.includes("cryptocoryne") ||
    value.includes("vallisneria") ||
    value.includes("java moss") ||
    value.includes("moss") ||
    value.includes("ехінодорус") ||
    value.includes("анубіас") ||
    value.includes("анубиас")
  ) {
    return "🌿";
  }

  if (
    value.includes("равлик") ||
    value.includes("улит") ||
    value.includes("snail") ||
    value.includes("neritina") ||
    value.includes("ampullaria") ||
    value.includes("planorb")
  ) {
    return "🐌";
  }

  if (value.includes("краб") || value.includes("crab")) {
    return "🦀";
  }

  if (value.includes("жаба") || value.includes("frog")) {
    return "🐸";
  }

  return "🐠";
}

function isAggressiveSpecies(species) {
  const value = `
    ${species?.character || ""}
    ${species?.name || ""}
    ${species?.title || ""}
    ${species?.scientific_name || ""}
    ${species?.latin || ""}
    ${species?.latin_name || ""}
  `.toLowerCase();

  return (
    value.includes("агрес") ||
    value.includes("aggressive") ||
    value.includes("territorial") ||
    value.includes("територ") ||
    value.includes("хиж") ||
    value.includes("predator") ||
    value.includes("астронотус") ||
    value.includes("оскар") ||
    value.includes("astronotus")
  );
}

function buildFrontendCompatibilityOverride(
  inhabitants,
  backendStatus,
  backendText
) {
  const aggressiveResidents = inhabitants.filter((item) =>
    isAggressiveSpecies(item.raw?.species)
  );

  if (aggressiveResidents.length === 0) {
    return {
      compatibilityStatus: backendStatus || "unknown",
      compatibilityText:
        backendText || "Інформація про сумісність поки відсутня.",
      aggressiveResidents: [],
    };
  }

  const aggressiveNames = aggressiveResidents
    .map((item) => item.name)
    .filter(Boolean)
    .join(", ");

  return {
    compatibilityStatus: "danger",
    compatibilityText: `Акваріум у небезпеці: серед населення є агресивний або територіальний вид (${aggressiveNames}). Такі риби можуть конфліктувати з мирними видами, креветками або дрібними мешканцями.`,
    aggressiveResidents,
  };
}

export function mapPopulationFromApi(data) {
  const inhabitants = Array.isArray(data?.inhabitants)
    ? data.inhabitants.map((item) => {
        const species = item.species || {};

        return {
          id: item.id,
          speciesId: species.id || item.species_id,

          name: species.name || species.title || "Без назви",

          latin:
            species.scientific_name ||
            species.latin ||
            species.latin_name ||
            "",

          category:
            species.category ||
            species.type ||
            species.target_type ||
            species.species_type ||
            "",

          character: species.character || "",

          count: `${item.quantity || 0} шт`,
          quantity: item.quantity || 0,

          settlementDate: item.settlement_date || "",

          icon: getSpeciesIcon(species),

          raw: item,
        };
      })
    : [];

  const frontendCompatibility = buildFrontendCompatibilityOverride(
    inhabitants,
    data?.overall_compatibility_status,
    data?.overall_compatibility_text
  );

  return {
    totalSpecies: data?.total_species ?? inhabitants.length,

    totalIndividuals:
      data?.total_individuals ??
      inhabitants.reduce((sum, item) => sum + Number(item.quantity || 0), 0),

    compatibilityStatus: frontendCompatibility.compatibilityStatus,
    compatibilityText: frontendCompatibility.compatibilityText,
    aggressiveResidents: frontendCompatibility.aggressiveResidents,

    inhabitants,
    raw: data,
  };
}

export async function getAquariumPopulation(aquariumId) {
  if (!aquariumId) {
    throw new Error("Aquarium id is required");
  }

  const response = await fetch(`/api/aquariums/${aquariumId}/population`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося завантажити населення"));
  }

  return mapPopulationFromApi(data);
}

export async function checkAquariumCompatibility(aquariumId, speciesId) {
  if (!aquariumId) {
    throw new Error("Aquarium id is required");
  }

  if (!speciesId) {
    throw new Error("Species id is required");
  }

  const url = `/api/aquariums/check-compatibility?aquarium_id=${encodeURIComponent(
    aquariumId
  )}&species_id=${encodeURIComponent(speciesId)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  const text = await response.text();

  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {
      message: text || "Empty response from frontend proxy",
    };
  }

  console.log("CHECK COMPATIBILITY FRONTEND:", {
    url,
    status: response.status,
    data,
  });

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося перевірити сумісність"));
  }

  return data;
}

export async function addInhabitantToAquarium({
  aquariumId,
  speciesId,
  quantity,
  settlementDate,
}) {
  if (!aquariumId) {
    throw new Error("Aquarium id is required");
  }

  const payload = {
    species_id: Number(speciesId),
    quantity: Number(quantity),
    settlement_date: settlementDate,
  };

  const response = await fetch(`/api/aquariums/${aquariumId}/inhabitants`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  console.log("Add inhabitant response:", {
    status: response.status,
    data,
    sentPayload: payload,
  });

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося заселити рибу"));
  }

  return data;
}

export async function getAquariumById(aquariumId) {
  if (!aquariumId) {
    throw new Error("Aquarium id is required");
  }

  const response = await fetch(`/api/aquariums/${aquariumId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося завантажити акваріум"));
  }

  console.log("Aquarium details data:", data);

  const imageUrl = getAquariumImageUrl(data);
  const createdAt = getAquariumCreatedAt(data);

  if (createdAt) {
    saveAquariumCreatedAt(data.id || aquariumId, createdAt);
  }

  return {
    id: data.id || aquariumId,
    name: data.name || "Без назви",

    volume: data.volume ?? data.liters ?? 0,
    volumeValue: data.volume ?? data.liters ?? 0,

    type: data.type || data.environment || "Прісноводний",
    environment: data.type || data.environment || "Прісноводний",

    status: data.status || "Активний",

    created_at: createdAt,
    createdAt,
    createdDate: formatAquariumDate(createdAt),

    image: imageUrl || "/images/fish-card.jpg",
    image_url: imageUrl,
    cover_image_url: data.cover_image_url || null,

    raw: data,
  };
}