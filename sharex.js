import clipboardy from "clipboardy";
import OCRClient from "./dist/client.js";

const sleep = (m) => new Promise((r) => setTimeout(r, m));

// https://github.com/dimdenGD/chrome-lens-ocr/blob/main/sharex.js
try {
  const args = process.argv.slice(2);

  const result = await new OCRClient().scanByFile(args[0]);
  console.log(result);
  clipboardy.writeSync(result.data.text);
} catch (e) {
  console.error("Error occurred:");
  console.error(e);
  await sleep(30000);
}
