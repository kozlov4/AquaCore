function getErrorMessage(data, fallbackMessage) {
  if (Array.isArray(data?.detail) && data.detail.length > 0) {
    return data.detail
      .map((item) => item?.msg || JSON.stringify(item))
      .join("; ");
  }

  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.message === "string") return data.message;
  if (typeof data?.error === "string") return data.error;

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

function extractImageId(data) {
  return (
    data?.id ||
    data?.image_id ||
    data?.imageId ||
    data?.image?.id ||
    data?.data?.id ||
    data?.data?.image_id ||
    null
  );
}

async function uploadArticleCover(file) {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload-image", {
    method: "POST",
    headers: {
      ...authHeaders(),
    },
    body: formData,
  });

  const data = await response.json().catch(() => null);

  console.log("UPLOAD ARTICLE COVER FRONTEND:", {
    status: response.status,
    data,
  });

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося завантажити обкладинку"));
  }

  const imageId = extractImageId(data);

  if (!imageId) {
    throw new Error("Backend не повернув image_id після завантаження обкладинки");
  }

  return imageId;
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
    slug: item.slug || item.name || String(item.id || ""),
    raw: item,
  };
}

/**
 * Backend приймає НЕ англійські ключі, а enum українською:
 * - "Всі статті"
 * - "Офіційні"
 * - "Спіьнота"   ← саме так написано на backend
 * - "Мої статті"
 *
 * Тому всі frontend-значення переводимо тут.
 */
function normalizeTargetType(targetType) {
  const value = String(targetType || "all").trim();

  const targetTypesMap = {
    all: "Всі статті",
    official: "Офіційні",
    community: "Спіьнота",
    mine: "Мої статті",

    "Всі статті": "Всі статті",
    Офіційні: "Офіційні",

    // підтримка двох варіантів, але на backend відправляємо саме "Спіьнота"
    Спільнота: "Спіьнота",
    Спіьнота: "Спіьнота",

    "Мої статті": "Мої статті",
  };

  return targetTypesMap[value] || "Всі статті";
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
    item.author || item.user || item.author_name || item.authorName || null;

  const authorName =
    typeof rawAuthor === "object" && rawAuthor !== null
      ? rawAuthor.name || rawAuthor.username || rawAuthor.email || "Автор"
      : rawAuthor || "Автор";

  const content = item.content || item.body || item.text || "";
  const excerpt =
    item.excerpt ||
    item.description ||
    item.preview ||
    String(content || "").slice(0, 180);

  const coverImageUrl =
    item.cover_url ||
    item.coverUrl ||
    item.cover_image_url ||
    item.coverImageUrl ||
    item.image_url ||
    item.imageUrl ||
    item.avatar_url ||
    item.photo_url ||
    item.image?.url ||
    item.image?.image_url ||
    item.image?.cover_url ||
    item.raw?.cover_url ||
    item.raw?.cover_image_url ||
    "";

  return {
    id: item.id || item.article_id,

    title: item.title || "Без назви",
    subtitle: item.subtitle || item.description || "",
    content,
    excerpt,

    category: String(categoryName),
    categoryId,

    imageId:
      item.image_id ||
      item.imageId ||
      item.image?.id ||
      item.raw?.image_id ||
      null,

    coverImageUrl,

    authorName: String(authorName),
    authorAvatar:
      item.author_avatar ||
      item.authorAvatar ||
      (typeof rawAuthor === "object" && rawAuthor !== null
        ? rawAuthor.avatar || rawAuthor.image_url || ""
        : ""),

    views: item.views || item.views_count || item.reads || item.reading_time_minutes || 0,

    status: item.status || (item.is_draft ? "draft" : "published"),
    isOfficial: Boolean(item.is_official || item.official),
    isMine: Boolean(item.is_mine || item.is_author || item.mine),
    isDraft: Boolean(
      item.is_draft ||
        item.status === "draft" ||
        item.status === "чернетка" ||
        item.status === "Чернетка"
    ),

    createdAt: item.created_at || item.createdAt || item.published_at || "",
    updatedAt: item.updated_at || item.updatedAt || "",
    dateLabel: formatDate(
      item.created_at || item.createdAt || item.published_at || item.updated_at
    ),

    raw: item,
  };
}

async function buildArticlePayload(payload) {
  const title = String(payload.title || "").trim();
  const content = String(payload.content || "").trim();
  const excerpt =
    String(payload.excerpt || payload.subtitle || "").trim() ||
    content.slice(0, 180);

  const rawCategoryId =
    payload.category_id || payload.categoryId || payload.category;

  const categoryIdNumber = Number(rawCategoryId);

  if (!rawCategoryId || Number.isNaN(categoryIdNumber)) {
    throw new Error("Оберіть коректну рубрику статті");
  }

  let imageId =
    payload.image_id ||
    payload.imageId ||
    payload.coverImageId ||
    payload.existingImageId ||
    null;

  if (payload.coverFile) {
    imageId = await uploadArticleCover(payload.coverFile);
  }

  if (!imageId) {
    throw new Error("Додайте обкладинку статті");
  }

  const cleanPayload = {
    title,
    excerpt,
    content,
    category_id: categoryIdNumber,
    image_id: Number(imageId),
  };

  console.log("ARTICLE PAYLOAD READY:", cleanPayload);

  return cleanPayload;
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

export async function getArticles({
  search = "",
  category = "all",
  targetType = "all",
} = {}) {
  const params = new URLSearchParams();

  const searchValue = String(search || "").trim();

  if (searchValue) {
    params.append("search_text", searchValue);
  }

  if (category && category !== "all") {
    params.append("category_ids", String(category));
  }

  const backendTargetType = normalizeTargetType(targetType);

  /**
   * Для "Всі статті" можна не передавати target_type,
   * бо backend має default = "Всі статті".
   */
  if (backendTargetType && backendTargetType !== "Всі статті") {
    params.append("target_type", backendTargetType);
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

  if (!Array.isArray(data)) {
    return [];
  }

  const normalizedDrafts = data.map((item) =>
    normalizeArticle({
      ...item,
      is_draft: true,
      status: "draft",
    })
  );

  const detailedDrafts = await Promise.all(
    normalizedDrafts.map(async (draft) => {
      try {
        if (!draft.id) return draft;

        const fullDraft = await getArticle(draft.id);

        return normalizeArticle({
          ...draft,
          ...fullDraft,
          id: draft.id,
          is_draft: true,
          status: "draft",
          category: fullDraft.category || draft.category,
          category_id: fullDraft.categoryId || draft.categoryId,
          cover_url: fullDraft.coverImageUrl || draft.coverImageUrl,
          cover_image_url: fullDraft.coverImageUrl || draft.coverImageUrl,
          image_id: fullDraft.imageId || draft.imageId,
        });
      } catch {
        return draft;
      }
    })
  );

  return detailedDrafts;
}

/**
 * Зручна функція для вкладок сторінки /articles.
 * Якщо активна вкладка "drafts", використовуємо окремий endpoint:
 * GET /articles/draft
 */
export async function getArticlesByTab({
  tab = "all",
  search = "",
  category = "all",
} = {}) {
  if (tab === "drafts" || tab === "draft") {
    return getDraftArticles();
  }

  return getArticles({
    search,
    category,
    targetType: tab,
  });
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
  const cleanPayload = await buildArticlePayload(payload);

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

  console.log("CREATE ARTICLE FRONTEND:", {
    status: response.status,
    sentPayload: cleanPayload,
    data,
  });

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося опублікувати статтю"));
  }

  return normalizeArticle({
    ...data,
    image_id: data?.image_id || cleanPayload.image_id,
    category_id: data?.category_id || cleanPayload.category_id,
    title: data?.title || cleanPayload.title,
    excerpt: data?.excerpt || cleanPayload.excerpt,
    content: data?.content || cleanPayload.content,
    is_draft: false,
    status: "published",
    is_mine: true,
  });
}

export async function createDraftArticle(payload) {
  const cleanPayload = await buildArticlePayload(payload);

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

  console.log("CREATE DRAFT ARTICLE FRONTEND:", {
    status: response.status,
    sentPayload: cleanPayload,
    data,
  });

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося зберегти чернетку"));
  }

  return normalizeArticle(data);
}

export async function updateArticle(articleId, payload) {
  if (!articleId) {
    throw new Error("Article id is required");
  }

  const cleanPayload = await buildArticlePayload(payload);

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