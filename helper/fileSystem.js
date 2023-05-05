const { promises: Fs } = require("fs");
const mv = require("mv");
const fs = require("fs");
const path = require("path");
const { UPLOAD_BASE_PATH, TMP_UPLOAD_PATH } = require("./constants");

const fileExists = async (path) => {
  try {
    await Fs.access(path);
    return true;
  } catch {
    return false;
  }
};

const moveFile = async (targetFile, destFile, existingFile = "") => {
  return new Promise(async (resolve, reject) => {
    try {
      if (existingFile && existingFile != "") {
        const prevFile = `${UPLOAD_BASE_PATH}/${existingFile}`;
        const fileExist = await fileExists(prevFile);
        if (fileExist) {
          fs.unlinkSync(prevFile);
        }
      }

      await mv(
        `${TMP_UPLOAD_PATH}/${targetFile}`,
        `${UPLOAD_BASE_PATH}/${destFile}`,
        { mkdirp: true },
        function (err) {
          console.log(err);
        }
      );
      resolve(`${UPLOAD_BASE_PATH}/${destFile}`);
    } catch (e) {
      console.log("Error caught : ", e);
      reject(e.message);
    }
  });
};

const removeFile = async (existingFile) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (existingFile && existingFile != "") {
        const prevFile = `${UPLOAD_BASE_PATH}/${existingFile}`;
        const fileExist = await fileExists(prevFile);
        if (fileExist) {
          fs.unlinkSync(prevFile);
        }
      }
      resolve(true);
    } catch (e) {
      reject(e.message);
    }
  });
};

module.exports = {
  moveFile,
  fileExists,
  removeFile,
};
