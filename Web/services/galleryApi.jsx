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

export function mapGalleryPhotoFromList(item) {
  return {
    id: item.id,
    title: "Фото екосистеми",
    aquarium: "Головний Травник",
    date: "",
    caption: "",
    image: item.cover_image_url,
    cover_image_url: item.cover_image_url,
    icon: "🖼️",
    size: "wide",
    gradient: "from-[#635BFF] to-[#22D3EE]",
  };
}

export function mapGalleryPhotoFromDetails(item) {
  return {
    id: item.id,
    title: "Фото екосистеми",
    aquarium: item.aquarium_name || "Акваріум",
    date: "",
    caption: item.signature || "",
    image: item.cover_image_url,
    cover_image_url: item.cover_image_url,
    icon: "🖼️",
    size: "wide",
    gradient: "from-[#635BFF] to-[#22D3EE]",
  };
}

export async function getGalleryPhotos({
  category = "",
  aquariumName = "",
  sortOrder = "newest",
} = {}) {
  const params = new URLSearchParams();

  if (category && category !== "Всі фотографії") {
    params.append("category", category);
  }

  if (aquariumName && aquariumName !== "Усі акваріуми") {
    params.append("aquarium_name", aquariumName);
  }

  if (sortOrder) {
    params.append("sort_order", sortOrder);
  }

  const response = await fetch(
    `/api/gallery${params.toString() ? `?${params.toString()}` : ""}`,
    {
      method: "GET",
      headers: authHeaders(),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося завантажити галерею"));
  }

  return Array.isArray(data) ? data.map(mapGalleryPhotoFromList) : [];
}

export async function getGalleryPhotoById(photoId) {
  const response = await fetch(`/api/gallery/${photoId}`, {
    method: "GET",
    headers: authHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося завантажити фото"));
  }

  return mapGalleryPhotoFromDetails(data);
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload-image", {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося завантажити зображення"));
  }

  return data;
}

export async function createGalleryPost({
  signature,
  category,
  createdAt,
  aquariumId,
  imageId,
}) {
  const response = await fetch("/api/gallery", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      signature,
      category,
      created_at: createdAt,
      aquarium_id: aquariumId,
      image_id: imageId,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося створити пост галереї"));
  }

  return data;
}

export async function updateGalleryPhoto(photoId, signature) {
  const response = await fetch(`/api/gallery/${photoId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      signature,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося оновити фото"));
  }

  return mapGalleryPhotoFromDetails(data);
}

export async function deleteGalleryPhoto(photoId) {
  const response = await fetch(`/api/gallery/${photoId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося видалити фото"));
  }

  return data;
}

