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

    if (req.method === "GET") {
      const params = new URLSearchParams();

      if (req.query.category && req.query.category !== "all") {
        params.append("category", String(req.query.category));
      }

      if (req.query.aquarium_name && req.query.aquarium_name !== "all") {
        params.append("aquarium_name", String(req.query.aquarium_name));
      }

      if (req.query.sort_order) {
        params.append("sort_order", String(req.query.sort_order));
      }

      const queryString = params.toString();

      const response = await fetch(
        `${API_URL}/gallery${queryString ? `?${queryString}` : ""}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: token,
          },
        }
      );

      const data = await readResponse(response);

      if (!response.ok) {
        return res.status(response.status).json({
          message: getErrorMessage(data, "Не вдалося завантажити галерею"),
          detail: data?.detail,
          backendStatus: response.status,
        });
      }

      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const response = await fetch(`${API_URL}/gallery`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(req.body),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        return res.status(response.status).json({
          message: getErrorMessage(data, "Не вдалося створити фото"),
          detail: data?.detail,
          backendStatus: response.status,
        });
      }

      return res.status(201).json(data);
    }

    res.setHeader("Allow", ["GET", "POST"]);

    return res.status(405).json({
      message: "Method not allowed",
    });
  } catch (error) {
    console.error("Gallery proxy error:", error);

    return res.status(500).json({
      message: error.message || "Gallery proxy server error",
    });
  }
}