const { defaultDocgen } = require("tsolidity-docgen-dev");
const config = require("../../tsol-docgen-config");
const cleanOutput = require("./clean-up");
async function main() {
  await defaultDocgen(config);
  await cleanOutput(config.outputDir);
}

main();
