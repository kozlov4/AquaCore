"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
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
  deleteTask,
  getAquariumNamesForTasks,
  getTasks,
  updateTask,
  updateTaskStatus,
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

function formatDateTitle(date) {
  return date.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
  });
}

function isTaskOverdue(task) {
  if (task.isCompleted) return false;

  const dueDate = toDateOnly(task.dueDate);
  const today = new Date();

  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  if (task.isOverdue) return true;

  return dueDate && dueDate < todayOnly;
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

  return (
    <div className="rounded-[16px] border border-[#edf0f5] bg-white p-[18px] shadow-[0_10px_30px_rgba(15,23,42,0.035)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[13px] font-black text-[#111827]">
          {monthNames[month]} {year}
        </h3>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() =>
              setSelectedDate(new Date(year, month - 1, selectedDate.getDate()))
            }
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#98a2b3] transition hover:bg-[#f4f6fb] hover:text-[#111827]"
          >
            <ChevronLeft size={15} />
          </button>

          <button
            type="button"
            onClick={() =>
              setSelectedDate(new Date(year, month + 1, selectedDate.getDate()))
            }
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#98a2b3] transition hover:bg-[#f4f6fb] hover:text-[#111827]"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 text-center">
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"].map((day) => (
          <span
            key={day}
            className={`text-[10px] font-black ${
              day === "Сб" || day === "Нд" ? "text-red-400" : "text-[#98a2b3]"
            }`}
          >
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, index) => {
          if (!date) {
            return (
              <div
                key={`empty-${index}`}
                className="flex h-7 items-center justify-center text-[11px] font-bold text-[#d0d5dd]"
              />
            );
          }

          const active = isSameDay(date, selectedDate);
          const today = isSameDay(date, new Date());

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => setSelectedDate(date)}
              className={`
                relative flex h-7 items-center justify-center rounded-lg text-[11px] font-bold transition
                ${
                  active
                    ? "bg-[#635bff] text-white shadow-[0_8px_18px_rgba(99,91,255,0.32)]"
                    : "text-[#475467] hover:bg-[#f4f6fb]"
                }
              `}
            >
              {date.getDate()}

              {today && !active && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#635bff]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FilterButton({ active, icon, label, count, onClick, type = "all" }) {
  const isOverdue = type === "overdue";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex h-10 w-full items-center justify-between rounded-lg px-3
        text-[12px] font-black transition
        ${
          active && !isOverdue
            ? "bg-[#eef0ff] text-[#635bff]"
            : "bg-transparent text-[#475467] hover:bg-[#f8fafc]"
        }
      `}
    >
      <span className="flex items-center gap-2">
        <span className="text-[13px]">{icon}</span>
        {label}
      </span>

      <span
        className={`
          flex h-6 min-w-6 items-center justify-center rounded-full px-2
          text-[11px] font-black
          ${
            isOverdue
              ? "bg-red-100 text-red-500"
              : "bg-[#cfd5ff] text-[#635bff]"
          }
        `}
      >
        {count}
      </span>
    </button>
  );
}

function TaskItem({ task, onToggle, onEdit, onDelete, isUpdating }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const overdue = isTaskOverdue(task);

  return (
    <div
      className={`
        relative flex min-h-[64px] gap-3 rounded-[12px] border bg-white px-4 py-3
        shadow-[0_8px_24px_rgba(15,23,42,0.035)] transition hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)]
        ${
          overdue
            ? "border-red-100 border-l-[3px] border-l-red-500"
            : task.isCompleted
            ? "border-[#edf0f5] bg-[#f8fafc]"
            : "border-[#edf0f5]"
        }
      `}
    >
      <button
        type="button"
        onClick={() => onToggle(task)}
        disabled={isUpdating}
        className={`
          mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition
          ${
            task.isCompleted
              ? "border-[#8b7cff] bg-[#8b7cff] text-white"
              : "border-[#cbd5e1] bg-white hover:border-[#635bff]"
          }
        `}
      >
        {task.isCompleted && <Check size={11} />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          {overdue && (
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-black uppercase text-red-500">
              Прострочено
            </span>
          )}

          {task.aquariumName && (
            <span className="text-[10px] font-bold text-[#98a2b3]">
              🐠 {task.aquariumName}
            </span>
          )}
        </div>

        <h3
          className={`text-[13px] font-black leading-snug ${
            task.isCompleted ? "text-[#98a2b3] line-through" : "text-[#111827]"
          }`}
        >
          {task.title}
        </h3>

        {task.description && (
          <p
            className={`mt-1 text-[11px] font-semibold leading-5 ${
              task.isCompleted ? "text-[#b8c0cc]" : "text-[#667085]"
            }`}
          >
            {task.description}
          </p>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#98a2b3] transition hover:bg-[#f4f6fb] hover:text-[#111827]"
        >
          <MoreVertical size={15} />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 top-8 z-20 w-40 overflow-hidden rounded-xl border border-[#edf0f5] bg-white shadow-xl">
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                onEdit(task);
              }}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-[12px] font-bold text-[#475467] hover:bg-[#f8fafc]"
            >
              <Edit3 size={14} />
              Редагувати
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                onDelete(task);
              }}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-[12px] font-bold text-red-500 hover:bg-red-50"
            >
              <Trash2 size={14} />
              Видалити
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [aquariums, setAquariums] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedAquariumId, setSelectedAquariumId] = useState("all");

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
    async function loadPageData() {
      try {
        setIsLoading(true);
        setTasksError("");

        const [tasksData, aquariumsData] = await Promise.all([
          getTasks(),
          getAquariumNamesForTasks(),
        ]);

        setTasks(tasksData);
        setAquariums(aquariumsData);
      } catch (error) {
        setTasks([]);
        setAquariums([]);
        setTasksError(
          error.message || "Не вдалося завантажити завдання або акваріуми"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadPageData();
  }, []);

  const aquariumFilteredTasks = useMemo(() => {
    if (selectedAquariumId === "all") return tasks;

    return tasks.filter(
      (task) => String(task.aquariumId) === String(selectedAquariumId)
    );
  }, [tasks, selectedAquariumId]);

  const visibleTasks = useMemo(() => {
    let list = aquariumFilteredTasks.filter((task) => {
      const taskDate = toDateOnly(task.dueDate);

      if (!taskDate) return true;

      return isSameDay(taskDate, selectedDate);
    });

    if (activeFilter === "overdue") {
      list = list.filter((task) => isTaskOverdue(task));
    }

    return list;
  }, [aquariumFilteredTasks, selectedDate, activeFilter]);

  const allCount = aquariumFilteredTasks.length;
  const overdueCount = aquariumFilteredTasks.filter(isTaskOverdue).length;

  const selectedAquariumName = useMemo(() => {
    if (selectedAquariumId === "all") return "Усі екосистеми";

    const found = aquariums.find(
      (aquarium) => String(aquarium.id) === String(selectedAquariumId)
    );

    return found?.name || "Обраний акваріум";
  }, [aquariums, selectedAquariumId]);

  const handleToggleTask = async (task) => {
    try {
      if (!task?.id) {
        throw new Error("Task id is required");
      }

      const nextStatus = !task.isCompleted;

      setUpdatingTaskId(task.id);
      setTasksError("");

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
          editingTask.taskType || editingTask.category || "Власне завдання",
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

      const previousTasks = tasks;

      setTasksError("");
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

      <section className="min-h-screen px-5 py-7 md:ml-[88px] md:px-10 lg:px-[54px]">
        <div className="mx-auto max-w-[920px]">
          <header className="mb-6 flex items-start justify-between gap-5">
            <div>
              <h1 className="text-[22px] font-black tracking-[-0.02em] text-[#111827]">
                Планування та Догляд
              </h1>

              <p className="mt-1 text-[11px] font-semibold text-[#98a2b3]">
                Організуйте рутину для всіх ваших екосистем
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#635bff] px-4 text-[11px] font-black text-white shadow-[0_10px_22px_rgba(99,91,255,0.25)] transition hover:bg-[#544cf0]"
            >
              <Plus size={14} />
              Нове завдання
            </button>
          </header>

          <div className="grid gap-5 lg:grid-cols-[250px_1fr]">
            <aside className="space-y-4">
              <CalendarMini
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />

              <div className="rounded-[16px] border border-[#edf0f5] bg-white p-[18px] shadow-[0_10px_30px_rgba(15,23,42,0.035)]">
                <h2 className="mb-3 text-[11px] font-black uppercase tracking-[0.08em] text-[#98a2b3]">
                  Фільтрація
                </h2>

                <div className="space-y-2">
                  <FilterButton
                    active={activeFilter === "all"}
                    icon="🗓️"
                    label="Всі завдання"
                    count={allCount}
                    type="all"
                    onClick={() => setActiveFilter("all")}
                  />

                  <FilterButton
                    active={activeFilter === "overdue"}
                    icon="⚠️"
                    label="Прострочені"
                    count={overdueCount}
                    type="overdue"
                    onClick={() => setActiveFilter("overdue")}
                  />
                </div>

                <div className="my-4 h-px w-full bg-[#edf0f5]" />

                <div>
                  <label className="mb-2 block text-[11px] font-black text-[#667085]">
                    За акваріумом
                  </label>

                  <div className="relative">
                    <select
                      value={selectedAquariumId}
                      onChange={(event) =>
                        setSelectedAquariumId(event.target.value)
                      }
                      className="
                        h-10 w-full appearance-none rounded-lg border border-[#dfe5ef]
                        bg-white px-3 pr-9 text-[12px] font-semibold text-[#263445]
                        outline-none transition
                        focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10
                      "
                    >
                      <option value="all">Усі екосистеми</option>

                      {aquariums.map((aquarium) => (
                        <option key={aquarium.id} value={aquarium.id}>
                          {aquarium.name}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#475467]"
                    />
                  </div>
                </div>
              </div>
            </aside>

            <section>
              <div className="mb-3">
                <h2 className="text-[16px] font-black text-[#111827]">
                  Сьогодні, {formatDateTitle(selectedDate)}
                </h2>

                <p className="mt-1 text-[11px] font-semibold text-[#98a2b3]">
                  {selectedAquariumName} • показано {visibleTasks.length}{" "}
                  завдань
                </p>
              </div>

              {tasksError && (
                <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[12px] font-bold text-red-500">
                  {tasksError}
                </div>
              )}

              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-[70px] animate-pulse rounded-[12px] bg-slate-100"
                    />
                  ))}
                </div>
              ) : visibleTasks.length > 0 ? (
                <div className="space-y-3">
                  {visibleTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={handleToggleTask}
                      onEdit={handleOpenEdit}
                      onDelete={handleDeleteTask}
                      isUpdating={updatingTaskId === task.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-[14px] border border-dashed border-[#d9dee8] bg-[#fbfcfe] p-8 text-center">
                  <p className="text-[15px] font-black text-[#111827]">
                    На цей день завдань немає
                  </p>

                  <p className="mt-2 text-[12px] font-semibold text-[#98a2b3]">
                    Оберіть інший день, змініть фільтри або створіть нове
                    завдання.
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </section>

      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-[460px] overflow-hidden rounded-[22px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#edf0f5] px-5 py-4">
              <div>
                <h2 className="text-lg font-black text-[#111827]">
                  Редагувати завдання
                </h2>

                <p className="mt-1 text-xs font-semibold text-[#98a2b3]">
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

            <div className="px-5 py-5">
              <label className="mb-2 block text-xs font-black uppercase text-[#98a2b3]">
                Назва завдання
              </label>

              <input
                value={editTitle}
                onChange={(event) => setEditTitle(event.target.value)}
                disabled={isEditSaving}
                className="mb-4 h-11 w-full rounded-xl border border-[#e3e9f2] px-4 text-sm font-bold text-[#111827] outline-none transition focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10"
                placeholder="Наприклад: Підміна води 30%"
              />

              <label className="mb-2 block text-xs font-black uppercase text-[#98a2b3]">
                Опис
              </label>

              <input
                value={editDescription}
                onChange={(event) => setEditDescription(event.target.value)}
                disabled={isEditSaving}
                className="mb-4 h-11 w-full rounded-xl border border-[#e3e9f2] px-4 text-sm font-semibold text-[#111827] outline-none transition focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10"
                placeholder="Додатковий опис завдання"
              />

              <label className="mb-2 block text-xs font-black uppercase text-[#98a2b3]">
                Дата виконання
              </label>

              <input
                type="date"
                value={editDueDate}
                onChange={(event) => setEditDueDate(event.target.value)}
                disabled={isEditSaving}
                className="mb-4 h-11 w-full rounded-xl border border-[#e3e9f2] px-4 text-sm font-bold text-[#111827] outline-none transition focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10"
              />

              <label className="mb-2 block text-xs font-black uppercase text-[#98a2b3]">
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
                  className="h-10 rounded-xl border border-[#e3e9f2] px-5 text-sm font-black text-[#475467] transition hover:bg-[#f8fafc]"
                >
                  Скасувати
                </button>

                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={isEditSaving}
                  className="h-10 rounded-xl bg-[#635bff] px-5 text-sm font-black text-white shadow-[0_12px_26px_rgba(99,91,255,0.25)] transition hover:bg-[#544cf0] disabled:opacity-60"
                >
                  {isEditSaving ? "Збереження..." : "Зберегти"}
                </button>
              </div>
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