const API_URL = "https://aquacore.onrender.com";

async function readResponse(response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {
      message: text || "Empty response from backend",
    };
  }
}

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      res.setHeader("Allow", ["GET"]);

      return res.status(405).json({
        message: "Method not allowed",
      });
    }

    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "Authorization token is missing",
      });
    }

    const { target_type, search_text, category_tags } = req.query;

    const params = new URLSearchParams();

    if (target_type && target_type !== "null" && target_type !== "all") {
      params.append("target_type", String(target_type));
    }

    if (search_text && String(search_text).trim()) {
      params.append("search_text", String(search_text).trim());
    }

    if (category_tags) {
      const tags = Array.isArray(category_tags)
        ? category_tags
        : String(category_tags).split(",");

      tags
        .map((tag) => tag.trim())
        .filter(Boolean)
        .filter((tag) => tag !== "Всі" && tag !== "all")
        .forEach((tag) => {
          params.append("category_tags", tag);
        });
    }

    const response = await fetch(
      `${API_URL}/diseases${params.toString() ? `?${params.toString()}` : ""}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      }
    );

    const data = await readResponse(response);

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Diseases proxy error:", error);

    return res.status(500).json({
      message: error.message || "Diseases proxy server error",
    });
  }
}