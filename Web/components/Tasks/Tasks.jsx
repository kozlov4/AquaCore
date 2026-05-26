"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit3,
  MoreVertical,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { Sidebar } from "../Profile/Sidebar";
import {
  getTasks,
  updateTaskStatus,
  updateTask,
  deleteTask,
} from "../../services/tasksApi";
import { CreateTaskModal } from "./CreateTaskModal";

const monthNames = [
  "Січень",
  "Лютий",
  "Березень",
  "Квітень",
  "Травень",
  "Червень",
  "Липень",
  "Серпень",
  "Вересень",
  "Жовтень",
  "Листопад",
  "Грудень",
];

function formatDateTitle(date) {
  return date.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
  });
}

function toDateOnly(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(first, second) {
  if (!first || !second) return false;

  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function isTaskOverdue(task, selectedDate) {
  if (task.isCompleted) return false;

  const dueDate = toDateOnly(task.dueDate);
  const today = new Date();
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  if (task.isOverdue) return true;

  return dueDate && dueDate < todayOnly && isSameDay(selectedDate, todayOnly);
}

function CalendarMini({ selectedDate, setSelectedDate }) {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];

  for (let i = 0; i < startOffset; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }

  const previousMonth = () => {
    setSelectedDate(new Date(year, month - 1, selectedDate.getDate()));
  };

  const nextMonth = () => {
    setSelectedDate(new Date(year, month + 1, selectedDate.getDate()));
  };

  return (
    <div className="rounded-[18px] border border-[#edf0f5] bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.04)]">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-[14px] font-extrabold text-[#111827]">
          {monthNames[month]} {year}
        </h3>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={previousMonth}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#98a2b3] hover:bg-[#f4f6fb] hover:text-[#111827]"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            onClick={nextMonth}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#98a2b3] hover:bg-[#f4f6fb] hover:text-[#111827]"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-bold text-[#98a2b3]">
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"].map((day) => (
          <span
            key={day}
            className={day === "Сб" || day === "Нд" ? "text-red-400" : ""}
          >
            {day}
          </span>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-7 gap-2">
        {cells.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="h-8" />;
          }

          const active = isSameDay(date, selectedDate);
          const today = isSameDay(date, new Date());

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => setSelectedDate(date)}
              className={`
                relative flex h-8 items-center justify-center rounded-lg
                text-[12px] font-bold transition
                ${
                  active
                    ? "bg-[#635bff] text-white shadow-[0_8px_18px_rgba(99,91,255,0.28)]"
                    : "text-[#475467] hover:bg-[#f4f6fb]"
                }
              `}
            >
              {date.getDate()}

              {today && !active && (
                <span className="absolute bottom-[3px] h-[3px] w-[3px] rounded-full bg-[#635bff]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TaskItem({
  task,
  selectedDate,
  onToggle,
  onEdit,
  onDelete,
  isUpdating,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const overdue = isTaskOverdue(task, selectedDate);

  return (
    <article
      className={`
        relative flex items-start gap-4 rounded-[16px] border bg-white px-5 py-4
        shadow-[0_10px_28px_rgba(15,23,42,0.035)]
        ${
          task.isCompleted
            ? "border-[#eef0f4] bg-[#f8fafc] opacity-60"
            : "border-[#edf0f5]"
        }
        ${overdue ? "border-l-4 border-l-red-500" : ""}
      `}
    >
      <button
        type="button"
        onClick={() => onToggle(task)}
        disabled={isUpdating}
        className={`
          mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border transition
          ${
            task.isCompleted
              ? "border-[#8b7cff] bg-[#8b7cff] text-white"
              : "border-[#cbd5e1] bg-white hover:border-[#635bff]"
          }
        `}
      >
        {task.isCompleted && <Check size={14} />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          {overdue && (
            <span className="rounded-md bg-red-50 px-2 py-1 text-[10px] font-black uppercase tracking-[0.04em] text-red-500">
              Прострочено
            </span>
          )}

          <span className="text-[11px] font-bold text-[#98a2b3]">
            {task.category}
          </span>

          <span className="text-[11px] font-bold text-[#98a2b3]">
            🐟 {task.aquariumName}
          </span>
        </div>

        <h3
          className={`
            text-[15px] font-extrabold text-[#111827]
            ${task.isCompleted ? "line-through text-[#98a2b3]" : ""}
          `}
        >
          {task.title}
        </h3>

        {task.description && (
          <p
            className={`
              mt-1 text-[13px] font-medium text-[#98a2b3]
              ${task.isCompleted ? "line-through" : ""}
            `}
          >
            {task.description}
          </p>
        )}
      </div>

      <div className="relative mt-1">
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#98a2b3] hover:bg-[#f4f6fb] hover:text-[#111827]"
        >
          <MoreVertical size={17} />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 top-10 z-40 w-44 overflow-hidden rounded-xl border border-[#edf0f5] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                onEdit(task);
              }}
              className="flex w-full items-center gap-2 px-4 py-3 text-left text-[13px] font-bold text-[#475467] transition hover:bg-[#f8fafc] hover:text-[#111827]"
            >
              <Edit3 size={15} />
              Редагувати
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                onDelete(task);
              }}
              className="flex w-full items-center gap-2 px-4 py-3 text-left text-[13px] font-bold text-red-500 transition hover:bg-red-50"
            >
              <Trash2 size={15} />
              Видалити
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [tasksError, setTasksError] = useState("");
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editRepeat, setEditRepeat] = useState("Не повторювати");
  const [isEditSaving, setIsEditSaving] = useState(false);

  useEffect(() => {
    async function loadTasks() {
      try {
        setIsLoading(true);
        setTasksError("");

        const data = await getTasks();

        setTasks(data);
      } catch (error) {
        setTasks([]);
        setTasksError(error.message || "Не вдалося завантажити завдання");
      } finally {
        setIsLoading(false);
      }
    }

    loadTasks();
  }, []);

  const selectedDateTasks = useMemo(() => {
    let list = tasks.filter((task) => {
      const taskDate = toDateOnly(task.dueDate);

      if (!taskDate) return true;

      return isSameDay(taskDate, selectedDate);
    });

    if (activeFilter === "overdue") {
      list = list.filter((task) => isTaskOverdue(task, selectedDate));
    }

    return list;
  }, [tasks, selectedDate, activeFilter]);

  const overdueCount = useMemo(() => {
    return tasks.filter((task) => isTaskOverdue(task, new Date())).length;
  }, [tasks]);

  const handleToggleTask = async (task) => {
    try {
      if (!task?.id) {
        throw new Error("Task id is required");
      }

      setUpdatingTaskId(task.id);
      setTasksError("");

      const nextStatus = !task.isCompleted;

      setTasks((prev) =>
        prev.map((item) =>
          item.id === task.id ? { ...item, isCompleted: nextStatus } : item
        )
      );

      await updateTaskStatus(task.id, nextStatus);
    } catch (error) {
      setTasksError(error.message || "Не вдалося оновити завдання");

      setTasks((prev) =>
        prev.map((item) =>
          item.id === task.id
            ? { ...item, isCompleted: !item.isCompleted }
            : item
        )
      );
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setEditTitle(task.title || "");
    setEditDescription(task.description || "");
    setEditDueDate(task.dueDate ? String(task.dueDate).slice(0, 10) : "");
    setEditRepeat(task.repeat || "Не повторювати");
  };

  const handleSaveEdit = async () => {
    try {
      if (!editingTask?.id) {
        throw new Error("Task id is required");
      }

      if (!editTitle.trim()) {
        throw new Error("Введіть назву завдання");
      }

      if (!editDueDate) {
        throw new Error("Оберіть дату виконання");
      }

      setIsEditSaving(true);
      setTasksError("");

      const updatedTask = await updateTask(editingTask.id, {
        aquarium_id: editingTask.aquariumId,
        task_type:
          editingTask.taskType ||
          editingTask.category ||
          "Власне завдання",
        title: editTitle.trim(),
        notes: editDescription.trim(),
        due_date: editDueDate,
        repeat_type: editRepeat || "Не повторювати",
      });

      setTasks((prev) =>
        prev.map((item) => (item.id === editingTask.id ? updatedTask : item))
      );

      setEditingTask(null);
    } catch (error) {
      setTasksError(error.message || "Не вдалося оновити завдання");
    } finally {
      setIsEditSaving(false);
    }
  };

  const handleDeleteTask = async (task) => {
    try {
      if (!task?.id) {
        throw new Error("Task id is required");
      }

      const confirmed = window.confirm(`Видалити завдання "${task.title}"?`);

      if (!confirmed) return;

      setTasksError("");

      const previousTasks = tasks;

      setTasks((prev) => prev.filter((item) => item.id !== task.id));

      try {
        await deleteTask(task.id);
      } catch (error) {
        setTasks(previousTasks);
        throw error;
      }
    } catch (error) {
      setTasksError(error.message || "Не вдалося видалити завдання");
    }
  };

  const handleTaskCreated = (createdTask) => {
    setTasks((prev) => [createdTask, ...prev]);
  };

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <Sidebar />

      <section className="min-h-screen px-5 py-9 md:ml-[88px] md:px-10 lg:px-[54px]">
        <div className="mx-auto max-w-[1030px]">
          <header className="mb-7 flex items-start justify-between gap-5">
            <div>
              <h1 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#111827]">
                Планування та Догляд
              </h1>

              <p className="mt-2 text-[13px] font-medium text-[#98a2b3]">
                Організуйте рутину для всіх ваших екосистем
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#635bff] px-5 text-[13px] font-extrabold text-white shadow-[0_12px_26px_rgba(99,91,255,0.25)] transition hover:bg-[#544cf0]"
            >
              <Plus size={17} />
              Нове завдання
            </button>
          </header>

          <div className="grid grid-cols-1 gap-7 lg:grid-cols-[300px_1fr]">
            <aside className="space-y-5">
              <CalendarMini
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />

              <div className="rounded-[18px] border border-[#edf0f5] bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.04)]">
                <h3 className="mb-4 text-[12px] font-black uppercase tracking-[0.04em] text-[#98a2b3]">
                  Фільтрація
                </h3>

                <button
                  type="button"
                  onClick={() => setActiveFilter("all")}
                  className={`
                    mb-3 flex h-10 w-full items-center justify-between rounded-lg px-4
                    text-[13px] font-extrabold transition
                    ${
                      activeFilter === "all"
                        ? "bg-[#edf0ff] text-[#635bff]"
                        : "text-[#475467] hover:bg-[#f8fafc]"
                    }
                  `}
                >
                  <span>📅 Всі завдання</span>
                  <span className="rounded-full bg-[#dfe3ff] px-2 py-1 text-[11px] text-[#635bff]">
                    {tasks.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFilter("overdue")}
                  className={`
                    flex h-10 w-full items-center justify-between rounded-lg px-4
                    text-[13px] font-extrabold transition
                    ${
                      activeFilter === "overdue"
                        ? "bg-red-50 text-red-500"
                        : "text-[#475467] hover:bg-[#f8fafc]"
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    <AlertTriangle size={15} />
                    Прострочені
                  </span>
                  <span className="rounded-full bg-red-100 px-2 py-1 text-[11px] text-red-500">
                    {overdueCount}
                  </span>
                </button>

                <div className="mt-6">
                  <label className="mb-2 block text-[12px] font-bold text-[#667085]">
                    За акваріумом
                  </label>

                  <select className="h-10 w-full rounded-lg border border-[#e3e9f2] bg-[#f8fafc] px-3 text-[13px] font-semibold text-[#475467] outline-none">
                    <option>Усі екосистеми</option>
                  </select>
                </div>
              </div>
            </aside>

            <section>
              <h2 className="mb-4 text-[18px] font-extrabold text-[#111827]">
                Сьогодні, {formatDateTitle(selectedDate)}
              </h2>

              {tasksError && (
                <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-500">
                  {tasksError}
                </div>
              )}

              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-[88px] animate-pulse rounded-[16px] border border-[#edf0f5] bg-[#f8fafc]"
                    />
                  ))}
                </div>
              ) : selectedDateTasks.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      selectedDate={selectedDate}
                      onToggle={handleToggleTask}
                      onEdit={handleOpenEdit}
                      onDelete={handleDeleteTask}
                      isUpdating={updatingTaskId === task.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-[18px] border border-dashed border-[#d9dee8] bg-[#fbfcfe] p-10 text-center">
                  <CalendarDays
                    size={34}
                    className="mx-auto mb-3 text-[#98a2b3]"
                  />

                  <p className="text-[16px] font-extrabold text-[#111827]">
                    На цей день завдань немає
                  </p>

                  <p className="mt-2 text-[13px] font-medium text-[#98a2b3]">
                    Оберіть інший день або створіть нове завдання.
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </section>

      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-[#111827]">
                  Редагувати завдання
                </h2>

                <p className="mt-1 text-sm font-semibold text-[#98a2b3]">
                  Змініть назву, опис або дату виконання.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingTask(null)}
                disabled={isEditSaving}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4f6fb] text-[#98a2b3] transition hover:bg-[#edf0f5] hover:text-[#111827]"
              >
                <X size={18} />
              </button>
            </div>

            <label className="mb-2 block text-[13px] font-black text-[#475467]">
              Назва завдання
            </label>

            <input
              value={editTitle}
              onChange={(event) => setEditTitle(event.target.value)}
              disabled={isEditSaving}
              className="mb-4 h-11 w-full rounded-xl border border-[#e3e9f2] px-4 text-sm font-bold text-[#111827] outline-none transition focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10"
              placeholder="Наприклад: Підміна води 30%"
            />

            <label className="mb-2 block text-[13px] font-black text-[#475467]">
              Опис
            </label>

            <input
              value={editDescription}
              onChange={(event) => setEditDescription(event.target.value)}
              disabled={isEditSaving}
              className="mb-4 h-11 w-full rounded-xl border border-[#e3e9f2] px-4 text-sm font-semibold text-[#111827] outline-none transition focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10"
              placeholder="Додатковий опис завдання"
            />

            <label className="mb-2 block text-[13px] font-black text-[#475467]">
              Дата виконання
            </label>

            <input
              type="date"
              value={editDueDate}
              onChange={(event) => setEditDueDate(event.target.value)}
              disabled={isEditSaving}
              className="mb-4 h-11 w-full rounded-xl border border-[#e3e9f2] px-4 text-sm font-bold text-[#111827] outline-none transition focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10"
            />

            <label className="mb-2 block text-[13px] font-black text-[#475467]">
              Повторювати
            </label>

            <select
              value={editRepeat}
              onChange={(event) => setEditRepeat(event.target.value)}
              disabled={isEditSaving}
              className="mb-6 h-11 w-full rounded-xl border border-[#e3e9f2] bg-white px-4 text-sm font-bold text-[#111827] outline-none transition focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10"
            >
              <option value="Не повторювати">Не повторювати</option>
              <option value="Щодня">Щодня</option>
              <option value="Щотижня">Щотижня</option>
              <option value="Щомісяця">Щомісяця</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                disabled={isEditSaving}
                className="h-11 rounded-xl border border-[#e3e9f2] px-5 text-sm font-black text-[#475467] transition hover:bg-[#f8fafc]"
              >
                Скасувати
              </button>

              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isEditSaving}
                className="h-11 rounded-xl bg-[#635bff] px-5 text-sm font-black text-white transition hover:bg-[#544cf0] disabled:opacity-60"
              >
                {isEditSaving ? "Збереження..." : "Зберегти"}
              </button>
            </div>
          </div>
        </div>
      )}

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handleTaskCreated}
      />
    </main>
  );
}

export default Tasks;