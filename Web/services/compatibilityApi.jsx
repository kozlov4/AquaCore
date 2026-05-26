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

function normalizeSpecies(item) {
  return {
    id: item.id || item.species_id,
    name: item.name || "Без назви",
    scientificName: item.scientific_name || "",
    imageUrl: item.image_url || "",
    category: item.category || "",
    minVolume: item.min_volume || null,
    temperature: item.temperature || "",
    ph: item.ph || "",
    careLevel: item.care_level || "",
    raw: item,
  };
}

function normalizeConflict(item) {
  return {
    type: item.type || "",
    title: item.title || "Конфлікт",
    description: item.description || "",
  };
}

function normalizeRequirements(requirements) {
  if (!requirements) {
    return {
      minVolume: null,
      temperature: "",
      ph: "",
    };
  }

  return {
    minVolume: requirements.min_volume ?? requirements.minVolume ?? null,
    temperature: requirements.temperature || "",
    ph: requirements.ph || "",
  };
}

function normalizeCompatibilityResponse(data) {
  return {
    status: data?.status || "unknown",
    statusTitle: data?.status_title || "Результат аналізу",
    statusDescription: data?.status_description || "",
    conflicts: Array.isArray(data?.conflicts)
      ? data.conflicts.map(normalizeConflict)
      : [],
    requirements: normalizeRequirements(data?.requirements),
    raw: data,
  };
}

export async function getSpeciesForCompatibility(search = "") {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.append("search", search.trim());
  }

  const queryString = params.toString();

  const response = await fetch(
    `/api/species${queryString ? `?${queryString}` : ""}`,
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
    throw new Error(getErrorMessage(data, "Не вдалося завантажити види"));
  }

  return Array.isArray(data) ? data.map(normalizeSpecies) : [];
}

export async function analyzeCompatibility(items) {
  const cleanItems = items
    .map((item) => ({
      species_id: Number(item.speciesId || item.species_id || item.id),
      quantity: Number(item.quantity || 1),
    }))
    .filter((item) => item.species_id && item.quantity > 0);

  if (cleanItems.length === 0) {
    throw new Error("Додайте хоча б один вид до збірки");
  }

  const response = await fetch("/api/compatibility/analyze", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      items: cleanItems,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося виконати аналіз сумісності"));
  }

  return normalizeCompatibilityResponse(data);
}