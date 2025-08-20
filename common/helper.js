const { app } = require("../config");
const { CustomError } = require("../src/middleware/error");
const G_API_KEY = app.G_API_KEY;

const translateMessage = (content, native_language) => {
  const prompt = `You are a translator. 
    Your task is to translate the following message into the target language. 
    Keep the meaning accurate and the style natural.

    Message: "${content}"
    Target Language: "${native_language}"

    Please provide only the translation without explanations.
    `;

  return fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${G_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  )
    .then((res) => {
      if (!res.ok) {
        throw new CustomError(`Gemini API error: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No translation found";
    })
    .catch((err) => {
      console.error("Error:", err);
      return "";
    });
};


module.exports=translateMessage