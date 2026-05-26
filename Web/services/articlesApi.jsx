function getErrorMessage(data, fallbackMessage) {
  if (Array.isArray(data?.detail) && data.detail.length > 0) {
    return data.detail[0]?.msg || fallbackMessage;
  }

  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.message === "string") return data.message;

  return fallbackMessage;
}

function getToken() {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token")
  );
}

function authHeaders() {
  const token = getToken();

  if (!token) {
    throw new Error("Потрібно увійти в акаунт");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function normalizeCategory(item) {
  if (typeof item === "string") {
    return {
      id: item,
      name: item,
      slug: item,
    };
  }

  return {
    id: item.id || item.category_id || item.slug || item.name,
    name: item.name || item.title || item.slug || "Категорія",
    slug: item.slug || item.name || item.id,
  };
}

export function normalizeArticle(item) {
  const rawCategory =
    item.category ||
    item.category_name ||
    item.category_title ||
    item.rubric ||
    item.category_obj ||
    null;

  const categoryName =
    typeof rawCategory === "object" && rawCategory !== null
      ? rawCategory.name || rawCategory.title || "Без рубрики"
      : rawCategory || "Без рубрики";

  const categoryId =
    item.category_id ||
    item.categoryId ||
    (typeof rawCategory === "object" && rawCategory !== null
      ? rawCategory.id || rawCategory.slug || rawCategory.name
      : rawCategory) ||
    "";

  const rawAuthor =
    item.author ||
    item.user ||
    item.author_name ||
    item.authorName ||
    null;

  const authorName =
    typeof rawAuthor === "object" && rawAuthor !== null
      ? rawAuthor.name || rawAuthor.username || rawAuthor.email || "Автор"
      : rawAuthor || "Автор";

  return {
    id: item.id || item.article_id,
    title: item.title || "Без назви",
    subtitle: item.subtitle || item.description || "",
    content: item.content || item.body || item.text || "",
    excerpt:
      item.excerpt ||
      item.description ||
      item.preview ||
      String(item.content || item.body || item.text || "").slice(0, 180),

    category: String(categoryName),
    categoryId,

    imageId: item.image_id || item.imageId || null,
    coverImageUrl:
      item.cover_image_url ||
      item.coverImageUrl ||
      item.image_url ||
      item.imageUrl ||
      "",

    authorName: String(authorName),
    authorAvatar:
      item.author_avatar ||
      item.authorAvatar ||
      (typeof rawAuthor === "object" && rawAuthor !== null
        ? rawAuthor.avatar || rawAuthor.image_url || ""
        : ""),

    views: item.views || item.views_count || item.reads || 0,
    status: item.status || (item.is_draft ? "draft" : "published"),
    isOfficial: Boolean(item.is_official || item.official),
    isMine: Boolean(item.is_mine || item.is_author || item.mine),
    isDraft: Boolean(item.is_draft || item.status === "draft"),
    createdAt: item.created_at || item.createdAt || item.published_at || "",
    updatedAt: item.updated_at || item.updatedAt || "",
    dateLabel: formatDate(
      item.created_at || item.createdAt || item.published_at || item.updated_at
    ),
    raw: item,
  };
}

function buildArticlePayload(payload) {
  const title = String(payload.title || "").trim();
  const subtitle = String(payload.subtitle || "").trim();
  const content = String(payload.content || "").trim();

  const excerpt =
    String(payload.excerpt || "").trim() || subtitle || content.slice(0, 180);

  const categoryId = Number(
    payload.category_id || payload.categoryId || payload.category
  );

  const imageId = Number(
    payload.image_id || payload.imageId || payload.coverImageId || 1
  );

  return {
    title,
    excerpt,
    content,
    category_id: categoryId,
    image_id: imageId,
  };
}

export async function getArticleCategories() {
  const response = await fetch("/api/articles/categories", {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося завантажити категорії"));
  }

  return Array.isArray(data) ? data.map(normalizeCategory) : [];
}

export async function getArticles({ search = "", category = "all" } = {}) {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.append("search", search.trim());
  }

  if (category && category !== "all") {
    params.append("category", category);
  }

  const queryString = params.toString();

  const response = await fetch(
    `/api/articles${queryString ? `?${queryString}` : ""}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...authHeaders(),
      },
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося завантажити статті"));
  }

  return Array.isArray(data) ? data.map(normalizeArticle) : [];
}

export async function getDraftArticles() {
  const response = await fetch("/api/articles/draft", {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося завантажити чернетки"));
  }

  return Array.isArray(data) ? data.map(normalizeArticle) : [];
}

export async function getArticle(articleId) {
  if (!articleId) {
    throw new Error("Article id is required");
  }

  const response = await fetch(`/api/articles/${encodeURIComponent(articleId)}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося відкрити статтю"));
  }

  return normalizeArticle({
    id: articleId,
    ...data,
  });
}

export async function createArticle(payload) {
  const cleanPayload = buildArticlePayload(payload);

  const response = await fetch("/api/articles", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(cleanPayload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося опублікувати статтю"));
  }

  return normalizeArticle(data);
}

export async function createDraftArticle(payload) {
  const cleanPayload = buildArticlePayload(payload);

  const response = await fetch("/api/articles/draft", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(cleanPayload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося зберегти чернетку"));
  }

  return normalizeArticle(data);
}

export async function updateArticle(articleId, payload) {
  if (!articleId) {
    throw new Error("Article id is required");
  }

  const cleanPayload = buildArticlePayload(payload);

  const response = await fetch(`/api/articles/${encodeURIComponent(articleId)}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(cleanPayload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося оновити статтю"));
  }

  return normalizeArticle({
    id: articleId,
    ...data,
  });
}

export async function deleteArticle(articleId) {
  if (!articleId) {
    throw new Error("Article id is required");
  }

  const response = await fetch(`/api/articles/${encodeURIComponent(articleId)}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      ...authHeaders(),
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(getErrorMessage(data, "Не вдалося видалити статтю"));
  }

  return true;
}