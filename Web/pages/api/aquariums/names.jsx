const API_URL = "https://aquacore.onrender.com";

async function readResponse(response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {
      message: text || "Empty response from backend",
    };
  }
}

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

function normalizeAquariumNames(data) {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((item) => ({
    id: item.id || item.aquarium_id || item.aquariumId,
    name: item.name || item.title || "Акваріум",
    volume:
      item.volume ||
      item.liters ||
      item.capacity_liters ||
      item.capacity ||
      null,
    ...item,
  }));
}

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      res.setHeader("Allow", ["GET"]);

      return res.status(405).json({
        message: "Method not allowed",
      });
    }

    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "Authorization token is missing",
      });
    }

    const response = await fetch(`${API_URL}/aquariums/names`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: token,
      },
    });

    const data = await readResponse(response);

    console.log("GET /aquariums/names status:", response.status);
    console.log("GET /aquariums/names response:", data);

    if (!response.ok) {
      return res.status(response.status).json({
        message: getErrorMessage(data, "Не вдалося завантажити назви акваріумів"),
        detail: data?.detail,
        backendStatus: response.status,
      });
    }

    return res.status(200).json(normalizeAquariumNames(data));
  } catch (error) {
    console.error("Aquarium names proxy error:", error);

    return res.status(500).json({
      message: error.message || "Aquarium names proxy server error",
    });
  }
}