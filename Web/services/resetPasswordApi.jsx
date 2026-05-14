function getErrorMessage(data, fallbackMessage) {
  if (Array.isArray(data?.detail) && data.detail.length > 0) {
    return data.detail[0]?.msg || fallbackMessage;
  }

  if (typeof data?.detail === "string") {
    return data.detail;
  }

  if (typeof data?.message === "string") {
    return data.message;
  }

  return fallbackMessage;
}

export async function forgotPassword(email) {
  const response = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Не вдалося відправити код на пошту")
    );
  }

  return data;
}

export async function resetPassword({ email, code, newPassword }) {
  const response = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      code,
      new_password: newPassword,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Не вдалося змінити пароль")
    );
  }

  return data;
}