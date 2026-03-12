#!/usr/bin/env bun

import { $ } from "bun";
import path from "node:path";
import { mkdir, copyFile, readdir } from "node:fs/promises";

const targetDir = process.argv[2] ?? "./my-chrome-extension";
const cwd = process.cwd();
const projectDir = path.isAbsolute(targetDir)
  ? targetDir
  : path.join(cwd, targetDir);
const templateDir = path.join(import.meta.dir, "template");

async function copyRecursive(src: string, dest: string) {
  await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyRecursive(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  console.log("◇  create-chrome-extension-bun");
  console.log("│  Copying local template and installing dependencies...");

  await copyRecursive(templateDir, projectDir);
  console.log(`│  Template copied to: ${projectDir}`);

  console.log("│  Installing devDependencies: @types/chrome ...");
  await $`bun add -d @types/chrome sharp @types/dom-parser @types/bun archiver`.cwd(projectDir).quiet();

  console.log("└  Done!");
  console.log("  [1] 다음 명령으로 개발 서버(또는 빌드) 실행:");
  console.log("   bun run pack");
  console.log("  [2] 크롬 브라우저에서 확장 프로그램을 로드하여 테스트하세요.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
