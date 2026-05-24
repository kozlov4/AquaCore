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

function normalizeTaskPayload(body) {
  const task_type = body?.task_type || body?.taskType || "Власне завдання";
  const title = String(body?.title || "").trim();
  const notes = String(body?.notes || "").trim();
  const due_date = body?.due_date || body?.dueDate;
  const repeat_type = body?.repeat_type || body?.repeatType || "Не повторювати";
  const aquarium_id = body?.aquarium_id || body?.aquariumId || null;

  return {
    aquarium_id: aquarium_id ? Number(aquarium_id) : null,
    task_type,
    title,
    notes: notes || null,
    due_date,
    repeat_type,
  };
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

    const payload = normalizeTaskPayload(req.body);

    if (!payload.title) {
      return res.status(400).json({
        message: "Назва завдання є обов'язковою",
      });
    }

    if (!payload.due_date) {
      return res.status(400).json({
        message: "Дата виконання є обов'язковою",
      });
    }

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

    if (!response.ok) {
      return res.status(response.status).json({
        message: getErrorMessage(data, "Не вдалося створити завдання"),
        detail: data?.detail,
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