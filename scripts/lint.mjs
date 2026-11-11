import { readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const files = ["build.mjs", "server.mjs"];
for (const directory of ["src", "scripts", "tests"]) {
  for (const file of await readdir(directory)) {
    if (file.endsWith(".mjs")) files.push(`${directory}/${file}`);
  }
}
for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], {
    encoding: "utf8",
  });
  if (result.status !== 0) throw new Error(`${file}: ${result.stderr}`);
}
console.log(`Syntax checked: ${files.length} JavaScript modules.`);
