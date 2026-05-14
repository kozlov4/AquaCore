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

export function formatAquariumDate(value) {
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

export function mapAquariumFromApi(item) {
  const volumeValue = item.volume ?? item.liters ?? 0;
  const imageUrl =
    item.image_url ||
    item.cover_image_url ||
    item.avatar_url ||
    item.image?.url ||
    item.image?.image_url ||
    null;

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

    createdAt: item.created_at || item.createdAt || "",
    createdDate: formatAquariumDate(item.created_at || item.createdAt),

    population: item.population || "Жителів ще немає",
    lastTest: item.last_test || "Тестів ще немає",
    params: item.params || "pH — · GH — · KH —",
  };
}

export async function getMyAquariums() {
  const response = await fetch("/api/aquariums", {
    method: "GET",
    headers: authHeaders(),
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
    headers: authHeaders(),
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

  const response = await fetch("/api/aquariums", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      name,
      volume: Number(volume),
      type,
      created_at: createdAt || new Date().toISOString(),
      image_id: imageId,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося створити акваріум"));
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

  const response = await fetch(`/api/aquariums/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      name,
      volume: Number(volume),
      type,
      created_at: createdAt || new Date().toISOString(),
      image_id: file ? imageId : keepImage ? undefined : null,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося оновити акваріум"));
  }

  return data;
}

export async function deleteAquarium(id) {
  const response = await fetch(`/api/aquariums/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
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