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

const allowedTaskTypes = [
  "Підміна води",
  "Обслуговування",
  "Тести води",
  "Рослини",
  "Власне завдання",
];

const allowedRepeatTypes = [
  "Не повторювати",
  "Щодня",
  "Щотижня",
  "Щомісяця",
];

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
      aquarium_id:
        body.aquarium_id === null ||
        body.aquarium_id === undefined ||
        body.aquarium_id === ""
          ? null
          : Number(body.aquarium_id),

      task_type: String(body.task_type || "Власне завдання").trim(),
      title: String(body.title || "").trim(),
      notes: body.notes ? String(body.notes).trim() : null,
      due_date: body.due_date,
      repeat_type: String(body.repeat_type || "Не повторювати").trim(),
    };

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

    if (!allowedTaskTypes.includes(payload.task_type)) {
      return res.status(400).json({
        message:
          "task_type повинен бути одним із: Підміна води, Обслуговування, Тести води, Рослини, Власне завдання",
        sentTaskType: payload.task_type,
      });
    }

    if (!allowedRepeatTypes.includes(payload.repeat_type)) {
      return res.status(400).json({
        message:
          "repeat_type повинен бути одним із: Не повторювати, Щодня, Щотижня, Щомісяця",
        sentRepeatType: payload.repeat_type,
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