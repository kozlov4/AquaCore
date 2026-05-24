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

function validateFeedbackBody(body) {
  const rate = Number(body?.rate);
  const description = String(body?.description || "").trim();

  if (!Number.isInteger(rate) || rate < 1 || rate > 5) {
    return {
      isValid: false,
      message: "Оцінка має бути цілим числом від 1 до 5",
    };
  }

  if (description.length < 30) {
    return {
      isValid: false,
      message: "Опис відгуку має містити мінімум 30 символів",
    };
  }

  if (description.length > 500) {
    return {
      isValid: false,
      message: "Опис відгуку не може перевищувати 500 символів",
    };
  }

  return {
    isValid: true,
    payload: {
      rate,
      description,
    },
  };
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

      const response = await fetch(`${API_URL}/feedbacks?${params.toString()}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await readResponse(response);

      return res.status(response.status).json(data);
    }

    if (req.method === "POST") {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({
          message: "Authorization token is missing",
        });
      }

      const validation = validateFeedbackBody(req.body);

      if (!validation.isValid) {
        return res.status(400).json({
          message: validation.message,
        });
      }

      const response = await fetch(`${API_URL}/feedbacks`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(validation.payload),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        return res.status(response.status).json({
          message: getErrorMessage(data, "Не вдалося зберегти відгук"),
          detail: data?.detail,
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