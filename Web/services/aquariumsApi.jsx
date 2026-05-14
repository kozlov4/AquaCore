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

export function mapAquariumFromApi(item) {
  return {
    id: item.id,
    name: item.name,
    volume: item.volume,
    type: item.type || "Прісноводний",
    status: item.status || "Активний",
    imageUrl: item.image_url || null,
    population: item.population || null,
    lastTest: item.last_test || null,
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
  type = "Прісноводний",
  createdAt,
  imageId = null,
}) {
  const response = await fetch("/api/aquariums", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      name,
      volume,
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
  type = "Прісноводний",
  createdAt,
  imageId = null,
}) {
  const response = await fetch(`/api/aquariums/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      name,
      volume,
      type,
      created_at: createdAt || new Date().toISOString(),
      image_id: imageId,
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

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося видалити акваріум"));
  }

  return data;
}