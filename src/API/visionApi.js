const vision = require("@google-cloud/vision");
const client = new vision.ImageAnnotatorClient({
  keyFilename: "./vital-api-key.json",
});

async function getLabelsFromPhoto(photo) {
  try {
    const result = await client.labelDetection(photo);
    const annotations = result[0].labelAnnotations;
    const labels = [];
    for (let i = 0; i < 5 && i < annotations.length; i++) {
      labels.push(annotations[i].description);
    }
    return labels;
  } catch (error) {
    console.log("ERROR IN getLabelsFromPhoto: " + error);
  }
}

module.exports = getLabelsFromPhoto;
