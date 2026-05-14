export async function registerUser({ name, email, password }) {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.detail?.[0]?.msg ||
        data?.detail ||
        data?.message ||
        "Помилка реєстрації"
    );
  }

  return data;
}

export async function loginUser({ email, password }) {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.detail?.[0]?.msg ||
        data?.detail ||
        data?.message ||
        "Невірний email або пароль"
    );
  }

  if (data?.access_token) {
    localStorage.setItem("access_token", data.access_token);
  }

  if (data?.refresh_token) {
    localStorage.setItem("refresh_token", data.refresh_token);
  }

  if (data?.token_type) {
    localStorage.setItem("token_type", data.token_type);
  }

  return data;
}