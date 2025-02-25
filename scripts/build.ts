import path from "node:path";
import { $ } from "bun";
import { GenX } from "@toil/typebox-genx";

const packagePath = path.resolve(import.meta.dir, "..");
await $`rm -rf dist`;
await $`bun build:default`;
await $`mkdir dist/typebox`;
const genx = new GenX({ root: packagePath });
await genx.generateByDir(
  path.resolve(packagePath, "src", "types"),
  path.resolve(packagePath, "dist", "typebox"),
);
