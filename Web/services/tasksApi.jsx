function getErrorMessage(data, fallbackMessage) {
  if (Array.isArray(data?.detail) && data.detail.length > 0) {
    return data.detail[0]?.msg || fallbackMessage;
  }

  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.message === "string") return data.message;

  return fallbackMessage;
}

function getToken() {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token")
  );
}

function authHeaders() {
  const token = getToken();

  if (!token) {
    throw new Error("Потрібно увійти в акаунт");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

const TASK_TYPE_TO_API = {
  water_change: "Підміна води",
  maintenance: "Обслуговування",
  tests: "Тести води",
  plants: "Рослини",
  custom: "Власне завдання",

  "Підміна води": "Підміна води",
  Обслуговування: "Обслуговування",
  "Тести води": "Тести води",
  Тести: "Тести води",
  Рослини: "Рослини",
  "Власне завдання": "Власне завдання",
  Власне: "Власне завдання",
};

const REPEAT_TO_API = {
  none: "Не повторювати",
  daily: "Щодня",
  weekly: "Щотижня",
  monthly: "Щомісяця",

  "Не повторювати": "Не повторювати",
  Щодня: "Щодня",
  Щотижня: "Щотижня",
  Щомісяця: "Щомісяця",
};

function toApiTaskType(value) {
  return TASK_TYPE_TO_API[value] || "Власне завдання";
}

function toApiRepeatType(value) {
  return REPEAT_TO_API[value] || "Не повторювати";
}

function normalizeTask(item) {
  const rawStatus = String(
    item.status || item.task_status || item.state || ""
  ).toLowerCase();

  const isCompleted =
    item.is_completed === true ||
    item.is_done === true ||
    item.completed === true ||
    item.done === true ||
    rawStatus.includes("done") ||
    rawStatus.includes("complete") ||
    rawStatus.includes("completed") ||
    rawStatus.includes("finished");

  return {
    id: item.id || item.task_id,
    title: item.title || item.name || "Без назви",
    description: item.notes || item.description || "",
    aquariumName:
      item.aquarium_name ||
      item.aquarium?.name ||
      item.ecosystem_name ||
      "Усі акваріуми",
    aquariumId:
      item.aquarium_id ||
      item.aquariumId ||
      item.aquarium?.id ||
      null,
    dueDate:
      item.due_date ||
      item.dueDate ||
      item.date ||
      item.execution_date ||
      item.deadline ||
      null,
    category: item.task_type || item.category || item.type || "Завдання",
    taskType: item.task_type || item.category || item.type || "Власне завдання",
    repeat: item.repeat_type || item.repeat || item.recurrence || "Не повторювати",
    isCompleted,
    isOverdue: item.is_overdue || false,
    raw: item,
  };
}

function normalizeAquarium(item) {
  return {
    id: item.id || item.aquarium_id || item.aquariumId,
    name: item.name || item.title || "Акваріум",
    volume:
      item.volume ||
      item.liters ||
      item.capacity_liters ||
      item.capacity ||
      null,
    raw: item,
  };
}

function buildTaskPayload(payload) {
  return {
    aquarium_id: payload.aquarium_id ? Number(payload.aquarium_id) : null,
    task_type: toApiTaskType(payload.task_type || payload.taskType || payload.category),
    title: String(payload.title || "").trim(),
    notes: String(payload.notes ?? payload.description ?? "").trim(),
    due_date: payload.due_date || payload.dueDate,
    repeat_type: toApiRepeatType(payload.repeat_type || payload.repeat || payload.recurrence),
  };
}

export async function getTasks() {
  const response = await fetch("/api/tasks", {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося завантажити завдання"));
  }

  return Array.isArray(data) ? data.map(normalizeTask) : [];
}

export async function updateTaskStatus(taskId, isCompleted) {
  if (!taskId) {
    throw new Error("Не передано id завдання");
  }

  const response = await fetch(`/api/tasks/${encodeURIComponent(taskId)}/status`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      is_completed: Boolean(isCompleted),
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося змінити статус завдання"));
  }

  return normalizeTask(data);
}

export async function getAquariumNamesForTasks() {
  const response = await fetch("/api/aquariums/names", {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося завантажити акваріуми"));
  }

  return Array.isArray(data)
    ? data.map(normalizeAquarium).filter((item) => item.id)
    : [];
}

export async function createTask(payload) {
  const cleanPayload = buildTaskPayload(payload);

  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(cleanPayload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося створити завдання"));
  }

  return normalizeTask(data);
}

export async function updateTask(taskId, payload) {
  if (!taskId) {
    throw new Error("Task id is required");
  }

  const cleanPayload = buildTaskPayload(payload);

  const response = await fetch(`/api/tasks/${encodeURIComponent(taskId)}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(cleanPayload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося оновити завдання"));
  }

  return normalizeTask(data);
}

export async function deleteTask(taskId) {
  if (!taskId) {
    throw new Error("Task id is required");
  }

  const response = await fetch(`/api/tasks/${encodeURIComponent(taskId)}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(getErrorMessage(data, "Не вдалося видалити завдання"));
  }

  return true;
}