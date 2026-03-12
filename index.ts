#!/usr/bin/env bun

import { $ } from "bun";
import path from "node:path";
import readline from "node:readline";
import { mkdir, copyFile, readdir } from "node:fs/promises";

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

const EXCULDE_FOLDER_FILES = [".git", 
  ".gitignore", ".npmignore", 
  ".cursor", "dist", "node_modules", "versions",
  "bun.lock", "package-lock.json", "yarn.lock", "pnpm-lock.yaml",
];
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
    if (EXCULDE_FOLDER_FILES.includes(entry.name)) {
      continue;
    }
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
  console.log("│  Copying local template...");

  await copyRecursive(templateDir, projectDir);
  console.log(`│  Template copied to: ${projectDir}`);

  const answer = await ask("◇  Install dependencies? (y/n): ");
  if (/^y(es)?$/i.test(answer)) {
    console.log("│  Installing devDependencies...");
    await $`bun i`.cwd(projectDir).quiet();
  } else {
    console.log("│  Skipped dependency installation.");
  }

  console.log("└  Done!");
  console.log("   [1] 다음 명령으로 개발 서버(또는 빌드) 실행:");
  console.log(`     cd ${targetDir}`);
  console.log(`     bun install`);
  console.log("     bun run pack");
  console.log("   [2] 크롬 브라우저에서 `dist` 폴더를 선택하여 확장 프로그램을 로드하고 테스트하세요.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
