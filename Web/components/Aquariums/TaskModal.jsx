"use client";

import { useEffect, useMemo, useState } from "react";
import {
  X,
  Droplets,
  Wrench,
  TestTube2,
  Leaf,
  Lightbulb,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createTask } from "../../services/tasksApi";

const templates = [
  {
    label: "Підміна води",
    taskType: "Підміна води",
    icon: Droplets,
    title: "Підміна води 30%",
  },
  {
    label: "Обслуговування",
    taskType: "Обслуговування",
    icon: Wrench,
    title: "Перевірити роботу фільтра",
  },
  {
    label: "Тести",
    taskType: "Тести води",
    icon: TestTube2,
    title: "Перевірити параметри води",
  },
  {
    label: "Рослини",
    taskType: "Рослини",
    icon: Leaf,
    title: "Підрізати рослини",
  },
  {
    label: "Власне",
    taskType: "Власне завдання",
    icon: Lightbulb,
    title: "",
  },
];

const repeatOptions = [
  "Не повторювати",
  "Щодня",
  "Щотижня",
  "Щомісяця",
];

function todayInputDate() {
  return new Date().toISOString().slice(0, 10);
}

export function TaskModal({ isOpen, onClose, aquarium, onCreated, onSave }) {
  const [activeTaskType, setActiveTaskType] = useState("Підміна води");
  const [title, setTitle] = useState("Підміна води 30%");
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState(todayInputDate());
  const [repeatType, setRepeatType] = useState("Щотижня");
  const [isSaving, setIsSaving] = useState(false);
  const [taskError, setTaskError] = useState("");

  const selectedTemplate = useMemo(() => {
    return (
      templates.find((template) => template.taskType === activeTaskType) ||
      templates[0]
    );
  }, [activeTaskType]);

  useEffect(() => {
    if (!isOpen) return;

    setActiveTaskType("Підміна води");
    setTitle("Підміна води 30%");
    setNotes("");
    setDueDate(todayInputDate());
    setRepeatType("Щотижня");
    setTaskError("");
    setIsSaving(false);
  }, [isOpen]);

  const handleTemplateClick = (template) => {
    setActiveTaskType(template.taskType);
    setTitle(template.title);
  };

  const handleClose = () => {
    if (isSaving) return;
    onClose?.();
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setTaskError("");

      if (!title.trim()) {
        throw new Error("Введіть назву завдання");
      }

      if (!dueDate) {
        throw new Error("Оберіть дату виконання");
      }

      const payload = {
        aquarium_id: aquarium?.id || null,
        task_type: selectedTemplate.taskType,
        title: title.trim(),
        notes: notes.trim(),
        due_date: dueDate,
        repeat_type: repeatType,
      };

      const createdTask = await createTask(payload);

      onCreated?.(createdTask);
      onSave?.(createdTask);
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
            className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-[520px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[24px] bg-white shadow-2xl"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#eef1f6] px-6 py-5">
              <div>
                <h2 className="text-xl font-black text-[#111827]">
                  Нове завдання
                </h2>

                {aquarium?.name && (
                  <p className="mt-1 text-sm font-semibold text-[#667085]">
                    Акваріум: {aquarium.name}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={isSaving}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-[#98a2b3] transition hover:bg-[#f4f6fb] hover:text-[#111827] disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5">
              {taskError && (
                <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                  {taskError}
                </div>
              )}

              <p className="mb-3 text-sm font-black text-[#344054]">
                Швидкі шаблони
              </p>

              <div className="mb-5 flex flex-wrap gap-2">
                {templates.map((template) => {
                  const Icon = template.icon;
                  const active = activeTaskType === template.taskType;

                  return (
                    <button
                      key={template.taskType}
                      type="button"
                      onClick={() => handleTemplateClick(template)}
                      disabled={isSaving}
                      className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-[12px] font-extrabold transition ${
                        active
                          ? "border-[#b9c4ff] bg-[#edf0ff] text-[#4f46e5]"
                          : "border-[#e3e9f2] bg-white text-[#667085] hover:bg-[#f8fafc]"
                      } disabled:opacity-60`}
                    >
                      <Icon size={15} />
                      {template.label}
                    </button>
                  );
                })}
              </div>

              <label className="mb-2 block text-sm font-black text-[#344054]">
                Що потрібно зробити?
              </label>

              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                disabled={isSaving}
                placeholder="Назва завдання"
                className="mb-3 h-11 w-full rounded-xl border border-[#d6dbe4] px-4 text-[14px] font-bold text-[#111827] outline-none transition placeholder:text-[#98a2b3] focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10 disabled:bg-slate-100"
              />

              <input
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                disabled={isSaving}
                placeholder="Додаткові нотатки (опціонально)"
                className="mb-5 h-11 w-full rounded-xl border border-[#d6dbe4] px-4 text-[14px] font-semibold text-[#111827] outline-none transition placeholder:text-[#98a2b3] focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10 disabled:bg-slate-100"
              />

              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-black text-[#344054]">
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
                  <label className="mb-2 block text-sm font-black text-[#344054]">
                    Повторювати
                  </label>

                  <select
                    value={repeatType}
                    onChange={(event) => setRepeatType(event.target.value)}
                    disabled={isSaving}
                    className="h-11 w-full rounded-xl border border-[#d6dbe4] bg-white px-4 text-[14px] font-bold text-[#111827] outline-none transition focus:border-[#635bff] focus:ring-4 focus:ring-[#635bff]/10 disabled:bg-slate-100"
                  >
                    {repeatOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSaving}
                  className="h-11 rounded-xl border border-[#e3e9f2] px-5 text-sm font-black text-[#475467] transition hover:bg-[#f8fafc] disabled:opacity-60"
                >
                  Скасувати
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="h-11 rounded-xl bg-[#635bff] px-5 text-sm font-black text-white shadow-[0_12px_26px_rgba(99,91,255,0.25)] transition hover:bg-[#544cf0] disabled:cursor-not-allowed disabled:opacity-70"
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

export default TaskModal;