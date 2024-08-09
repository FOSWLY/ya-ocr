import { ofetch } from "ofetch";
import OCRClient from "../dist/client";

// https://github.com/unjs/ofetch
const client = new OCRClient({
  fetchFn: ofetch.native,
});

const response = await client.scanByUrl(
  "https://repository-images.githubusercontent.com/450906609/c04b600b-5f0f-488b-820d-ffaeb1fde2d0",
);

console.log(response);
