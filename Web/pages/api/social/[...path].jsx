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
    const path = Array.isArray(req.query.path) ? req.query.path.join("/") : "";

    if (!token) {
      return res.status(401).json({
        message: "Authorization token is missing",
      });
    }

    const allowedMethods = ["GET", "POST", "PATCH", "PUT", "DELETE"];

    if (!allowedMethods.includes(req.method)) {
      res.setHeader("Allow", allowedMethods);
      return res.status(405).json({
        message: "Method Not Allowed",
      });
    }

    const backendUrl = `${API_URL}/social/${path}`;

    const response = await fetch(backendUrl, {
      method: req.method,
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: ["GET", "DELETE"].includes(req.method)
        ? undefined
        : JSON.stringify(req.body || {}),
    });

    const data = await readResponse(response);

    if (!response.ok) {
      return res.status(response.status).json({
        message: getErrorMessage(data, "Backend request failed"),
        backendStatus: response.status,
        detail: data?.detail,
      });
    }

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
}