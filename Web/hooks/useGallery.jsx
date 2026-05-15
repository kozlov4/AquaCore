"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createGalleryPost,
  deleteGalleryPhoto,
  getGalleryPhotoById,
  getGalleryPhotos,
  updateGalleryPhoto,
  uploadImage,
} from "../services/galleryApi";
import { getAquariumNames } from "../services/aquariumsApi";

export function useGallery() {
  const [photos, setPhotos] = useState([]);
  const [aquariums, setAquariums] = useState([]);

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const [selectedAquariumName, setSelectedAquariumName] =
    useState("Усі акваріуми");
  const [selectedCategory, setSelectedCategory] = useState("Всі фотографії");
  const [sortOrder, setSortOrder] = useState("newest");

  const [isLoading, setIsLoading] = useState(false);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [galleryError, setGalleryError] = useState("");

  const loadAquariums = useCallback(async () => {
    try {
      setGalleryError("");

      const data = await getAquariumNames();

      setAquariums(data);
    } catch (error) {
      setAquariums([]);
      setGalleryError(error.message || "Помилка завантаження акваріумів");
    }
  }, []);

  const loadPhotos = useCallback(async () => {
    try {
      setIsLoading(true);
      setGalleryError("");

      const data = await getGalleryPhotos({
        category: selectedCategory,
        aquariumName: selectedAquariumName,
        sortOrder,
      });

      setPhotos(data);
    } catch (error) {
      setPhotos([]);
      setGalleryError(error.message || "Помилка завантаження галереї");
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, selectedAquariumName, sortOrder]);

  useEffect(() => {
    loadAquariums();
  }, [loadAquariums]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const openPhoto = async (photo) => {
    try {
      setIsPhotoLoading(true);
      setGalleryError("");

      const details = await getGalleryPhotoById(photo.id);

      setSelectedPhoto({
        ...photo,
        ...details,
      });
    } catch (error) {
      setGalleryError(error.message || "Помилка відкриття фото");
    } finally {
      setIsPhotoLoading(false);
    }
  };

  const closePhoto = () => {
    setSelectedPhoto(null);
  };

  const handleSavePhoto = async ({ file, aquariumId, category, caption }) => {
    try {
      setIsUploading(true);
      setGalleryError("");

      if (!file) {
        throw new Error("Оберіть файл");
      }

      if (!aquariumId) {
        throw new Error("Оберіть акваріум");
      }

      const uploaded = await uploadImage(file);

      const imageId =
        uploaded?.id ||
        uploaded?.image_id ||
        uploaded?.image?.id ||
        uploaded?.data?.id;

      if (!imageId) {
        throw new Error("Backend не повернув image_id після завантаження");
      }

      await createGalleryPost({
        signature: caption || null,
        category,
        createdAt: new Date().toISOString(),
        aquariumId,
        imageId,
      });

      setIsUploadOpen(false);
      await loadPhotos();
    } catch (error) {
      setGalleryError(error.message || "Не вдалося зберегти фото");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      setGalleryError("");

      await deleteGalleryPhoto(photoId);

      setSelectedPhoto(null);
      setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
    } catch (error) {
      setGalleryError(error.message || "Не вдалося видалити фото");
    }
  };

  const handleUpdatePhotoCaption = async (photoId, caption) => {
    try {
      setGalleryError("");

      const updated = await updateGalleryPhoto(photoId, caption);

      setSelectedPhoto(updated);

      setPhotos((prev) =>
        prev.map((photo) =>
          photo.id === photoId
            ? {
                ...photo,
                caption: updated.caption,
                aquarium: updated.aquarium,
                image: updated.image,
              }
            : photo
        )
      );
    } catch (error) {
      setGalleryError(error.message || "Не вдалося оновити опис");
    }
  };

  return {
    photos,
    aquariums,

    selectedPhoto,
    setSelectedPhoto,

    isUploadOpen,
    setIsUploadOpen,

    selectedAquariumName,
    setSelectedAquariumName,

    selectedCategory,
    setSelectedCategory,

    sortOrder,
    setSortOrder,

    isLoading,
    isPhotoLoading,
    isUploading,

    galleryError,

    loadPhotos,
    loadAquariums,

    openPhoto,
    closePhoto,
    handleSavePhoto,
    handleDeletePhoto,
    handleUpdatePhotoCaption,
  };
}