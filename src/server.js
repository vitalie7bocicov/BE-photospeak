const express = require("express");
const getLabelsFromPhoto = require("./API/visionApi");
const translateText = require("./API/translationApi");
const synthesize = require("./API/textToSpeechApi");
const uploadPhoto = require("./API/functionApi");
const app = express();
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();
const upload = multer();
const bodyParser = require("body-parser");
const checkPronunciation = require("./API/speechToText");

app.use(cors());
app.use(express.json());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.post("/translate", async (req, res) => {
  const text = req.body.text;
  const labels = text.split(",");
  const language = req.body.language;

  for (let i = 0; i < labels.length; i++) {
    labels[i] = await translateText(labels[i], language);
  }

  res.send(labels);
});

app.post("/what-is", upload.single("photo"), async (req, res) => {
  let photo;
  try {
    photo = req.file.buffer;
  } catch (error) {
    res.statusCode = 400;
    res.send("photo is required");
    return;
  }

  const language = req.body.language;

  const labels = await getLabelsFromPhoto(photo);
  for (let i = 0; i < labels.length; i++) {
    labels[i] = await translateText(labels[i], language);
  }

  uploadPhoto(req, labels);
  res.send(labels);
});

app.get("/getUserPhoto", async (req, res) => {
  const username = { username: req.query?.username };

  fetch("https://us-central1-edik-317621.cloudfunctions.net/getUserPhotos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(username),
  })
    .then((r) => {
      return r.json();
    })
    .then((r) => {
      const msg = { message: "Sucesfully updated" };
      console.log(r);
      if (r.hasOwnProperty("message")) {
        res.send([]);
      } else {
        res.send(r);
      }
    });
});

<<<<<<< HEAD
app.listen(8081, 'localhost', ()=>{
    console.log("Server is listening on port 8081");
});
=======
app.get("/speech", async (req, res) => {
  const text = req.query.text;
  const language = req.query.lang;
  const audio = await synthesize(text, language);
  res.send(audio);
});

app.use(upload.none());

app.post("/speech", async (req, res) => {
  const text = req.body.text;
  const language = req.body.language;
  const speech = req.body.speech;
  const audioBuffer = Buffer.from(speech, "base64");
  const pronunciationOk = await checkPronunciation(text, language, audioBuffer);
  if (pronunciationOk) res.send("OK");
  else res.send("!OK");
});

app.listen(8080, "0.0.0.0", () => {
  console.log("Server is listening on port 8080");
});
>>>>>>> 2775cb2a7ce54f1b63fbf000b44afb6ae288ed6c
