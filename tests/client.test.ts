import { test, expect } from "bun:test";

import OCRClient from "../src";

const client = new OCRClient();

test("get session", async () => {
  const session = await client.getSession();
  expect(session.status).toEqual("active");
});

test("scan by file", async () => {
  const res = await client.scanByFile("../tests/test.jpg");
  expect(res.status).toEqual(true);
});

test("scan by url", async () => {
  const res = await client.scanByUrl(
    "https://repository-images.githubusercontent.com/450906609/c04b600b-5f0f-488b-820d-ffaeb1fde2d0",
  );
  expect(res.status).toEqual(true);
});
