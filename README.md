# ya-ocr

[![GitHub Actions](https://github.com/FOSWLY/ya-ocr/actions/workflows/ci.yml/badge.svg)](https://github.com/FOSWLY/ya-ocr/actions/workflows/ci.yml)
[![npm](https://img.shields.io/bundlejs/size/ya-ocr)](https://www.npmjs.com/package/ya-ocr)
[![ru](https://img.shields.io/badge/%D1%8F%D0%B7%D1%8B%D0%BA-%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9%20%F0%9F%87%B7%F0%9F%87%BA-white)](README-RU.md)
[![en](https://img.shields.io/badge/lang-English%20%F0%9F%87%AC%F0%9F%87%A7-white)](README.md)

An unofficial library to use Yandex OCR for free via Translation API, which supports working with JavaScript, TypeScript, and also has built-in parted types for Typebox.

## Installation

Installation for Bun:

```bash
bun add ya-ocr
```

Installation for NPM:

```bash
npm install ya-ocr
```

## Getting started

To start working with the API, you need to create a OCR Client. This can be done using the line provided below.

```ts
const client = new OCRClient();

const result = await client.scanByUrl(
  "https://repository-images.githubusercontent.com/450906609/c04b600b-5f0f-488b-820d-ffaeb1fde2d0",
);
```

You can see more code examples [here](https://github.com/FOSWLY/ya-ocr/tree/main/examples)

## Build

To build, you must have:

- [Bun](https://bun.sh/)

Don't forget to install the dependencies:

```bash
bun install
```

#### Regular Build

Building the entire package:

```bash
bun build:bun
```

#### Building TypeScript types

You can use this build option if you only want to build types for TypeScript:

```bash
bun build:declaration
```

#### Building a TypeBox of Types

You can use this build option if you only want to build types for TypeBox:

```bash
bun build:typebox
```

## Tests

The library has minimal test coverage to check its performance.

Run the tests:

```bash
bun test
```
