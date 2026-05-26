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

  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.message === "string") return data.message;

  return fallbackMessage;
}

export default async function handler(req, res) {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "Authorization token is missing",
      });
    }

    if (req.method !== "GET") {
      res.setHeader("Allow", ["GET"]);

      return res.status(405).json({
        message: "Method not allowed",
      });
    }

    const { aquarium_id, metric, period } = req.query;

    if (!aquarium_id) {
      return res.status(400).json({
        message: "aquarium_id is required",
      });
    }

    if (!metric) {
      return res.status(400).json({
        message: "metric is required",
      });
    }

    if (!period) {
      return res.status(400).json({
        message: "period is required",
      });
    }

    const params = new URLSearchParams({
      aquarium_id: String(aquarium_id),
      metric: String(metric),
      period: String(period),
    });

    const response = await fetch(`${API_URL}/tests/analytics?${params.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: token,
      },
    });

    const data = await readResponse(response);

    if (!response.ok) {
      return res.status(response.status).json({
        message: getErrorMessage(data, "Не вдалося завантажити аналітику"),
        detail: data?.detail,
        backendStatus: response.status,
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Tests analytics proxy error:", error);

    return res.status(500).json({
      message: error.message || "Tests analytics proxy server error",
    });
  }
}