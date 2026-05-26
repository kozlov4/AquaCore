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

function normalizeAquarium(item) {
  return {
    id: item.id || item.aquarium_id || item.aquariumId,
    name: item.name || item.title || "Акваріум",
  };
}

function normalizeGalleryPhoto(item) {
  return {
    id: item.id,
    imageUrl:
      item.cover_image_url ||
      item.image_url ||
      item.url ||
      item.photo_url ||
      "",
    aquariumName: item.aquarium_name || item.aquariumName || "Екосистема",
    signature: item.signature || "",
    category: item.category || "Всі фотографії",
    raw: item,
  };
}

export async function getAquariumNamesForGallery() {
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

export async function getGalleryPhotos({
  aquariumName = "",
  category = "",
  sortOrder = "newest",
} = {}) {
  const params = new URLSearchParams();

  if (aquariumName && aquariumName !== "all") {
    params.append("aquarium_name", aquariumName);
  }

  if (category && category !== "all") {
    params.append("category", category);
  }

  if (sortOrder) {
    params.append("sort_order", sortOrder);
  }

  const queryString = params.toString();

  const response = await fetch(
    `/api/gallery${queryString ? `?${queryString}` : ""}`,
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
    throw new Error(getErrorMessage(data, "Не вдалося завантажити галерею"));
  }

  return Array.isArray(data) ? data.map(normalizeGalleryPhoto) : [];
}

export async function getGalleryPhoto(photoId) {
  if (!photoId) {
    throw new Error("Gallery photo id is required");
  }

  const response = await fetch(`/api/gallery/${encodeURIComponent(photoId)}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося отримати фото"));
  }

  return normalizeGalleryPhoto({
    id: photoId,
    ...data,
  });
}

export async function uploadGalleryImage(file) {
  if (!file) {
    throw new Error("Оберіть файл");
  }

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

  const imageId = data?.id || data?.image_id || data?.imageId;

  if (!imageId) {
    throw new Error("Бекенд не повернув image_id після завантаження фото");
  }

  return imageId;
}

const CATEGORY_TO_API = {
  Рослини: "Рослини",
  Жителі: "Жителі",
  "Загальний план": "Загальний план",
  Інше: "Інше",

  // старі назви з фронтенду
  Риби: "Жителі",
  Равлики: "Жителі",
  Обладнання: "Інше",
  Акваскейп: "Загальний план",
  "Всі фотографії": "Інше",
  all: "Інше",
};

function toApiCategory(value) {
  return CATEGORY_TO_API[value] || "Інше";
}

export async function createGalleryPhoto(payload) {
  const response = await fetch("/api/gallery", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      signature: payload.signature || null,
      category: toApiCategory(payload.category),
      created_at: payload.created_at || new Date().toISOString(),
      aquarium_id: Number(payload.aquarium_id),
      image_id: Number(payload.image_id),
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося створити фото"));
  }

  return data;
}

export async function updateGalleryPhoto(photoId, payload) {
  if (!photoId) {
    throw new Error("Gallery photo id is required");
  }

  const response = await fetch(`/api/gallery/${encodeURIComponent(photoId)}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      signature: payload.signature || null,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося оновити фото"));
  }

  return normalizeGalleryPhoto({
    id: photoId,
    ...data,
  });
}

export async function deleteGalleryPhoto(photoId) {
  if (!photoId) {
    throw new Error("Gallery photo id is required");
  }

  const response = await fetch(`/api/gallery/${encodeURIComponent(photoId)}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(getErrorMessage(data, "Не вдалося видалити фото"));
  }

  return true;
}