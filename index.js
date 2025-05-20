// kpop-api.js
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
const port = 3000;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(bodyParser.json());

app.post("/ask", async (req, res) => {
  const userQuestion = req.body.question;

  if (!userQuestion) {
    return res.status(400).json({ error: "Pertanyaan tidak boleh kosong." });
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Kamu adalah asisten ahli tentang K-Pop. Jawab hanya tentang K-Pop dengan bahasa santai.",
        },
        {
          role: "user",
          content: userQuestion,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const answer = completion.choices[0]?.message?.content || "Tidak ada jawaban.";
    res.json({ answer });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: "Terjadi kesalahan saat memproses jawaban." });
  }
});

app.get("/", (req, res) => {
  res.send("✅ K-Pop ChatBot API is running. Use POST /ask");
});

app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});
