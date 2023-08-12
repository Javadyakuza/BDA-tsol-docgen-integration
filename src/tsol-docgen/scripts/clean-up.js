const fs = require("fs");
const { join } = require("path");

module.exports = async function cleanOutput(outPutPath) {
  const distPath = join(outPutPath, "dist");
  const temp = join("docs/build", "temp");
  if (!fs.existsSync(distPath)) {
    throw new Error("No HTMLs generated !!");
  }
  fs.mkdirSync(temp, { recursive: true });
  moveFiles(distPath, temp);
  const files = fs.readdirSync(outPutPath);
  files.forEach(file => {
    const filePath = join(outPutPath, file);
    fs.rmSync(filePath, { recursive: true, force: true });
  });
  moveFiles(temp, outPutPath);
  fs.rmSync(temp, { recursive: true, force: true });
};
// Function to move files from source folder to destination folder
const moveFiles = (source, destination) => {
  const files = fs.readdirSync(source);
  files.forEach(file => {
    const sourceFile = join(source, file);
    const destFile = join(destination, file);
    fs.renameSync(sourceFile, destFile);
  });
};
