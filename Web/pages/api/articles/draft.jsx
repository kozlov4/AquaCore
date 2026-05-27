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
  if (typeof data?.error === "string") return data.error;

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
      const response = await fetch(`${API_URL}/articles/draft`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      });

      const data = await readResponse(response);

      if (!response.ok) {
        return res.status(response.status).json({
          message: getErrorMessage(data, "Не вдалося завантажити чернетки"),
          detail: data?.detail,
          backendStatus: response.status,
          backendResponse: data,
        });
      }

      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const payload = {
        title: String(req.body?.title || "").trim(),
        excerpt: String(req.body?.excerpt || "").trim(),
        content: String(req.body?.content || "").trim(),
        category_id: Number(req.body?.category_id),
        image_id: Number(req.body?.image_id),
      };

      console.log("POST /articles/draft proxy sent payload:", payload);

      const response = await fetch(`${API_URL}/articles/draft`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      const data = await readResponse(response);

      console.log("POST /articles/draft proxy response:", {
        status: response.status,
        data,
      });

      if (!response.ok) {
        return res.status(response.status).json({
          message: getErrorMessage(data, "Не вдалося зберегти чернетку"),
          detail: data?.detail,
          backendStatus: response.status,
          backendResponse: data,
          sentPayload: payload,
        });
      }

      return res.status(response.status || 201).json(data);
    }

    res.setHeader("Allow", ["GET", "POST"]);

    return res.status(405).json({
      message: "Method not allowed",
    });
  } catch (error) {
    console.error("Article draft proxy error:", error);

    return res.status(500).json({
      message: error.message || "Article draft proxy server error",
    });
  }
}