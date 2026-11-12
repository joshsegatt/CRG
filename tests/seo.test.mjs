import test from "node:test";
import assert from "node:assert/strict";
import { business } from "../src/business.mjs";
import {
  getSeoConfig,
  robotsMeta,
  robotsFile,
  createSitemap,
  structuredData,
  jsonLd,
} from "../src/seo.mjs";
import { createSmsLink } from "../src/brief.mjs";
import { icon } from "../src/icons.mjs";

test("owner-confirmed phone is shared by business data and SMS handoff", () => {
  assert.equal(business.phone, "+33611499153");
  assert.equal(business.phoneDisplay, "06 11 49 91 53");
  assert.ok(createSmsLink("Projet").startsWith("sms:+33611499153?body="));
  assert.equal(
    business.googleProfile,
    "https://share.google/0lOKBaNvSC9fL0QDS",
  );
});

test("preview uses noindex while allowing the crawler to read that directive", () => {
  const config = getSeoConfig();
  assert.equal(robotsMeta("index.html", config), "noindex, follow");
  assert.match(robotsFile(config), /Allow: \//);
  assert.doesNotMatch(robotsFile(config), /Disallow|Sitemap:/);
  assert.doesNotMatch(createSitemap(["index.html"], config), /<url>/);
});

test("public indexing requires an explicit flag and an HTTPS origin", () => {
  assert.throws(() => getSeoConfig({ indexable: "1" }));
  assert.throws(() =>
    getSeoConfig({ siteUrl: "http://example.test", indexable: "1" }),
  );
  assert.throws(() => getSeoConfig({ indexable: "true" }));
  const config = getSeoConfig({
    siteUrl: "https://example.test",
    indexable: "1",
  });
  assert.match(robotsMeta("renovation-geneve-veyrier.html", config), /^index,/);
  assert.match(robotsMeta("photographies.html", config), /^noindex,/);
  assert.match(
    robotsFile(config),
    /Sitemap: https:\/\/example.test\/sitemap.xml/,
  );
});

test("sitemap contains paired canonical language URLs and excludes utility pages", () => {
  const config = getSeoConfig({
    siteUrl: "https://example.test",
    indexable: "1",
  });
  const sitemap = createSitemap(
    ["index.html", "renovation-geneve-veyrier.html", "confidentialite.html"],
    config,
  );
  assert.equal([...sitemap.matchAll(/<url>/g)].length, 4);
  assert.ok(
    sitemap.includes("https://example.test/en/renovation-geneve-veyrier.html"),
  );
  assert.doesNotMatch(sitemap, /confidentialite/);
});

test("structured data describes one real base and separate areas served without invented reviews", () => {
  const graph = structuredData({
    origin: "https://example.test",
    file: "maconnerie.html",
    title: "Masonry",
    description: "Masonry services",
    locale: "en",
    serviceType: "Masonry",
  });
  const company = graph["@graph"].find(
    (entry) => entry["@type"] === "GeneralContractor",
  );
  const page = graph["@graph"].find((entry) => entry["@type"] === "WebPage");
  const service = graph["@graph"].find((entry) => entry["@type"] === "Service");
  assert.equal(company.address.addressLocality, "Gex");
  assert.equal(company.address.addressCountry, "FR");
  assert.equal(company.telephone, "+33611499153");
  assert.ok(
    company.areaServed.some(
      (area) => area.name === "Veyrier" && area.containedInPlace.name === "CH",
    ),
  );
  assert.equal(page.inLanguage, "en");
  assert.equal(page.url, "https://example.test/en/maconnerie.html");
  assert.equal(service.provider["@id"], company["@id"]);
  assert.doesNotMatch(
    JSON.stringify(graph),
    /aggregateRating|reviewCount|openingHours|geo/,
  );
});

test("JSON-LD safely escapes closing script content", () => {
  const text = jsonLd({ description: "</script><script>alert(1)</script>" });
  assert.doesNotMatch(text, /<\/script>/);
  assert.equal(
    JSON.parse(text).description,
    "</script><script>alert(1)</script>",
  );
});

test("interface icons share one decorative accessible SVG treatment", () => {
  for (const name of [
    "arrow",
    "phone",
    "menu",
    "plus",
    "pin",
    "masonry",
    "partition",
    "tiling",
    "external",
  ]) {
    const svg = icon(name);
    assert.match(svg, /stroke-width="1.5"/);
    assert.match(svg, /stroke-linecap="round"/);
    assert.match(svg, /aria-hidden="true"/);
  }
  assert.throws(() => icon("unknown"));
});
