import { readdir, readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { english } from "../src/translations.en.mjs";

const root = resolve("dist");
async function htmlFiles(directory = "") {
  const entries = await readdir(resolve(root, directory), {
    withFileTypes: true,
  });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = directory ? `${directory}/${entry.name}` : entry.name;
      if (entry.isDirectory()) return htmlFiles(path);
      return entry.name.endsWith(".html") ? [path] : [];
    }),
  );
  return files.flat();
}
const unchangedText = new Set([
  "FR",
  "EN",
  "+",
  "CRÉATION & RÉNOVATION",
  "GESSIENNE",
  "CREATION & RENOVATION GESSIENNE",
  "896 rue de l’Oudar",
  "01170 Gex, France",
  "896 rue de l’Oudar, 01170 Gex, France",
]);
const files = await htmlFiles();
let references = 0;
for (const file of files) {
  const html = await readFile(resolve(root, file), "utf8");
  const locale = file.startsWith("en/") ? "en" : "fr";
  for (const required of [
    `<html lang="${locale}">`,
    "<title>",
    'name="description"',
    '<main id="contenu">',
    "<h1",
    `aria-label="${locale === "en" ? "Main navigation" : "Navigation principale"}"`,
  ]) {
    if (!html.includes(required))
      throw new Error(`${file}: missing ${required}`);
  }
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  if (ids.length !== new Set(ids).size)
    throw new Error(`${file}: duplicate IDs`);
  if ([...html.matchAll(/<h1[ >]/g)].length !== 1)
    throw new Error(`${file}: expected one H1`);
  for (const match of html.matchAll(/(?:src|href)="([^"#]+)(?:#[^"]*)?"/g)) {
    const url = match[1].split("?")[0];
    if (!url.startsWith("/")) continue;
    let target = resolve(root, `.${url}`);
    if ((await stat(target)).isDirectory())
      target = resolve(target, "index.html");
    if (!(await stat(target)).isFile())
      throw new Error(`${file}: missing asset ${url}`);
    references++;
  }
  for (const match of html.matchAll(/<img\b([^>]+)>/g)) {
    if (!match[1].includes('alt="'))
      throw new Error(`${file}: missing image alt`);
  }
  const languageLinks = [
    ...html.matchAll(/<a\b[^>]*data-language="(fr|en)"[^>]*>/g),
  ];
  if (languageLinks.length !== 2)
    throw new Error(`${file}: expected both language links`);
  for (const link of languageLinks) {
    if (link[0].includes('aria-current="page"') !== (link[1] === locale))
      throw new Error(`${file}: wrong current language`);
  }
  if (locale === "fr") {
    await stat(resolve(root, `en/${file}`));
    const textTokens = html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
      .split(/<[^>]*>/)
      .map((value) => value.trim())
      .filter(Boolean);
    for (const token of textTokens) {
      if (
        Object.hasOwn(english, token) ||
        unchangedText.has(token) ||
        !/\p{L}/u.test(token) ||
        /^© \d{4} Création & Rénovation Gessienne$/.test(token) ||
        /^SIREN \d[\d ]*$/.test(token)
      )
        continue;
      throw new Error(
        `${file}: English translation missing for ${JSON.stringify(token)}`,
      );
    }
  }
}
const css = await readFile(resolve(root, "styles.css"), "utf8");
for (const match of css.matchAll(/url\(["']([^"']+)["']\)/g))
  await stat(resolve(root, `.${match[1]}`));
console.log(
  `PASS: ${files.length} pages; ${references} internal references; translation coverage, language links, images, fonts, titles, landmarks and unique IDs checked.`,
);
