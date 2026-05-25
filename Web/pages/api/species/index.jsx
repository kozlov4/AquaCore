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

function appendArrayParam(params, key, value) {
  if (!value) return;

  if (Array.isArray(value)) {
    value.forEach((item) => {
      if (item) {
        params.append(key, String(item));
      }
    });

    return;
  }

  params.append(key, String(value));
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

    const {
      search,
      category,
      water_type,
      character,
      maxVolume,
      maxSizes,
      careLevels,
      diets,
    } = req.query;

    const params = new URLSearchParams();

    if (search) {
      params.append("search", String(search));
    }

    if (category && category !== "all") {
      params.append("category", String(category));
    }

    if (water_type && water_type !== "all") {
      params.append("water_type", String(water_type));
    }

    if (character && character !== "all") {
      params.append("character", String(character));
    }

    if (maxVolume) {
      params.append("maxVolume", String(maxVolume));
    }

    appendArrayParam(params, "maxSizes", maxSizes);
    appendArrayParam(params, "careLevels", careLevels);
    appendArrayParam(params, "diets", diets);

    const backendUrl = `${API_URL}/species${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: token,
      },
    });

    const data = await readResponse(response);

    if (!response.ok) {
      console.error("Species backend error:", {
        status: response.status,
        url: backendUrl,
        data,
      });

      /*
        Важливо:
        Не повертаємо 500 у браузер, щоб консоль не засмічувалась.
        Frontend сам підставить fallbackSpecies, якщо відповідь не масив.
      */
      return res.status(200).json({
        __fallback: true,
        message: data?.message || data?.detail || "Species backend error",
        backendStatus: response.status,
      });
    }

    return res.status(200).json(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Species proxy error:", error);

    return res.status(200).json({
      __fallback: true,
      message: error.message || "Species proxy server error",
    });
  }
}