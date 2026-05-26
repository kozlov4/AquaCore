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

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      res.setHeader("Allow", ["GET"]);

      return res.status(405).json({
        message: "Method not allowed",
      });
    }

    const token = req.headers.authorization;
    const { id } = req.query;

    if (!token) {
      return res.status(401).json({
        message: "Authorization token is missing",
      });
    }

    if (!id) {
      return res.status(400).json({
        message: "Species id is required",
      });
    }

    const response = await fetch(`${API_URL}/species/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: token,
      },
    });

    const data = await readResponse(response);

    if (!response.ok) {
      console.error("Species detail backend error:", {
        status: response.status,
        id,
        data,
      });

      return res.status(response.status).json({
        message: getErrorMessage(data, "Не вдалося завантажити деталі виду"),
        detail: data?.detail,
        backendStatus: response.status,
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Species detail proxy error:", error);

    return res.status(500).json({
      message: error.message || "Species detail proxy server error",
    });
  }
}