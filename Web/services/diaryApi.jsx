import { uploadImage } from "./galleryApi";

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

export const diaryTags = [
  {
    label: "🌿 Рослини",
    value: "plants_fertilizers",
    color: "green",
  },
  {
    label: "🩺 Хвороба",
    value: "diseases_health_issues",
    color: "red",
  },
  {
    label: "🐟 Поведінка",
    value: "behavior_spawning",
    color: "yellow",
  },
  {
    label: "⚙️ Обладнання",
    value: "equipment",
    color: "gray",
  },
];

export function getDiaryTagMeta(tag) {
  return (
    diaryTags.find((item) => item.value === tag) || {
      label: "Запис",
      value: tag,
      color: "gray",
    }
  );
}

export function formatDiaryDate(value) {
  if (!value) return "";

  try {
    return new Intl.DateTimeFormat("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
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

export function mapDiaryEntryFromApi(item) {
  const tagMeta = getDiaryTagMeta(item.tag);

  return {
    id: item.id,
    createdAt: item.created_at,
    date: formatDiaryDate(item.created_at),
    title: item.title || "",
    text: item.observation || "",
    observation: item.observation || "",
    aquarium: item.aquarium_name || "",
    aquariumName: item.aquarium_name || "",
    tag: item.tag,
    tagLabel: tagMeta.label,
    tagColor: tagMeta.color,
    image: Boolean(item.cover_image_url),
    imageUrl: item.cover_image_url || null,
    coverImageUrl: item.cover_image_url || null,
    pinned: Boolean(item.is_pinned),
    isPinned: Boolean(item.is_pinned),
  };
}

export async function getDiaryEntries({
  aquariumId = "all",
  tag = "all",
  search = "",
} = {}) {
  const params = new URLSearchParams();

  if (aquariumId && aquariumId !== "all") {
    params.append("aquarium_id", String(aquariumId));
  }

  if (tag && tag !== "all") {
    params.append("tag", tag);
  }

  if (search.trim()) {
    params.append("search", search.trim());
  }

  const response = await fetch(
    `/api/diary${params.toString() ? `?${params.toString()}` : ""}`,
    {
      method: "GET",
      headers: authHeaders(),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося завантажити щоденник"));
  }

  return Array.isArray(data) ? data.map(mapDiaryEntryFromApi) : [];
}

export async function getDiaryEntryById(id) {
  const response = await fetch(`/api/diary/${id}`, {
    method: "GET",
    headers: authHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося відкрити запис"));
  }

  return mapDiaryEntryFromApi(data);
}

export async function createDiaryEntry({
  date,
  title,
  observation,
  aquariumId,
  tag,
  file,
  isPinned,
}) {
  let imageId = null;

  if (file) {
    const uploaded = await uploadImage(file);

    imageId =
      uploaded?.id ||
      uploaded?.image_id ||
      uploaded?.image?.id ||
      uploaded?.data?.id;

    if (!imageId) {
      throw new Error("Backend не повернув image_id після завантаження фото");
    }
  }

  const createdAt = new Date(date).toISOString();

  const response = await fetch("/api/diary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      created_at: createdAt,
      title,
      observation,
      aquarium_id: aquariumId,
      tag,
      image_id: imageId,
      is_pinned: Boolean(isPinned),
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося створити запис"));
  }

  return data;
}

export async function updateDiaryEntry({
  id,
  date,
  title,
  observation,
  aquariumId,
  tag,
  file,
  imageId = null,
  isPinned,
}) {
  let finalImageId = imageId;

  if (file) {
    const uploaded = await uploadImage(file);

    finalImageId =
      uploaded?.id ||
      uploaded?.image_id ||
      uploaded?.image?.id ||
      uploaded?.data?.id;

    if (!finalImageId) {
      throw new Error("Backend не повернув image_id після завантаження фото");
    }
  }

  const createdAt = new Date(date).toISOString();

  const response = await fetch(`/api/diary/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      created_at: createdAt,
      title,
      observation,
      aquarium_id: aquariumId,
      tag,
      image_id: finalImageId,
      is_pinned: Boolean(isPinned),
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося оновити запис"));
  }

  return data;
}

export async function deleteDiaryEntry(id) {
  const response = await fetch(`/api/diary/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok && response.status !== 204) {
    throw new Error(getErrorMessage(data, "Не вдалося видалити запис"));
  }

  return data;
}