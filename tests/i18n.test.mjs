import test from "node:test";
import assert from "node:assert/strict";
import { getMessages, getPagePath, getSiteOrigin } from "../src/i18n.mjs";
import { createEnglishPage } from "../src/localize.mjs";
import { createSummary, validateStep } from "../src/brief.mjs";

test("language paths retain the equivalent page without changing asset paths", () => {
  assert.equal(getPagePath("index.html", "fr"), "/");
  assert.equal(getPagePath("index.html", "en"), "/en/");
  assert.equal(getPagePath("carrelage.html", "en"), "/en/carrelage.html");
  assert.equal(getMessages("unknown").services.carrelage, "Carrelage");
});

test("English HTML translates text and accessibility labels but preserves technical values and JSON-LD", () => {
  const schema =
    '<script type="application/ld+json">{"name":"Maçonnerie"}</script>';
  const html = `<html lang="fr"><head><title>Maçonnerie</title><link rel="canonical" href="https://example.test/maconnerie.html"><link rel="alternate" hreflang="fr" href="https://example.test/maconnerie.html"><meta property="og:url" content="https://example.test/maconnerie.html"><meta property="og:locale" content="fr_FR">${schema}</head><body><a href="/contact.html?service=maconnerie#contenu">Maçonnerie</a><a href="/#savoir-faire">Savoir-faire</a><img src="/assets/hero.webp" alt="Intérieur aux murs clairs et volumes ouverts"><input name="service" value="maconnerie"></body></html>`;
  const output = createEnglishPage(html, {
    file: "maconnerie.html",
    origin: "https://example.test",
  });
  assert.match(output, /<html lang="en">/);
  assert.match(output, /<title>Masonry<\/title>/);
  assert.ok(
    output.includes('href="/en/contact.html?service=maconnerie#contenu"'),
  );
  assert.ok(output.includes('href="/en/#savoir-faire"'));
  assert.ok(output.includes('src="/assets/hero.webp"'));
  assert.ok(output.includes('value="maconnerie"'));
  assert.ok(output.includes(schema));
  assert.ok(
    output.includes(
      'rel="canonical" href="https://example.test/en/maconnerie.html"',
    ),
  );
  assert.ok(
    output.includes(
      'hreflang="fr" href="https://example.test/maconnerie.html"',
    ),
  );
  assert.ok(output.includes('property="og:locale" content="en_GB"'));
});

test("language controls keep both counterpart links and only English is current on English pages", () => {
  const html =
    '<a href="/contact.html" data-language="fr" aria-current="page">FR</a><a href="/en/contact.html" data-language="en">EN</a>';
  const output = createEnglishPage(html, { file: "contact.html" });
  assert.ok(
    output.includes('<a href="/contact.html" data-language="fr">FR</a>'),
  );
  assert.ok(
    output.includes(
      '<a href="/en/contact.html" data-language="en" aria-current="page">EN</a>',
    ),
  );
});

test("English validation and summary use English without translating visitor content", () => {
  assert.match(validateStep(1, {}, "en").service, /Choose/);
  assert.match(validateStep(2, {}, "en").city, /town/);
  assert.match(validateStep(3, { phone: "........" }, "en").phone, /Check/);
  const description =
    "Ma cuisine fait 25 m², avec des accents & du texte <b>brut</b>.";
  const summary = createSummary(
    { service: "carrelage", city: "Gex", description },
    "en",
  );
  assert.match(summary, /Work : Tiling/);
  assert.match(summary, /Preferred timeframe : To be discussed/);
  assert.ok(summary.includes(description));
  assert.doesNotMatch(summary, /Période souhaitée|Téléphone/);
  assert.equal(getMessages("en").downloadName, "my-gessienne-project.txt");
});

test("public metadata origin is optional and rejects unsafe or unsupported configurations", () => {
  assert.equal(getSiteOrigin(), "");
  assert.equal(getSiteOrigin("https://example.test/"), "https://example.test");
  for (const value of [
    "javascript:alert(1)",
    "https://example.test/CRG/",
    "https://example.test/?a=b",
    "https://user:password@example.test",
    "https://example.test/#x",
  ]) {
    assert.throws(() => getSiteOrigin(value));
  }
});
