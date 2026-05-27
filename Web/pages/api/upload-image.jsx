export const config = {
  api: {
    bodyParser: false,
  },
};

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

    if (req.method !== "POST") {
      res.setHeader("Allow", ["POST"]);

      return res.status(405).json({
        message: "Method not allowed",
      });
    }

    const response = await fetch(`${API_URL}/upload-image`, {
      method: "POST",
      headers: {
        Authorization: token,
        "content-type": req.headers["content-type"],
      },
      body: req,
      duplex: "half",
    });

    const data = await readResponse(response);

    if (!response.ok) {
      return res.status(response.status).json({
        message: getErrorMessage(data, "Не вдалося завантажити фото"),
        detail: data?.detail,
        backendStatus: response.status,
        raw: data,
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Upload image proxy error:", error);

    return res.status(500).json({
      message: error.message || "Upload image proxy server error",
    });
  }
}