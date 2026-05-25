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

function normalizeTask(item) {
  const rawStatus = String(
    item.status || item.task_status || item.state || ""
  ).toLowerCase();

  const isCompleted =
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
    description: item.description || item.notes || "",
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
    category: item.category || item.type || "Завдання",
    repeat: item.repeat || item.recurrence || item.repeat_type || "none",
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
      is_done: Boolean(isCompleted),
      completed: Boolean(isCompleted),
      status: isCompleted ? "done" : "active",
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося змінити статус завдання"));
  }

  return data;
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

  return Array.isArray(data) ? data.map(normalizeAquarium).filter((item) => item.id) : [];
}

export async function createTask(payload) {
  const cleanPayload = {
    aquarium_id: Number(payload.aquarium_id),
    title: String(payload.title || "").trim(),
    description: String(payload.description || "").trim(),
    due_date: payload.due_date,
    recurrence: payload.recurrence || "none",
    category: payload.category || "Власне",
    task_type: payload.task_type || "custom",
  };

  const response = await fetch("/api/tasks/create", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(cleanPayload),
  });

  const data = await response.json().catch(() => null);

  console.log("Create task response:", {
    status: response.status,
    data,
    sentPayload: cleanPayload,
  });

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося створити завдання"));
  }

  return normalizeTask(data);
}