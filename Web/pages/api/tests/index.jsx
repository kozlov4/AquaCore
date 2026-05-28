const API_URL = "http://127.0.0.1:8000";
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
    const { aquarium_id } = req.query;

    if (!token) {
      return res.status(401).json({
        message: "Authorization token is missing",
      });
    }

    if (!aquarium_id) {
      return res.status(400).json({
        message: "Aquarium id is required",
      });
    }

    if (req.method !== "POST") {
      res.setHeader("Allow", ["POST"]);

      return res.status(405).json({
        message: "Method not allowed",
      });
    }

    const response = await fetch(
      `${API_URL}/tests?aquarium_id=${encodeURIComponent(aquarium_id)}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(req.body),
      }
    );

    const data = await readResponse(response);

    if (!response.ok) {
      return res.status(response.status).json({
        message: getErrorMessage(data, "Не вдалося створити тест води"),
        detail: data?.detail,
        backendStatus: response.status,
        raw: data,
      });
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error("Create water test proxy error:", error);

    return res.status(500).json({
      message: error.message || "Create water test proxy server error",
    });
  }
}