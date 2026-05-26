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
      const query = new URLSearchParams();

      if (req.query.date_from) {
        query.append("date_from", req.query.date_from);
      }

      if (req.query.date_to) {
        query.append("date_to", req.query.date_to);
      }

      if (req.query.aquarium_id) {
        query.append("aquarium_id", req.query.aquarium_id);
      }

      if (req.query.is_completed) {
        query.append("is_completed", req.query.is_completed);
      }

      const queryString = query.toString();
      const url = queryString
        ? `${API_URL}/tasks?${queryString}`
        : `${API_URL}/tasks`;

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
          message: getErrorMessage(data, "Не вдалося завантажити завдання"),
          detail: data?.detail,
          backendStatus: response.status,
        });
      }

      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const response = await fetch(`${API_URL}/tasks`, {
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
          message: getErrorMessage(data, "Не вдалося створити завдання"),
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
    console.error("Tasks proxy error:", error);

    return res.status(500).json({
      message: error.message || "Tasks proxy server error",
    });
  }
}