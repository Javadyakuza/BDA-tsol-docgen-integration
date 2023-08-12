const path = require("path");
const fs = require("fs");

/** @type import('solidity-docgen/dist/config').UserConfig */
module.exports = {
  name: "tip3",
  outputDir: `docs/build/tip3`,
  // templates: "src/tsol-docgen/docs/templates",
  templates: "node_modules/tip3/docs/templates", // using the tip3 templates
  sourcesDir: `node_modules/tip3/contracts`,
  exclude: ["tests"],
  pageExtension: ".adoc",
  pages: (_, file, config) => {
    // For each contract file, find the closest README.adoc and return its location as the output page path.
    const sourcesDir = path.resolve(config.root, config.sourcesDir);
    let dir = path.resolve(config.root, file.absolutePath);

    while (dir.startsWith(sourcesDir)) {
      dir = path.dirname(dir);
      if (fs.existsSync(path.join(dir, "README.adoc"))) {
        return path.relative(sourcesDir, dir) + config.pageExtension;
      }
    }
  },
};
