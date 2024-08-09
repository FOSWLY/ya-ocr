# ya-ocr

[![GitHub Actions](https://github.com/FOSWLY/ya-ocr/actions/workflows/ci.yml/badge.svg)](https://github.com/FOSWLY/ya-ocr/actions/workflows/ci.yml)
[![npm](https://img.shields.io/bundlejs/size/ya-ocr)](https://www.npmjs.com/package/ya-ocr)
[![en](https://img.shields.io/badge/lang-English%20%F0%9F%87%AC%F0%9F%87%A7-white)](README.md)
[![ru](https://img.shields.io/badge/%D1%8F%D0%B7%D1%8B%D0%BA-%D0%A0%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9%20%F0%9F%87%B7%F0%9F%87%BA-white)](README-RU.md)

Неофициальная библиотека для бесплатного использования Yandex OCR через Translation API, которая поддерживает работу с JavaScript, TypeScript, а также имеет встроенные типы для Typebox.

## Установка

Установка для Bun:

```bash
bun add ya-ocr
```

Установка для NPM:

```bash
npm install ya-ocr
```

## Начало работы

Чтобы начать работу с API, вам необходимо создать OCR клиент. Это можно сделать с помощью пары строчек представленных ниже:

```ts
const client = new OCRClient();

const result = await client.scanByUrl(
  "https://repository-images.githubusercontent.com/450906609/c04b600b-5f0f-488b-820d-ffaeb1fde2d0",
);
```

Вы можете увидеть больше примеров кода [здесь](https://github.com/FOSWLY/ya-ocr/tree/main/examples)

## Сборка

Для сборки необходимо наличие:

- [Bun](https://bun.sh/)

Не забудьте установить зависимости:

```bash
bun install
```

#### Обычная сборка

Сборка всего пакета:

```bash
bun build:bun
```

#### Сборка TypeScript типов

Вы можете воспользоваться данным вариантом сборки, если вы хотите собрать, только, типы для TypeScript:

```bash
bun build:declaration
```

#### Сборка TypeBox типов

Вы можете воспользоваться данным вариантом сборки, если вы хотите собрать, только, типы для TypeBox:

```bash
bun build:typebox
```

## Тесты

Библиотека имеет минимальное покрытие тестами для проверки ее работоспособности.

Запустить тесты:

```bash
bun test
```
