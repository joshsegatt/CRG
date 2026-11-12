import { business } from "./business.mjs";
import { getPagePath, getSiteOrigin } from "./i18n.mjs";

export const utilityPages = new Set([
  "mentions-legales.html",
  "confidentialite.html",
  "photographies.html",
]);

export function getSeoConfig({ siteUrl = "", indexable } = {}) {
  const origin = getSiteOrigin(siteUrl);
  if (![undefined, "0", "1"].includes(indexable))
    throw new Error("SITE_INDEXABLE must be 0 or 1.");
  const enabled = indexable === "1";
  if (enabled && !origin.startsWith("https://"))
    throw new Error("An HTTPS SITE_URL is required before SITE_INDEXABLE=1.");
  return { origin, indexable: enabled };
}

export function pageCanBeIndexed(file, config) {
  return config.indexable && !utilityPages.has(file);
}

export function robotsMeta(file, config) {
  return pageCanBeIndexed(file, config)
    ? "index, follow, max-image-preview:large"
    : "noindex, follow";
}

export function robotsFile(config) {
  return `User-agent: *\nAllow: /\n${config.indexable ? `Sitemap: ${config.origin}/sitemap.xml\n` : ""}`;
}

export function createSitemap(files, config) {
  const entries = config.indexable
    ? files
        .filter((file) => pageCanBeIndexed(file, config))
        .flatMap((file) =>
          ["fr", "en"].map(
            (locale) =>
              `<url><loc>${config.origin}${getPagePath(file, locale)}</loc></url>`,
          ),
        )
        .join("")
    : "";
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`;
}

export function structuredData({
  origin = "",
  file = "index.html",
  title,
  description,
  locale = "fr",
  serviceType,
} = {}) {
  const areaServed = business.areas.map((area) => ({
    "@type": "AdministrativeArea",
    name: area.name,
    containedInPlace: { "@type": "Country", name: area.country },
  }));
  const company = {
    "@type": "GeneralContractor",
    name: business.name,
    alternateName: business.alternateName,
    legalName: business.legalName,
    telephone: business.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.street,
      addressLocality: business.locality,
      postalCode: business.postalCode,
      addressRegion: business.region,
      addressCountry: business.country,
    },
    areaServed,
    sameAs: [business.googleProfile],
  };
  if (!origin) return { "@context": "https://schema.org", ...company };
  const businessId = `${origin}/#business`;
  const url = `${origin}${getPagePath(file, locale)}`;
  const graph = [
    { ...company, "@id": businessId, url: `${origin}/` },
    {
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      url: `${origin}/`,
      name: business.name,
      inLanguage: ["fr", "en"],
      publisher: { "@id": businessId },
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: locale,
      isPartOf: { "@id": `${origin}/#website` },
      about: { "@id": businessId },
    },
  ];
  if (file !== "index.html") {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: locale === "en" ? "Home" : "Accueil",
          item: `${origin}${getPagePath("index.html", locale)}`,
        },
        { "@type": "ListItem", position: 2, name: title, item: url },
      ],
    });
    graph[2].breadcrumb = { "@id": `${url}#breadcrumb` };
  }
  if (serviceType)
    graph.push({
      "@type": "Service",
      "@id": `${url}#service`,
      name: serviceType,
      serviceType,
      provider: { "@id": businessId },
      areaServed,
      url,
    });
  return { "@context": "https://schema.org", "@graph": graph };
}

export function jsonLd(data) {
  return JSON.stringify(data).replaceAll("<", "\\u003c");
}
