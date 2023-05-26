require("dotenv").config();
const projectId = process.env.PROJECT_ID;
const { Translate } = require("@google-cloud/translate").v2;
const translate = new Translate({ keyFilename: "./vital-api-key.json" });

async function translateText(text, targetLanguage) {
  try {
    const [translation] = await translate.translate(text, targetLanguage);
    return translation;
  } catch (err) {
    console.error(`Error translating text "${text}": ${err}`);
    throw err;
  }
}

module.exports = translateText;
