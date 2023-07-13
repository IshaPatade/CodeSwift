const { exec } = require("child_process");
const { error } = require("console");
const fs = require("fs");
const path = require("path");
const { stdout, stderr } = require("process");
const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}
const executeC = (filepath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.exe`);

  return new Promise((resolve, reject) => {
    exec(
      `gcc ${filepath} -o ${outPath} && cd ${outputPath} && ${jobId}.exe`,
      (error, stdout, stderr) => {
        error && reject({ error, stderr });
        stderr && reject(stderr);

        resolve(stdout);
      }
    );
  }).catch((error) => {
    console.log(error);
  });
};

module.exports = {
  executeC,
};
