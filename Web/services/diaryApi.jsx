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

const TAGS_TO_API = {
  plants: "plants_fertilizers",
  diseases: "diseases_health_issues",
  behavior: "behavior_spawning",
  equipment: "equipment",

  "Рослини": "plants_fertilizers",
  "Хвороба": "diseases_health_issues",
  "Хвороби": "diseases_health_issues",
  "Поведінка": "behavior_spawning",
  "Обладнання": "equipment",

  plants_fertilizers: "plants_fertilizers",
  diseases_health_issues: "diseases_health_issues",
  behavior_spawning: "behavior_spawning",
  equipment: "equipment",
};

const TAGS_FROM_API = {
  plants_fertilizers: {
    key: "plants",
    label: "Рослини",
    badge: "🌿 Рослини",
    color: "green",
  },
  diseases_health_issues: {
    key: "diseases",
    label: "Хвороба",
    badge: "🩺 Хвороба",
    color: "red",
  },
  behavior_spawning: {
    key: "behavior",
    label: "Поведінка",
    badge: "🐟 Поведінка",
    color: "yellow",
  },
  equipment: {
    key: "equipment",
    label: "Обладнання",
    badge: "⚙️ Обладнання",
    color: "gray",
  },
};

function toApiTag(value) {
  return TAGS_TO_API[value] || "plants_fertilizers";
}

function fromApiTag(value) {
  return (
    TAGS_FROM_API[value] || {
      key: "plants",
      label: "Рослини",
      badge: "🌿 Рослини",
      color: "green",
    }
  );
}

function toDateInput(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value).slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
}

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function normalizeDiaryEntry(item) {
  const tagInfo = fromApiTag(item.tag);

  return {
    id: item.id || item.entry_id,
    createdAt: item.created_at || item.date || "",
    dateInput: toDateInput(item.created_at || item.date),
    date: formatDate(item.created_at || item.date),
    title: item.title || "Без назви",
    observation: item.observation || item.text || item.description || "",
    text: item.observation || item.text || item.description || "",
    aquariumId: item.aquarium_id || item.aquariumId || item.aquarium?.id || "",
    aquariumName:
      item.aquarium_name ||
      item.aquariumName ||
      item.aquarium?.name ||
      "Екосистема",
    tag: item.tag || "plants_fertilizers",
    tagKey: tagInfo.key,
    tagLabel: tagInfo.label,
    tagBadge: tagInfo.badge,
    tagColor: tagInfo.color,
    imageUrl: item.cover_image_url || item.image_url || item.imageUrl || "",
    imageId: item.image_id || item.imageId || null,
    isPinned: Boolean(item.is_pinned || item.pinned),
    raw: item,
  };
}

function normalizeAquarium(item) {
  return {
    id: item.id || item.aquarium_id || item.aquariumId,
    name: item.name || item.title || "Акваріум",
  };
}

function buildDiaryPayload(payload) {
  const date = payload.created_at || payload.date || payload.createdAt;

  return {
    created_at: date?.includes("T") ? date : `${date}T00:00:00`,
    title: String(payload.title || "").trim(),
    observation: String(payload.observation || payload.text || "").trim(),
    aquarium_id: Number(payload.aquarium_id || payload.aquariumId),
    tag: toApiTag(payload.tag || payload.tagKey),
    image_id: payload.image_id || payload.imageId || null,
    is_pinned: Boolean(payload.is_pinned || payload.isPinned),
  };
}

export async function getAquariumNamesForDiary() {
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

  return Array.isArray(data)
    ? data.map(normalizeAquarium).filter((item) => item.id)
    : [];
}

export async function getDiaryEntries({ aquariumId = "all", tag = "all", search = "" } = {}) {
  const params = new URLSearchParams();

  if (aquariumId && aquariumId !== "all") {
    params.append("aquarium_id", String(aquariumId));
  }

  if (tag && tag !== "all") {
    params.append("tag", toApiTag(tag));
  }

  if (search.trim()) {
    params.append("search", search.trim());
  }

  const queryString = params.toString();

  const response = await fetch(`/api/diary${queryString ? `?${queryString}` : ""}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося завантажити записи"));
  }

  return Array.isArray(data) ? data.map(normalizeDiaryEntry) : [];
}

export async function createDiaryEntry(payload) {
  const cleanPayload = buildDiaryPayload(payload);

  const response = await fetch("/api/diary", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(cleanPayload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося створити запис"));
  }

  return normalizeDiaryEntry(data);
}

export async function getDiaryEntry(entryId) {
  if (!entryId) {
    throw new Error("Diary entry id is required");
  }

  const response = await fetch(`/api/diary/${encodeURIComponent(entryId)}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося отримати запис"));
  }

  return normalizeDiaryEntry({
    id: entryId,
    ...data,
  });
}

export async function updateDiaryEntry(entryId, payload) {
  if (!entryId) {
    throw new Error("Diary entry id is required");
  }

  const cleanPayload = buildDiaryPayload(payload);

  const response = await fetch(`/api/diary/${encodeURIComponent(entryId)}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(cleanPayload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося оновити запис"));
  }

  return normalizeDiaryEntry({
    id: entryId,
    ...data,
  });
}

export async function deleteDiaryEntry(entryId) {
  if (!entryId) {
    throw new Error("Diary entry id is required");
  }

  const response = await fetch(`/api/diary/${encodeURIComponent(entryId)}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(getErrorMessage(data, "Не вдалося видалити запис"));
  }

  return true;
}