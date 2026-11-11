import { english } from "./translations.en.mjs";
import { getPagePath } from "./i18n.mjs";

function escapeText(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function translate(value, attribute = false) {
  const key = value.trim();
  if (!Object.hasOwn(english, key)) return value;
  const translated = escapeText(english[key]);
  const safe = attribute ? translated.replaceAll('"', "&quot;") : translated;
  return value.replace(key, () => safe);
}

function englishHref(href) {
  if (href.startsWith("/en/")) return href;
  if (
    href === "/" ||
    href.startsWith("/#") ||
    /^\/[^/]+\.html(?:[?#]|$)/.test(href)
  )
    return `/en${href}`;
  return href;
}

function translateTag(tag) {
  let translated = tag.replace(
    /\b(alt|aria-label|content|value)="([^"]*)"/g,
    (_, attribute, value) => `${attribute}="${translate(value, true)}"`,
  );
  if (tag.includes('data-language="')) {
    translated = translated.replace(/ aria-current="page"/g, "");
    if (tag.includes('data-language="en"'))
      translated = translated.replace(/>$/, ' aria-current="page">');
    return translated;
  }
  if (tag.startsWith("<a "))
    translated = translated.replace(
      /href="([^"]*)"/,
      (_, href) => `href="${englishHref(href)}"`,
    );
  return translated;
}

export function createEnglishPage(
  html,
  { file = "index.html", origin = "" } = {},
) {
  const translated = html
    .split(/(<script\b[^>]*>[\s\S]*?<\/script>)/gi)
    .map((block) => {
      if (/^<script\b/i.test(block)) return block;
      return block
        .split(/(<[^>]+>)/g)
        .map((token) =>
          token.startsWith("<") ? translateTag(token) : translate(token),
        )
        .join("");
    })
    .join("");
  const url = `${origin}${getPagePath(file, "en")}`;
  return translated
    .replace('<html lang="fr">', '<html lang="en">')
    .replace(
      'property="og:locale" content="fr_FR"',
      'property="og:locale" content="en_GB"',
    )
    .replace(
      /(<link rel="canonical" href=")[^"]*(")/,
      (_, start, end) => `${start}${url}${end}`,
    )
    .replace(
      /(<meta property="og:url" content=")[^"]*(")/,
      (_, start, end) => `${start}${url}${end}`,
    );
}
