export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const formData = new URLSearchParams();

    formData.append("username", req.body.email);
    formData.append("password", req.body.password);

    const response = await fetch("https://aquacore.onrender.com/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const data = await response.json().catch(() => null);

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server proxy error",
    });
  }
}