import { apiJson } from "./apiClient";

function todayInputDate() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeRepeatType(value) {
  const repeat = String(value || "").trim();

  if (!repeat) {
    return "Не повторювати";
  }

  return repeat;
}

function normalizeTaskType(value) {
  const taskType = String(value || "").trim();

  const allowedTypes = [
    "Підміна води",
    "Обслуговування",
    "Тести води",
    "Рослини",
    "Власне завдання",
  ];

  return allowedTypes.includes(taskType) ? taskType : "Власне завдання";
}

export async function createTask(values = {}) {
  const title = String(values.title || "").trim();

  if (!title) {
    throw new Error("Введіть назву завдання");
  }

  const payload = {
    aquarium_id: values.aquarium_id || values.aquariumId || null,
    task_type: normalizeTaskType(values.task_type || values.taskType),
    title,
    notes: String(values.notes || "").trim() || null,
    due_date: values.due_date || values.dueDate || todayInputDate(),
    repeat_type: normalizeRepeatType(values.repeat_type || values.repeatType),
  };

  return apiJson(
    "/api/tasks",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    "Не вдалося створити завдання"
  );
}