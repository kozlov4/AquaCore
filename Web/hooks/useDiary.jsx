"use client";

import { useCallback, useEffect, useState } from "react";
import { getAquariumNames } from "../services/aquariumsApi";
import {
  createDiaryEntry,
  deleteDiaryEntry,
  getDiaryEntries,
  getDiaryEntryById,
  updateDiaryEntry,
} from "../services/diaryApi";

export function useDiary() {
  const [entries, setEntries] = useState([]);
  const [aquariums, setAquariums] = useState([]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedAquariumId, setSelectedAquariumId] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");

  const [selectedEntry, setSelectedEntry] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [deletingEntry, setDeletingEntry] = useState(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isEntryLoading, setIsEntryLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [diaryError, setDiaryError] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);

    return () => clearTimeout(timeout);
  }, [search]);

  const loadAquariums = useCallback(async () => {
    try {
      const data = await getAquariumNames();
      setAquariums(data);
    } catch (error) {
      setAquariums([]);
      setDiaryError(error.message || "Не вдалося завантажити екосистеми");
    }
  }, []);

  const loadEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      setDiaryError("");

      const data = await getDiaryEntries({
        aquariumId: selectedAquariumId,
        tag: selectedTag,
        search: debouncedSearch,
      });

      setEntries(data);
    } catch (error) {
      setEntries([]);
      setDiaryError(error.message || "Помилка завантаження щоденника");
    } finally {
      setIsLoading(false);
    }
  }, [selectedAquariumId, selectedTag, debouncedSearch]);

  useEffect(() => {
    loadAquariums();
  }, [loadAquariums]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const openEntry = async (entry) => {
    try {
      setIsEntryLoading(true);
      setDiaryError("");

      const details = await getDiaryEntryById(entry.id);

      setSelectedEntry({
        ...entry,
        ...details,
      });
    } catch (error) {
      setDiaryError(error.message || "Не вдалося відкрити запис");
    } finally {
      setIsEntryLoading(false);
    }
  };

  const closeEntry = () => {
    setSelectedEntry(null);
  };

  const openCreateModal = () => {
    setEditingEntry(null);
    setSelectedEntry(null);
    setIsCreateOpen(true);
  };

  const openEditModal = (entry) => {
    setEditingEntry(entry);
    setSelectedEntry(null);
    setIsCreateOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateOpen(false);
    setEditingEntry(null);
  };

  const saveEntry = async (payload) => {
    try {
      setIsSaving(true);
      setDiaryError("");

      if (editingEntry?.id) {
        await updateDiaryEntry({
          id: editingEntry.id,
          ...payload,
        });
      } else {
        await createDiaryEntry(payload);
      }

      closeCreateModal();
      await loadEntries();
    } catch (error) {
      setDiaryError(error.message || "Не вдалося зберегти запис");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const askDeleteEntry = (entry) => {
    setDeletingEntry(entry);
  };

  const cancelDeleteEntry = () => {
    setDeletingEntry(null);
  };

  const confirmDeleteEntry = async () => {
    if (!deletingEntry?.id) return;

    try {
      setIsSaving(true);
      setDiaryError("");

      await deleteDiaryEntry(deletingEntry.id);

      setEntries((prev) =>
        prev.filter((entry) => entry.id !== deletingEntry.id)
      );

      setDeletingEntry(null);
      setSelectedEntry(null);

      await loadEntries();
    } catch (error) {
      setDiaryError(error.message || "Не вдалося видалити запис");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    entries,
    aquariums,

    search,
    setSearch,

    selectedAquariumId,
    setSelectedAquariumId,

    selectedTag,
    setSelectedTag,

    selectedEntry,
    editingEntry,
    deletingEntry,

    isCreateOpen,
    setIsCreateOpen,

    isLoading,
    isEntryLoading,
    isSaving,
    diaryError,

    loadEntries,

    openEntry,
    closeEntry,

    openCreateModal,
    openEditModal,
    closeCreateModal,
    saveEntry,

    askDeleteEntry,
    cancelDeleteEntry,
    confirmDeleteEntry,
  };
}