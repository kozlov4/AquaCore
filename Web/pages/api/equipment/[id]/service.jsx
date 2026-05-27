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
    return data.detail
      .map((item) => item?.msg || JSON.stringify(item))
      .join("; ");
  }

  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.message === "string") return data.message;

  return fallbackMessage;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", ["POST"]);

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
        message: "Equipment id is required",
      });
    }

    const response = await fetch(`${API_URL}/equipment/${id}/service`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: token,
      },
    });

    const data = await readResponse(response);

    console.log(`POST /equipment/${id}/service status:`, response.status);
    console.log(`POST /equipment/${id}/service response:`, data);

    if (!response.ok) {
      return res.status(response.status).json({
        message: getErrorMessage(data, "Не вдалося обслужити обладнання"),
        detail: data?.detail,
        backendStatus: response.status,
      });
    }

    return res.status(response.status || 200).json(data);
  } catch (error) {
    console.error("Equipment service proxy error:", error);

    return res.status(500).json({
      message: error.message || "Equipment service proxy server error",
    });
  }
}