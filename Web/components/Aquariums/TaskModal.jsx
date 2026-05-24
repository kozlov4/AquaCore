"use client";

import { useEffect, useState } from "react";
import { X, Droplets, Cog, FlaskConical, Leaf, Smile } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function todayInputDate() {
  return new Date().toISOString().slice(0, 10);
}

const templates = [
  {
    label: "Підміна води",
    icon: Droplets,
    title: "Підміна води 30%",
    task_type: "Підміна води",
    repeat_type: "Щотижня",
  },
  {
    label: "Обслуговування",
    icon: Cog,
    title: "Обслуговування фільтра",
    task_type: "Обслуговування",
    repeat_type: "Щомісяця",
  },
  {
    label: "Тести",
    icon: FlaskConical,
    title: "Перевірити параметри води",
    task_type: "Тести води",
    repeat_type: "Щотижня",
  },
  {
    label: "Рослини",
    icon: Leaf,
    title: "Догляд за рослинами",
    task_type: "Рослини",
    repeat_type: "Щотижня",
  },
  {
    label: "Власне",
    icon: Smile,
    title: "",
    task_type: "Власне завдання",
    repeat_type: "Не повторювати",
  },
];

const repeatOptions = [
  "Не повторювати",
  "Щодня",
  "Щотижня",
  "Щомісяця",
];

export function TaskModal({
  isOpen,
  aquarium,
  onClose,
  onSave,
  isSaving = false,
}) {
  const [formData, setFormData] = useState({
    title: "Підміна води 30%",
    notes: "",
    due_date: todayInputDate(),
    repeat_type: "Щотижня",
    task_type: "Підміна води",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage("");
      setFormData({
        title: "Підміна води 30%",
        notes: "",
        due_date: todayInputDate(),
        repeat_type: "Щотижня",
        task_type: "Підміна води",
      });
    }
  }, [isOpen]);

  const applyTemplate = (template) => {
    setFormData((prev) => ({
      ...prev,
      title: template.title,
      task_type: template.task_type,
      repeat_type: template.repeat_type,
    }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");

      if (!formData.title.trim()) {
        throw new Error("Введіть назву завдання");
      }

      if (!formData.due_date) {
        throw new Error("Оберіть дату виконання");
      }

      await onSave?.({
        aquarium_id: aquarium?.id || null,
        task_type: formData.task_type,
        title: formData.title.trim(),
        notes: formData.notes.trim(),
        due_date: formData.due_date,
        repeat_type: formData.repeat_type,
      });

      onClose?.();
    } catch (error) {
      setErrorMessage(error.message || "Не вдалося створити завдання");
    } finally {
      setIsSubmitting(false);
    }
  };

  const saving = isSubmitting || isSaving;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-black/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!saving) onClose?.();
            }}
          />

          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-6"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div
              className="w-full max-w-[560px] overflow-hidden rounded-[20px] bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-7 py-5">
                <h2 className="text-[22px] font-extrabold tracking-[-0.03em] text-[#111827]">
                  Нове завдання
                </h2>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-60"
                >
                  <X size={21} />
                </button>
              </div>

              <div className="px-7 py-6">
                {errorMessage && (
                  <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-500">
                    {errorMessage}
                  </div>
                )}

                <div className="mb-5">
                  <p className="mb-3 text-sm font-extrabold text-[#475467]">
                    Швидкі шаблони
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {templates.map((template) => {
                      const Icon = template.icon;
                      const isActive = formData.task_type === template.task_type;

                      return (
                        <button
                          key={template.label}
                          type="button"
                          onClick={() => applyTemplate(template)}
                          disabled={saving}
                          className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-bold transition ${
                            isActive
                              ? "border-[#bcd3ff] bg-[#eef5ff] text-[#2563eb]"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          } disabled:cursor-not-allowed disabled:opacity-60`}
                        >
                          <Icon size={16} />
                          {template.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-5">
                  <label className="mb-2 block text-sm font-extrabold text-[#475467]">
                    Що потрібно зробити?
                  </label>

                  <input
                    value={formData.title}
                    onChange={(event) => handleChange("title", event.target.value)}
                    disabled={saving}
                    placeholder="Наприклад: Підміна води 30%"
                    className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm font-semibold text-[#111827] outline-none transition focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10 disabled:bg-slate-100"
                  />

                  <input
                    value={formData.notes}
                    onChange={(event) => handleChange("notes", event.target.value)}
                    disabled={saving}
                    placeholder="Додаткові нотатки (опціонально)"
                    className="mt-3 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm font-medium text-[#111827] outline-none transition placeholder:text-slate-400 focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10 disabled:bg-slate-100"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-extrabold text-[#475467]">
                      Дата виконання
                    </label>

                    <input
                      type="date"
                      value={formData.due_date}
                      onChange={(event) =>
                        handleChange("due_date", event.target.value)
                      }
                      disabled={saving}
                      className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm font-semibold text-[#111827] outline-none transition focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10 disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-extrabold text-[#475467]">
                      Повторювати
                    </label>

                    <select
                      value={formData.repeat_type}
                      onChange={(event) =>
                        handleChange("repeat_type", event.target.value)
                      }
                      disabled={saving}
                      className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-[#111827] outline-none transition focus:border-[#5B4CF6] focus:ring-4 focus:ring-[#5B4CF6]/10 disabled:bg-slate-100"
                    >
                      {repeatOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 bg-[#f8fafc] px-7 py-5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="rounded-xl px-5 py-3 text-sm font-extrabold text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Скасувати
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-xl bg-[#5B4CF6] px-6 py-3 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(91,76,246,0.24)] transition hover:bg-[#4d3fe0] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? "Збереження..." : "Зберегти завдання"}
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