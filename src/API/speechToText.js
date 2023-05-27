const speech = require("@google-cloud/speech");
const diacriticless = require("diacriticless");
const client = new speech.SpeechClient({
  keyFilename: "./vital-api-key.json",
});

const languageMapping = {
  en: "en-US",
  ro: "ro-RO",
  zh: "zh-CN",
  es: "es-ES",
  hi: "hi-IN",
  ar: "ar-EG",
  pt: "pt-BR",
  bn: "bn-IN",
  ru: "ru-RU",
  ja: "ja-JP",
  de: "de-DE",
  fr: "fr-FR",
};

async function checkPronunciation(text, language, speech) {
  const config = {
    languageCode: languageMapping[language],
  };

  const audio = {
    content: speech.toString("base64"),
  };

  const request = {
    audio: audio,
    config: config,
  };

  try {
    const [response] = await client.recognize(request);
    let transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");

    transcription = diacriticless(transcription.toLowerCase());
    text = diacriticless(text.toLowerCase());
    if (transcription === text) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error occurred during speech recognition:", error);
  }
}

module.exports = checkPronunciation;
