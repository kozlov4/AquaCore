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
    if (req.method === "GET") {
      const {
        limit = "6",
        offset = "0",
        min_rate = "0",
        sort_by = "newest",
      } = req.query;

      const params = new URLSearchParams();

      params.append("limit", String(limit));
      params.append("offset", String(offset));
      params.append("min_rate", String(min_rate));
      params.append("sort_by", String(sort_by));

      const response = await fetch(
        `${API_URL}/feedbacks?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await readResponse(response);

      console.log("GET /feedbacks status:", response.status);
      console.log("GET /feedbacks response:", data);

      return res.status(response.status).json(data);
    }

    if (req.method === "POST") {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({
          message: "Щоб залишити відгук, потрібно увійти в акаунт",
        });
      }

      const payload = {
        rate: Number(req.body.rate),
        description: String(req.body.description || "").trim(),
      };

      if (!payload.rate || payload.rate < 1 || payload.rate > 5) {
        return res.status(400).json({
          message: "Оцінка має бути від 1 до 5",
        });
      }

      if (!payload.description || payload.description.length < 30) {
        return res.status(400).json({
          message: "Опис відгуку має містити мінімум 30 символів",
        });
      }

      const response = await fetch(`${API_URL}/feedbacks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      const data = await readResponse(response);

      console.log("POST /feedbacks status:", response.status);
      console.log("POST /feedbacks payload:", payload);
      console.log("POST /feedbacks response:", data);

      if (!response.ok) {
        return res.status(response.status).json({
          message: getErrorMessage(data, "Не вдалося зберегти відгук"),
          detail: data?.detail,
          backendStatus: response.status,
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
    console.error("Feedback proxy error:", error);

    return res.status(500).json({
      message: error.message || "Feedback proxy server error",
    });
  }
}