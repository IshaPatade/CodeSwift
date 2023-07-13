const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { generateFile } = require("./generateFile");
const { executeC } = require("./executeC");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/run", async (req, res) => {
  const { language = "c", code } = req.body;
  console.log(language);

  if (!code) {
    return res.status(400).json({ success: false, error: "Empty code body" });
  }

  const filepath = await generateFile(language, code);

  const output = await executeC(filepath);

  res.send({ output });
});

app.listen(3000, () => {
  console.log("Listening on port 3000.");
});
