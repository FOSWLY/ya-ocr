# ya-ocr — agent instructions

Single-package npm library. Runtime: Bun (primary), Node.js 18+. Package manager: `bun`.

## Commands

| Command                 | What it does                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `bun test`              | Run tests (Bun native runner, `bun:test`)                                                                                      |
| `bun run lint`          | `oxlint` (fast Rust linter)                                                                                                    |
| `bun run lint:fix`      | `oxlint --fix`                                                                                                                 |
| `bun run fmt`           | `oxfmt` (format code)                                                                                                          |
| `bun run fmt:check`     | `oxfmt --check` (check formatting)                                                                                             |
| `bun run build:default` | `tsc` + `tsc-alias` (resolves `@/*` path aliases) + `tsc-esm-fix`                                                              |
| `bun run build:bun`     | Runs `scripts/build.ts` — clean dist, build:default, then generate TypeBox types via `@toil/typebox-genx` into `dist/typebox/` |
| `bun run build:doc`     | typedoc into `docs/`                                                                                                           |
| `bun run build:all`     | `build:bun && build:doc`                                                                                                       |

**Order**: After making changes, run `bun run lint` then `bun test`.

## Key facts

- Tests hit **real Yandex API** (no mocks). Requires network. Test files: `tests/test.jpg`, `tests/test-en.jpg`.
- `tsconfig.json` has `noEmit: true` and `allowImportingTsExtensions: true` (for dev/typecheck). `tsconfig.build.json` flips those for actual compilation.
- Path alias `@/*` → `./src/*`. Built output in `./dist/`. Published package ships only `dist/`.
- Main class `OCRClient` extends `YandexTranslateProvider` from `@toil/translate`. Three scan methods: `scanByBlob`, `scanByFile`, `scanByUrl`.
- Subpath exports: `.` (default), `./consts`, `./types`, `./types/*`.
- Supported file MIME types: `image/webp`, `image/png`, `image/jpeg` (defined in `src/consts.ts`).
- ShareX integration: `sharex.js` imports from `./dist/client.js`, takes filepath argument, copies result text to clipboard.

## Architecture

- `src/index.ts` — public entrypoint. Exports default (`OCRClient`), `OCRTypes`, `OCRConsts`.
- `src/client.ts` — `OCRClient` class. Accepts optional `fetchFn` (for custom fetch like `GM_fetch`, `ofetch.native`).
- `src/types/` — `client.ts` (OCR-specific types), `yandex.ts` (raw API response types), `overlay.ts` (point geometry), `index.ts` (re-exports as namespaces).
- `src/utils/` — `overlay.ts` (SVG overlay generation), `text.ts` (text utilities).
- `src/consts.ts` — `supportedTypes` array and any future constants.
- `scripts/build.ts` — build script for `bun build:bun` (cleans dist, runs build:default, generates TypeBox types).

## CI

- `build.yml`: runs on push/PR — `bun install`, `bun build:all`, uploads `dist/` and `docs/` artifacts.
- `docs.yml`: on push to `main` — calls build.yml then deploys docs to GitHub Pages.
- `release.yml`: on push to `main` — calls build.yml then creates a draft GitHub Release.
