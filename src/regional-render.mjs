import { regionalPages } from "./regions.mjs";
import { icon } from "./icons.mjs";

export function regionalRows({ picture, action, contactBand }) {
  const areaFiles = regionalPages.filter((page) => page.kind === "area");
  const faq = (items) =>
    `<div>${items.map(({ question, answer }) => `<details><summary>${question.fr}${icon("plus")}</summary><p>${answer.fr}</p></details>`).join("")}</div>`;
  const pageRows = regionalPages.map((page) => [
    page.file,
    page.title.fr,
    page.description.fr,
    `<section class="service-hero wrap section regional-hero"><div><a class="back-link" href="/zones-intervention.html">Tous les secteurs d’intervention</a><h1>${page.heading.fr}</h1><p>${page.intro.fr}</p>${action(page.kind === "area" ? "Décrire mon projet dans ce secteur" : "Préparer notre premier échange")}</div><figure>${picture(page.image, "Visuel d’ambiance · illustration du savoir-faire", "", true)}<figcaption>Visuel d’ambiance · illustration du savoir-faire</figcaption></figure></section><div class="reading-sections">${page.sections.map((section) => `<section class="reading-section wrap"><h2>${section.heading.fr}</h2><div><p>${section.text.fr}</p>${section.items ? `<ul class="work-list">${section.items.map((item) => `<li>${item.fr}</li>`).join("")}</ul>` : ""}</div></section>`).join("")}</div><section class="section wrap editorial-grid related-services"><h2>Des métiers complémentaires.</h2><div><p>Parcourez les prestations pour préciser ce qui concerne vos murs, vos volumes et vos revêtements.</p><nav class="related-links" aria-label="Savoir-faire"><a href="/maconnerie.html">Maçonnerie${icon("arrow")}</a><a href="/platrerie.html">Plâtrerie & cloisons${icon("arrow")}</a><a href="/carrelage.html">Carrelage${icon("arrow")}</a></nav></div></section><section class="section wrap editorial-grid faq"><h2>Avant de vous lancer.</h2>${faq(page.faq)}</section>${contactBand()}`,
    page.kind === "area" ? "area" : "service",
  ]);
  const areaDescriptions = [
    "Partir de l’existant, organiser les pièces et prévoir les accès, de Gex à Ferney-Voltaire et Saint-Genis-Pouilly.",
    "Préparer les travaux en appartement ou en maison autour d’Annemasse, d’Étrembières et de Saint-Julien-en-Genevois.",
    "Préciser l’adresse suisse, les accès et le périmètre des travaux avant d’organiser l’intervention.",
  ];
  const areaNames = ["Pays de Gex", "Genevois français", "Genève et Veyrier"];
  const hub = `<section class="page-intro wrap section"><h1>Vos travaux, de part et d’autre de la frontière.</h1><p class="large-copy">Implantée à Gex, Création & Rénovation Gessienne intervient en France et en Suisse pour la maçonnerie, la plâtrerie, les cloisons et le carrelage. Découvrez les points à préparer selon le secteur de votre chantier.</p></section><section class="wrap territory-list" aria-label="Zones d’intervention">${areaFiles.map((page, index) => `<article><h2><a href="/${page.file}">${icon("pin")}${areaNames[index]}${icon("arrow")}</a></h2><p>${areaDescriptions[index]}</p></article>`).join("")}</section><section class="section wrap editorial-grid"><h2>Avant les travaux, les bonnes questions.</h2><div><p>Commune, pièces concernées, dimensions, accès et matériaux : rassemblez les informations utiles au premier échange.</p><a class="text-link" href="/preparer-projet-renovation.html">Lire le guide de préparation${icon("arrow")}</a></div></section>${contactBand()}`;
  return [
    [
      "zones-intervention.html",
      "Rénovation : Gex, Genevois, Genève et Veyrier",
      "Maçonnerie, plâtrerie et carrelage à Gex, en France et dans le bassin genevois. Présentation de l’entreprise, de ses métiers et de ses secteurs d’intervention.",
      hub,
      "area",
    ],
    ...pageRows,
  ];
}
