const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const Groq = require("groq-sdk");

dotenv.config();

const app = express();
const port = 45623;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(bodyParser.json());

app.post("/ask", async (req, res) => {
  const userQuestion = req.body.question;
  const history = req.body.history || [];

  if (!userQuestion) {
    return res.status(400).json({ error: "Pertanyaan nggak boleh kosong ya bestie! 😅" });
  }

  try {
    // System prompt tetap ada di awal
    const messages = [
      {
        role: "system",
        content: `
Hai bestie! Aku chatbot sahabat kamu yang selalu siap ngobrol santai dan asik. Aku suka basa-basi, candaan receh, dan ngobrol apa aja yang seru, tapi khususnya tentang dunia K-Pop ya! Jadi kalo kamu mau curhat, cerita, atau tanya soal K-Pop dari grup Korea yang lama sampai yang baru (2010 sampai sekarang), profil bias favorit kamu, update event terbaru, sampai berita terkini, aku siap banget bantuin! ✨

Temukan info lengkap seputar K-Pop dari profil bias, update event, hingga berita terkini. Satu aplikasi buat semua kebutuhan K-Pop kamu!

Tapi inget ya, kita batasi obrolan supaya tetap positif dan nyambung ke K-Pop aja, ya. Gak boleh bahas hal yang negatif, 18+, atau hal yang gak sopan. Aku bakal jawab dengan gaya anak medsos Gen Z yang santai, campur bahasa Indonesia dan bahasa informal, plus sisip emoji biar makin seru dan gak kaku! 🫶💜

Jadi, yuk mulai ngobrol! Apa yang mau kamu tanyain atau ceritain tentang K-Pop hari ini?
        `.trim(),
      },
      ...history, // masukkan riwayat percakapan user dan assistant
      {
        role: "user",
        content: userQuestion,
      },
    ];

    const completion = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
    });

    const answer = completion.choices[0]?.message?.content || "Maaf yaa, aku belum bisa jawab itu 😅";
    res.json({ answer });
  } catch (error) {
    console.error("❌ Error:", error.message);
    const fallbackResponses = [
      "Yah, error nih 😭 Sabar ya, coba lagi bentar~ 💪",
      "Aku lagi nge-freeze kayak laptop kentang 😅",
      "Waduh, sistemnya kayak hati—nggak bisa diprediksi 😢",
      "Error nih, tapi kamu jangan ikutan down ya 🤗",
    ];
    const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    res.status(500).json({ error: randomFallback });
  }
});

app.get("/", (req, res) => {
  res.send("✅ ChatBot API is running. Use POST /ask with { question: '...', history: [...] } ✨");
});

app.listen(port, () => {
  console.log(`🚀 Server ChatBot berjalan di http://localhost:${port} 💃🕺`);
});
