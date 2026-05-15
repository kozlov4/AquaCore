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

function formatWaterType(value) {
  if (value === "freshwater") return "Прісноводний";
  if (value === "saltwater") return "Морський";
  return value || "Прісноводний";
}

function mapResident(link) {
  const inhabitant = link.inhabitant || {};

  return {
    id: link.id,
    inhabitantId: inhabitant.id,
    name: inhabitant.name || "Без назви",
    latin: inhabitant.latin_name || inhabitant.scientific_name || "",
    type: inhabitant.type || "fish",
    count: `${link.quantity || 0} шт`,
    quantity: link.quantity || 0,
    icon:
      inhabitant.type === "plant"
        ? "🌿"
        : inhabitant.type === "invertebrate"
        ? "🦐"
        : "🐟",
    imageUrl: inhabitant.image_url || null,
    addedAt: link.added_at || null,
  };
}

export function mapAquariumDetailsFromApi(item) {
  return {
    id: item.id,
    name: item.name || "Без назви",
    volume: `${item.volume_l || 0} л`,
    volumeValue: item.volume_l || 0,
    waterType: item.water_type,
    environment: formatWaterType(item.water_type),
    description: item.description || "",
    groundType: item.ground_type || "",
    lightingModel: item.lighting_model || "",
    filterModel: item.filter_model || "",
    startDate: item.start_date || "",
    residents: Array.isArray(item.inhabitants)
      ? item.inhabitants.map(mapResident)
      : [],
    equipment: item.device
      ? [
          {
            id: item.device.id,
            icon: "⚙️",
            name: item.device.name || "Пристрій",
            desc: `Статус: ${item.device.status || "—"}`,
            date: "",
          },
        ]
      : [],
  };
}

export async function getAquariumDetails(id) {
  const response = await fetch(`/api/aquariums/${id}`, {
    method: "GET",
    headers: authHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося завантажити акваріум"));
  }

  return mapAquariumDetailsFromApi(data);
}