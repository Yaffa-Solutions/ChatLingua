const { app } = require('../config');
const { CustomError } = require('../src/middleware/error');
const G_API_KEY = app.G_API_KEY;

const modelCandidates = ['gemini-3.5-flash', 'gemini-3.8-flash','gemini-3.5-flash-lite','gemini-3.1-flash-lite','gemini-3.6-flash'];

const sanitizeTranslation = (text = '') => {
  return text
    .replace(/```(?:[^\n]*)?\n?/g, '')
    .replace(/^\s*(?:translation|translated text)\s*:\s*/i, '')
    .trim()
    .replace(/^["'“”`]+|["'“”`]+$/g, '')
    .trim();
};

const translateMessage = async (content, sourceLanguage, targetLanguage) => {
  if (!G_API_KEY) {
    throw new CustomError('G_API_KEY is not configured', 500);
  }

  const prompt = `Translate the user's text from ${sourceLanguage} to ${targetLanguage}.
The source and target languages are different. Do not repeat or return the source text unchanged; translate its meaning into the target language.
Return only the translated text. Do not add labels, explanations, quotes, or markdown.`;

  let lastError;

  for (const model of modelCandidates) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${G_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: prompt }] },
            contents: [{ role: 'user', parts: [{ text: content }] }],
            generationConfig: { temperature: 0.2 },
          }),
        },
      );

      if (!res.ok) {
        if (res.status === 503) {
          throw new CustomError(
            'Translation is temporarily unavailable. Please try again later.',
            503,
          );
        }

        const errorText = await res.text();
        const message = errorText || `Gemini API error: ${res.status}`;
        lastError = new CustomError(
          `Gemini API error for ${model}: ${message}`,
          502,
        );
        continue;
      }

      const data = await res.json();
      const text =
        data?.candidates?.[0]?.content?.parts
          ?.map((part) => part.text || '')
          .join('') || '';
      const translation = sanitizeTranslation(text);
      const normalizedOriginal = content.trim().toLocaleLowerCase();
      const normalizedTranslation = translation.toLocaleLowerCase();

      if (
        translation &&
        normalizedTranslation !== normalizedOriginal
      ) {
        return translation;
      }

      lastError = new CustomError(
        `Gemini returned unchanged text for ${sourceLanguage} to ${targetLanguage}`,
        502,
      );
    } catch (err) {
      if (err.status === 503) throw err;
      lastError = err;
    }
  }

  if (lastError) {
    throw lastError;
  }

  throw new CustomError('Translation service unavailable', 502);
};

module.exports = translateMessage;
