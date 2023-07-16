const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const { generateFile } = require("./generateFile");
const { executeC } = require("./executeC");
const { executePy } = require("./executePy");
const Job = require("./models/job");

mongoose
  .connect("mongodb://127.0.0.1:27017/compilerapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // usefindandmodify: false,
  })
  .then(() => {
    console.log("connected successfully");
  })
  .catch((error) => console.log(error));

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/status", async (req, res) => {
  const jobId = req.query.id;
  console.log("status requested", jobId);
  if (jobId == undefined) {
    return res
      .status(400)
      .json({ success: false, error: "missing id query param" });
  }

  try {
    const job = await Job.findById(jobId);

    if (job === undefined) {
      return res.status(404).json({ success: false, error: "invalid job id" });
    }

    return res.status(200).json({ success: true, job });
  } catch (err) {
    return res.status(400).json({ success: false, error: JSON.stringify(err) });
  }
});

app.post("/run", async (req, res) => {
  const { language, code } = req.body;
  let job;
  // console.log(language);

  if (!code) {
    return res.status(400).json({ success: false, error: "Empty code body" });
  }

  try {
    const filepath = await generateFile(language, code);

    job = await new Job({ language, filepath }).save();
    const jobId = job["_id"];
    console.log(job);
    res.status(201).json({ success: true, jobId });

    let output;

    job["startedAt"] = new Date();
    if (language === "c") {
      output = await executeC(filepath);
    } else {
      output = await executePy(filepath);
    }

    job["completedAt"] = new Date();
    job["status"] = "success";
    job["output"] = output;

    await job.save();

    console.log(job);
  } catch (err) {
    console.log(err);
    job["completedAt"] = new Date();
    job["status"] = "error";
    job["output"] = JSON.stringify(err);
    await job.save();
    console.log(job);
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000.");
});
