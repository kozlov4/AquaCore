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

    if (!token) {
      return res.status(401).json({
        message: "Authorization token is missing",
      });
    }

    const body = req.body || {};

 const payload = {
  aquarium_id: Number(body.aquarium_id),
  title: String(body.title || "").trim(),
  description: String(body.description || "").trim(),
  due_date: body.due_date,
  recurrence: body.recurrence || "none",
  category: body.category || "Власне",
  task_type: body.task_type || "custom",
};

    if (!payload.aquarium_id) {
      return res.status(400).json({
        message: "aquarium_id is required",
      });
    }

    if (!payload.title) {
      return res.status(400).json({
        message: "title is required",
      });
    }

    if (!payload.due_date) {
      return res.status(400).json({
        message: "due_date is required",
      });
    }

    console.log("POST /tasks payload:", payload);

    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(payload),
    });

    const data = await readResponse(response);

    console.log("POST /tasks status:", response.status);
    console.log("POST /tasks response:", data);

    if (!response.ok) {
      return res.status(response.status).json({
        message: getErrorMessage(data, "Не вдалося створити завдання"),
        detail: data?.detail,
        backendStatus: response.status,
        sentPayload: payload,
      });
    }

    return res.status(response.status || 201).json(data);
  } catch (error) {
    console.error("Create task proxy error:", error);

    return res.status(500).json({
      message: error.message || "Create task proxy server error",
    });
  }
}