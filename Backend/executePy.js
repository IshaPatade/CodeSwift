const { exec } = require("child_process");
const { error } = require("console");
const { stdout, stderr } = require("process");
const { path } = require("path");

const executePy = (filepath) => {
  return new Promise((resolve, reject) => {
    exec(`python ${filepath} `, (error, stdout, stderr) => {
      // error && reject({ error, stderr });
      // stderr && reject(stderr);

      // resolve(stdout);

      if (error) {
        reject({ error, stderr });
      } else if (stderr) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  }).catch((error) => {
    console.log(error);
  });

  // return new Promise((resolve, reject) => {
  //   exec(`python ${filepath}`, (error, stdout, stderr) => {
  //     if (error) {
  //       reject({ error, stderr });
  //     } else if (stderr) {
  //       reject(stderr);
  //     } else {
  //       resolve(stdout);
  //     }
  //   });
  // });
};

module.exports = {
  executePy,
};
