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
    const { id } = req.query;

    if (!token) {
      return res.status(401).json({
        message: "Authorization token is missing",
      });
    }

    if (!id) {
      return res.status(400).json({
        message: "Aquarium id is required",
      });
    }

    if (req.method !== "GET") {
      res.setHeader("Allow", ["GET"]);

      return res.status(405).json({
        message: "Method not allowed",
      });
    }

    const params = new URLSearchParams();

    if (req.query.period) {
      params.append("period", String(req.query.period));
    }

    if (req.query.date_from) {
      params.append("date_from", String(req.query.date_from));
    }

    if (req.query.date_to) {
      params.append("date_to", String(req.query.date_to));
    }

    const rawTypes = req.query.types;

    if (Array.isArray(rawTypes)) {
      rawTypes.forEach((type) => {
        params.append("types", String(type));
      });
    } else if (rawTypes) {
      params.append("types", String(rawTypes));
    }

    const queryString = params.toString();

    const url = queryString
      ? `${API_URL}/aquariums/${id}/timeline?${queryString}`
      : `${API_URL}/aquariums/${id}/timeline`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: token,
      },
    });

    const data = await readResponse(response);

    if (!response.ok) {
      return res.status(response.status).json({
        message: getErrorMessage(data, "Не вдалося завантажити хронологію"),
        detail: data?.detail,
        backendStatus: response.status,
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Aquarium timeline proxy error:", error);

    return res.status(500).json({
      message: error.message || "Aquarium timeline proxy server error",
    });
  }
}