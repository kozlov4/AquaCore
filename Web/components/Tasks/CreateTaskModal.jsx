"use client";

import { useEffect, useMemo, useState } from "react";
import {
  X,
  ChevronDown,
  Droplets,
  Wrench,
  TestTube2,
  Leaf,
  Lightbulb,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { createTask, getAquariumNamesForTasks } from "../../services/tasksApi";

function todayInputDate() {
  return new Date().toISOString().slice(0, 10);
}

const templates = [
  {
    label: "Підміна води",
    value: "water_change",
    taskType: "Підміна води",
    icon: Droplets,
    title: "Підміна води 30%",
    description: "",
    category: "Підміна води",
  },
  {
    label: "Обслуговування",
    value: "maintenance",
    taskType: "Обслуговування",
    icon: Wrench,
    title: "Перевірити роботу фільтрів",
    description: "",
    category: "Обслуговування",
  },
  {
    label: "Тести",
    value: "tests",
    taskType: "Тести води",
    icon: TestTube2,
    title: "Перевірити параметри води",
    description: "",
    category: "Тести води",
  },
  {
    label: "Рослини",
    value: "plants",
    taskType: "Рослини",
    icon: Leaf,
    title: "Підрізати рослини",
    description: "",
    category: "Рослини",
  },
  {
    label: "Власне",
    value: "custom",
    taskType: "Власне завдання",
    icon: Lightbulb,
    title: "",
    description: "",
    category: "Власне завдання",
  },
];

const repeatOptions = [
  { label: "Не повторювати", value: "none" },
  { label: "Щодня", value: "daily" },
  { label: "Щотижня", value: "weekly" },
  { label: "Щомісяця", value: "monthly" },
];

function getAquariumLabel(aquarium) {
  if (!aquarium) return "Оберіть екосистему";

  return `${aquarium.name}${aquarium.volume ? ` (${aquarium.volume} л)` : ""}`;
}

function buildTaskPayload({
  aquariumId,
  title,
  description,
  dueDate,
  repeat,
  category,
  taskType,
}) {
  return {
    aquarium_id: Number(aquariumId),
    title: title.trim(),
    description: description.trim(),
    due_date: dueDate,
    recurrence: repeat,
    category,
    task_type: taskType,
  };
}

export function CreateTaskModal({ isOpen, onClose, onCreated }) {
  const [aquariums, setAquariums] = useState([]);
  const [selectedAquariumId, setSelectedAquariumId] = useState("");

  const [activeTemplate, setActiveTemplate] = useState("water_change");
  const [title, setTitle] = useState("Підміна води 30%");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(todayInputDate());
  const [repeat, setRepeat] = useState("weekly");

  const [isAquariumsLoading, setIsAquariumsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [taskError, setTaskError] = useState("");

  const selectedTemplate = useMemo(() => {
    return (
      templates.find((item) => item.value === activeTemplate) || templates[0]
    );
  }, [activeTemplate]);

  useEffect(() => {
    if (!isOpen) return;

    setTaskError("");
    setActiveTemplate("water_change");
    setTitle("Підміна води 30%");
    setDescription("");
    setDueDate(todayInputDate());
    setRepeat("weekly");

    async function loadAquariums() {
      try {
        setIsAquariumsLoading(true);

        const data = await getAquariumNamesForTasks();

        setAquariums(data);

        if (data.length > 0) {
          setSelectedAquariumId(String(data[0].id));
        } else {
          setSelectedAquariumId("");
        }
      } catch (error) {
        setAquariums([]);
        setSelectedAquariumId("");
        setTaskError(error.message || "Не вдалося завантажити акваріуми");
      } finally {
        setIsAquariumsLoading(false);
      }
    }

    loadAquariums();
  }, [isOpen]);

  const handleTemplateClick = (template) => {
    setActiveTemplate(template.value);
    setTitle(template.title);
    setDescription(template.description);
  };

  const handleClose = () => {
    if (isSaving) return;

    onClose?.();
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      setTaskError("");

      if (!selectedAquariumId) {
        throw new Error("Оберіть екосистему");
      }

      if (!title.trim()) {
        throw new Error("Введіть назву завдання");
      }

      if (!dueDate) {
        throw new Error("Оберіть дату виконання");
      }

      const payload = buildTaskPayload({
        aquariumId: selectedAquariumId,
        title,
        description,
        dueDate,
        repeat,
        category: selectedTemplate.category,
        taskType: selectedTemplate.taskType,
      });

      const createdTask = await createTask(payload);

      onCreated?.(createdTask);
      onClose?.();
    } catch (error) {
      setTaskError(error.message || "Не вдалося створити завдання");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            className="fixed inset-0 z-[100] flex items-start justify-center px-4 py-8"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div
              className="w-full max-w-[430px] overflow-hidden rounded-[18px] bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#eef0f4] px-6 py-5">
                <h2 className="text-[18px] font-extrabold text-[#111827]">
                  Нове завдання
                </h2>

                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSaving}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#9ca3af] transition hover:bg-slate-100 hover:text-[#111827] disabled:opacity-60"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="space-y-5 px-6 py-5">
                {taskError && (
                  <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[12px] font-bold text-red-500">
                    {taskError}
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-[13px] font-extrabold text-[#475467]">
                    Для якої екосистеми?
                  </label>

                  <div className="relative">
                    <select
                      value={selectedAquariumId}
                      onChange={(event) =>
                        setSelectedAquariumId(event.target.value)
                      }
                      disabled={isAquariumsLoading || isSaving}
                      className="h-12 w-full appearance-none rounded-xl border border-[#d6dbe4] bg-white px-4 pr-10 text-[14px] font-bold text-[#111827] outline-none transition focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10 disabled:bg-slate-100"
                    >
                      <option value="">
                        {isAquariumsLoading
                          ? "Завантаження..."
                          : "Оберіть екосистему..."}
                      </option>

                      {aquariums.map((aquarium) => (
                        <option key={aquarium.id} value={aquarium.id}>
                          {getAquariumLabel(aquarium)}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={18}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#667085]"
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-[13px] font-extrabold text-[#475467]">
                    Швидкі шаблони
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {templates.map((template) => {
                      const Icon = template.icon;
                      const active = activeTemplate === template.value;

                      return (
                        <button
                          key={template.value}
                          type="button"
                          onClick={() => handleTemplateClick(template)}
                          disabled={isSaving}
                          className={`
                            inline-flex h-9 items-center gap-2 rounded-lg border px-3
                            text-[12px] font-extrabold transition
                            ${
                              active
                                ? "border-[#b9c4ff] bg-[#edf0ff] text-[#4f46e5]"
                                : "border-[#e3e9f2] bg-white text-[#667085] hover:bg-[#f8fafc]"
                            }
                          `}
                        >
                          <Icon size={15} />
                          {template.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[13px] font-extrabold text-[#475467]">
                    Що потрібно зробити?
                  </label>

                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    disabled={isSaving}
                    placeholder="Назва завдання"
                    className="mb-2 h-11 w-full rounded-xl border border-[#d6dbe4] px-4 text-[14px] font-bold text-[#111827] outline-none transition focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10 disabled:bg-slate-100"
                  />

                  <input
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    disabled={isSaving}
                    placeholder="Додаткові нотатки (опціонально)"
                    className="h-11 w-full rounded-xl border border-[#d6dbe4] px-4 text-[14px] font-semibold text-[#111827] outline-none transition placeholder:text-[#98a2b3] focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10 disabled:bg-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-[13px] font-extrabold text-[#475467]">
                      Дата виконання
                    </label>

                    <input
                      type="date"
                      value={dueDate}
                      onChange={(event) => setDueDate(event.target.value)}
                      disabled={isSaving}
                      className="h-11 w-full rounded-xl border border-[#d6dbe4] px-4 text-[14px] font-bold text-[#111827] outline-none transition focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10 disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[13px] font-extrabold text-[#475467]">
                      Повторювати
                    </label>

                    <div className="relative">
                      <select
                        value={repeat}
                        onChange={(event) => setRepeat(event.target.value)}
                        disabled={isSaving}
                        className="h-11 w-full appearance-none rounded-xl border border-[#d6dbe4] bg-white px-4 pr-9 text-[14px] font-bold text-[#111827] outline-none transition focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10 disabled:bg-slate-100"
                      >
                        {repeatOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>

                      <ChevronDown
                        size={17}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-[#eef0f4] bg-[#f8fafc] px-6 py-5">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSaving}
                  className="rounded-xl px-5 py-3 text-sm font-extrabold text-[#64748b] transition hover:bg-white disabled:opacity-60"
                >
                  Скасувати
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSaving || !selectedAquariumId}
                  className="rounded-xl bg-[#635bff] px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(91,76,246,0.24)] transition hover:bg-[#544cf0] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Збереження..." : "Зберегти завдання"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CreateTaskModal;