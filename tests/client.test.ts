import path from "node:path";
import { test, expect } from "bun:test";

import OCRClient from "../src";

const client = new OCRClient();

test("scan by file", async () => {
  const res = await client.scanByFile(path.resolve(__dirname, "test.jpg"));
  expect(res.text.length).toBeGreaterThan(0);
});

test("scan by url", async () => {
  const res = await client.scanByUrl(
    "https://repository-images.githubusercontent.com/450906609/c04b600b-5f0f-488b-820d-ffaeb1fde2d0",
  );
  expect(res.text.length).toBeGreaterThan(0);
});

test("scan with translate", async () => {
  const translateClient = new OCRClient({
    withTranslate: true,
    translateLang: "ru",
  });
  const res = await translateClient.scanByFile(
    path.resolve(__dirname, "test.jpg"),
  );
  expect(res.translatedText!.length).toBeGreaterThan(0);
});
