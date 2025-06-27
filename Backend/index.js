const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

require("dotenv").config(); // agar bisa pakai .env saat local

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

app.post("/ask", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt tidak boleh kosong." });
  }

  try {
    const result = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Kamu adalah Edgar, asisten AI pribadi milik Fhrrzz. Jawablah dengan ramah dan profesional.\n\nPertanyaan: ${prompt}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await result.json();

    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .join("\n") || "Tidak ada balasan.";

    res.json({ reply });
  } catch (err) {
    console.error("Error:", err.message || err);
    res.status(500).json({ error: "Terjadi kesalahan saat memproses permintaan." });
  }
});

app.get("/", (req, res) => {
  res.send("API Gemini Edgar Aktif 🚀");
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
