import OCRClient from "../dist/client";

// you should use your own gm_fetch implementation
// e.g. https://github.com/ilyhalight/voice-over-translation/blob/master/src/utils/utils.js
async function GM_fetch(url: string | Request | URL, opt = {}) {
  return await fetch(url, opt);
}

const client = new OCRClient({
  fetchFn: GM_fetch,
});

const response = await client.scanByUrl(
  "https://repository-images.githubusercontent.com/450906609/c04b600b-5f0f-488b-820d-ffaeb1fde2d0",
);

console.log(response);
