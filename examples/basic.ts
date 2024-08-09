import OCRClient from "../dist/client";

const client = new OCRClient();

// by link
let response = await client.scanByUrl(
  "https://repository-images.githubusercontent.com/450906609/c04b600b-5f0f-488b-820d-ffaeb1fde2d0",
);

console.log(response);

// by file
response = await client.scanByFile("../tests/test.jpg");

console.log(response);
