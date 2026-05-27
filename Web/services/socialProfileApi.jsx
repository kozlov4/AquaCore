import { apiFetch, apiJson } from "./apiClient";

function readImageId(data) {
  return (
    data?.id ??
    data?.image_id ??
    data?.imageId ??
    data?.image?.id ??
    data?.data?.id ??
    null
  );
}

function readImageUrl(data) {
  return (
    data?.image_url ??
    data?.url ??
    data?.cover_image_url ??
    data?.image?.image_url ??
    data?.data?.image_url ??
    null
  );
}

export async function getMyProfile() {
  return apiJson(
    "/api/social/users/me",
    {
      method: "GET",
    },
    "Не вдалося отримати профіль"
  );
}

export async function updateMyProfile(payload) {
  return apiJson(
    "/api/social/users/me",
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
    "Не вдалося оновити профіль"
  );
}

export async function changeMyPassword({
  oldPassword,
  newPassword,
  repeatNewPassword,
}) {
  return apiJson(
    "/api/social/users/me/password",
    {
      method: "PATCH",
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
        reply_new_password: repeatNewPassword,
      }),
    },
    "Не вдалося змінити пароль"
  );
}

export async function requestEmailChange(newEmail) {
  return apiJson(
    "/api/social/users/me/email-change-request",
    {
      method: "POST",
      body: JSON.stringify({
        new_email: newEmail,
      }),
    },
    "Не вдалося відправити лист підтвердження"
  );
}

export async function confirmEmailChange(code) {
  return apiJson(
    "/api/social/users/me/email-change-confirm",
    {
      method: "POST",
      body: JSON.stringify({
        code,
      }),
    },
    "Не вдалося підтвердити email"
  );
}

export async function uploadProfileImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiFetch("/api/upload-image", {
    method: "POST",
    body: formData,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.detail?.[0]?.msg ||
        data?.detail ||
        "Не вдалося завантажити фото"
    );
  }

  return {
    raw: data,
    imageId: readImageId(data),
    imageUrl: readImageUrl(data),
  };
}