import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import { services } from "./src/brief.mjs";
import { getPagePath } from "./src/i18n.mjs";
import { business } from "./src/business.mjs";
import { icon } from "./src/icons.mjs";
import {
  getSeoConfig,
  robotsMeta,
  robotsFile,
  createSitemap,
  structuredData,
  jsonLd,
} from "./src/seo.mjs";
import { regionalRows } from "./src/regional-render.mjs";
import { seoTitles, seoDescriptions } from "./src/page-copy.mjs";
import { english } from "./src/translations.en.mjs";
import { createEnglishPage } from "./src/localize.mjs";

const seoConfig = getSeoConfig({
  siteUrl: process.env.SITE_URL,
  indexable: process.env.SITE_INDEXABLE,
});
const { origin } = seoConfig;
const company = business.name;
const arrow = icon("arrow");
const phoneIcon = icon("phone");
const logo = `<span class="logo-window"><img src="/assets/identite-officielle.webp" width="1122" height="1402" alt="Création & Rénovation Gessienne — accueil"></span>`;

const serviceDetails = [
  {
    id: "maconnerie",
    title: "Maçonnerie",
    lead: "Donner forme à vos espaces.",
    intro:
      "Une pièce à repenser, un mur à créer, un espace à transformer. La maçonnerie pose les bases de votre projet, en construction comme en rénovation.",
    short:
      "Murs, ouvertures et aménagements maçonnés. La structure de vos nouveaux espaces.",
    image: "maconnerie.webp",
    alt: "Mur en pierre naturelle et ouverture de fenêtre",
    heading: "Partir de l’existant. Construire la suite.",
    text: "Chaque intervention commence par la compréhension du bâtiment et de vos usages. Nous échangeons sur votre besoin pour définir les travaux de maçonnerie adaptés à votre projet.",
    items: [
      "Travaux de maçonnerie générale",
      "Création et reprise de murs",
      "Aménagements maçonnés",
      "Rénovation du bâti existant",
    ],
    faq: [
      [
        "Peut-on modifier un mur existant ?",
        "La faisabilité dépend de la structure du bâtiment et du rôle du mur. Une visite et, lorsque nécessaire, une étude structure permettent de définir les conditions d’intervention.",
      ],
      [
        "De quoi avez-vous besoin pour étudier mon projet ?",
        "Indiquez la commune, la nature des travaux, les dimensions approximatives et les contraintes connues. Des plans ou des photographies peuvent être utiles lors de notre échange.",
      ],
    ],
  },
  {
    id: "platrerie",
    title: "Plâtrerie & cloisons",
    lead: "Repenser l’espace, simplement.",
    intro:
      "Créer une pièce, redistribuer les volumes ou préparer les surfaces. Les cloisons et la plâtrerie font évoluer votre intérieur avec vos besoins.",
    short:
      "Cloisons, doublages et surfaces préparées. Des volumes qui s’adaptent à votre vie.",
    image: "platrerie.webp",
    alt: "Intérieur aux murs clairs et volumes ouverts",
    heading: "La bonne place pour chaque pièce.",
    text: "La distribution d’un intérieur change la façon de l’habiter. Nous étudions les séparations, les passages et les supports pour préparer des espaces cohérents avec votre quotidien.",
    items: [
      "Pose de cloisons",
      "Travaux de plâtrerie",
      "Doublages intérieurs",
      "Préparation et reprise des surfaces",
    ],
    faq: [
      [
        "Peut-on créer une pièce supplémentaire ?",
        "Cela dépend de la surface disponible, des ouvertures, de la ventilation et des réseaux existants. Décrivez votre idée : nous pourrons examiner les possibilités ensemble.",
      ],
      [
        "Les travaux peuvent-ils se faire dans un logement occupé ?",
        "Les conditions d’accès et d’occupation font partie des points à examiner avant les travaux. L’organisation doit tenir compte des pièces concernées et des contraintes du chantier.",
      ],
    ],
  },
  {
    id: "carrelage",
    title: "Carrelage",
    lead: "Le détail que l’on vit chaque jour.",
    intro:
      "Au sol ou au mur, le carrelage relie les matières, la lumière et les usages. Un choix à penser autant pour son aspect que pour son quotidien.",
    short:
      "Sols et murs, matières et formats. Le choix du revêtement et la précision de la pose.",
    image: "carrelage.webp",
    alt: "Sol carrelé à grands formats, joints fins et lumière naturelle",
    heading: "Une matière. Tout un équilibre.",
    text: "Le support, le format, le sens de pose et les joints participent au résultat. Nous échangeons sur les contraintes de votre pièce et les revêtements envisagés avant de définir l’intervention.",
    items: [
      "Pose de carrelage au sol",
      "Revêtements muraux et faïence",
      "Préparation des supports",
      "Joints et finitions",
    ],
    faq: [
      [
        "Faut-il retirer le carrelage existant ?",
        "L’état du support, son adhérence et la hauteur disponible doivent être examinés. La solution se détermine après vérification de l’existant.",
      ],
      [
        "Puis-je choisir mes propres carreaux ?",
        "Présentez-nous le revêtement et le format que vous envisagez. Nous pourrons discuter de leur compatibilité avec le support et les contraintes de la pièce.",
      ],
    ],
  },
];

function action(
  label = "Parlons de votre projet",
  href = "/contact.html",
  extra = "",
) {
  return `<a class="button ${extra}" href="${href}">${label}${arrow}</a>`;
}

function header(current, path = "") {
  const page = path || "index.html";
  const languages = `<nav class="language-switch" aria-label="Choisir la langue"><a href="${getPagePath(page, "fr")}" lang="fr" hreflang="fr" data-language="fr" aria-current="page" aria-label="Version française">FR</a><a href="${getPagePath(page, "en")}" lang="en" hreflang="en" data-language="en" aria-label="English version">EN</a></nav>`;
  return `<a class="skip-link" href="#contenu">Aller au contenu</a><header class="site-header"><div class="header-inner"><a class="brand" href="/" aria-label="${company}, accueil">${logo}</a><button id="menu-toggle" class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav"><span>Menu</span>${icon("menu")}</button><nav id="main-nav" aria-label="Navigation principale"><a href="/#savoir-faire"${current === "service" ? ' aria-current="page"' : ""}>Savoir-faire</a><a href="/zones-intervention.html"${current === "area" ? ' aria-current="page"' : ""}>Secteurs</a><a href="/entreprise.html"${current === "entreprise" ? ' aria-current="page"' : ""}>L’entreprise</a><a href="/contact.html"${current === "contact" ? ' aria-current="page"' : ""}>Contact</a></nav>${languages}<a class="header-call" aria-label="Appeler le 06 11 49 91 53" href="tel:+33611499153">${phoneIcon}<span>06 11 49 91 53</span></a></div></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="footer-top wrap"><a href="/" class="footer-brand">CRÉATION & RÉNOVATION<br><span>GESSIENNE</span></a><div><p class="footer-title">Vos travaux, à Gex.</p><a href="tel:+33611499153">06 11 49 91 53</a><p>896 rue de l’Oudar<br>01170 Gex, France</p><a class="google-profile-link" href="${business.googleProfile}" target="_blank" rel="noopener noreferrer">Voir notre fiche Google${icon("external")}</a></div><nav aria-label="Navigation de pied de page"><a href="/#savoir-faire">Nos savoir-faire</a><a href="/zones-intervention.html">Zones d’intervention</a><a href="/preparer-projet-renovation.html">Préparer ses travaux</a><a href="/entreprise.html">L’entreprise</a><a href="/contact.html">Préparer mon projet</a></nav></div><div class="footer-bottom wrap"><p>© ${new Date().getFullYear()} ${company}</p><div><a href="/mentions-legales.html">Informations légales</a><a href="/confidentialite.html">Confidentialité</a><a href="/photographies.html">Visuels d’ambiance</a></div></div></footer>`;
}

function contactBand() {
  return `<section class="contact-band"><div class="wrap contact-band-inner"><h2>Votre projet commence<br>par une conversation.</h2><div><a class="button" href="tel:+33611499153">${phoneIcon}06 11 49 91 53</a><a class="contact-band-link" href="/contact.html">Ou décrivez-nous votre projet ${arrow}</a></div></div></section>`;
}

function picture(file, alt, classes = "", eager = false) {
  return `<img class="${classes}" src="/assets/${file}" alt="${alt}" loading="${eager ? "eager" : "lazy"}" ${eager ? 'fetchpriority="high"' : ""} width="1200" height="1500">`;
}

function layout(title, description, body, current = "", path = "") {
  const file = path || "index.html";
  const pageTitle = seoTitles[file]?.fr ?? title;
  const canonical = origin
    ? `<link rel="canonical" href="${origin}/${path}"><link rel="alternate" hreflang="fr" href="${origin}/${path}"><link rel="alternate" hreflang="en" href="${origin}/en/${path}"><link rel="alternate" hreflang="x-default" href="${origin}/${path}">`
    : "";
  const serviceType =
    serviceDetails.find((service) => `${service.id}.html` === file)?.title ??
    (file === "renovation-interieure.html"
      ? "Rénovation intérieure"
      : undefined);
  const schema = structuredData({
    origin,
    file,
    title,
    description,
    serviceType,
  });
  const breadcrumb =
    file === "index.html"
      ? ""
      : `<nav class="breadcrumbs wrap" aria-label="Fil d’Ariane"><ol><li><a href="/">Accueil</a></li><li aria-hidden="true">${arrow}</li><li aria-current="page">${title}</li></ol></nav>`;
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${pageTitle}</title><meta name="description" content="${description}"><meta name="robots" content="${robotsMeta(file, seoConfig)}"><meta name="theme-color" content="#FFFFFF"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">${canonical}<meta property="og:locale" content="fr_FR"><meta property="og:type" content="website"><meta property="og:title" content="${pageTitle}"><meta property="og:description" content="${description}"><meta property="og:url" content="${origin}/${path}"><meta property="og:image" content="${origin}/assets/hero.webp"><meta property="og:site_name" content="${company}"><meta name="twitter:card" content="summary_large_image"><link rel="preload" href="/assets/montserrat-800.ttf" as="font" type="font/ttf" crossorigin><link rel="stylesheet" href="/styles.css"><script type="module" src="/app.mjs"></script><script type="application/ld+json">${jsonLd(schema)}</script></head><body>${header(current, path)}<main id="contenu">${breadcrumb}${body}</main>${footer()}</body></html>`;
}

const home = `<section class="hero"><div class="hero-copy"><h1>Bien<br>chez vous.<br>Pour<br>longtemps.</h1><p>Maçonnerie, plâtrerie et carrelage à Gex.<br class="desktop-break"> Des travaux pensés pour votre quotidien.</p><div class="hero-actions">${action()}<a class="text-link" href="#savoir-faire">Découvrir nos savoir-faire</a></div></div><div class="hero-media">${picture("hero.webp", "Intérieur de maison, pierre claire, bois et lumière naturelle — visuel d’ambiance", "", true)}</div></section><div class="context-strip wrap"><p>Implantés à Gex</p><p>Maçonnerie & rénovation</p><p>Un projet à votre mesure</p></div><section class="services section wrap" id="savoir-faire"><div class="section-intro"><h2>Le bon geste,<br>à chaque étape.</h2><p>Faire évoluer votre intérieur commence par les bons savoir-faire. Découvrez les métiers au cœur de notre activité.</p></div><div class="service-grid">${serviceDetails.map((service) => `<article class="service-item"><a class="service-image" href="/${service.id}.html" tabindex="-1" aria-hidden="true">${picture(service.image, "")}</a><h3><a href="/${service.id}.html">${icon({ maconnerie: "masonry", platrerie: "partition", carrelage: "tiling" }[service.id])}<span>${service.title}</span>${arrow}</a></h3><p>${service.short}</p></article>`).join("")}</div><a class="text-link all-trades-link" href="/renovation-interieure.html">Découvrir la rénovation intérieure${arrow}</a><p class="image-note">Visuels d’ambiance, présentés à titre d’illustration.</p></section><section class="approach section" id="approche"><div class="wrap approach-grid"><div class="approach-photo">${picture("approche.webp", "Escalier en chêne, pierre claire et volumes intérieurs — visuel d’ambiance")}</div><div class="approach-copy"><h2>Un projet clair.<br>Un chantier<br> qui avance.</h2><ol class="steps"><li><div><h3>Échanger</h3><p>Comprendre votre besoin, votre logement et ce que vous souhaitez faire évoluer.</p></div></li><li><div><h3>Préparer</h3><p>Examiner l’existant, définir les travaux et échanger sur les matériaux et l’organisation.</p></div></li><li><div><h3>Réaliser</h3><p>Donner forme au projet convenu, du premier geste aux finitions.</p></div></li></ol></div></div></section><section class="company-intro section wrap"><h2>Une entreprise<br>d’ici. Votre projet<br> pour point de départ.</h2><div><p>Création & Rénovation Gessienne est une entreprise française du bâtiment implantée à Gex. Notre activité réunit la maçonnerie, la plâtrerie, la pose de cloisons et le carrelage.</p><p>Vous avez une idée précise ou simplement besoin d’y voir plus clair ? Le premier pas est d’en parler.</p><a class="text-link" href="/entreprise.html">Découvrir l’entreprise ${arrow}</a></div></section><section class="local-reach section"><div class="wrap editorial-grid"><h2>De Gex aux portes de Genève.</h2><div><p>Nos métiers vous accompagnent dans le Pays de Gex, le Genevois français, à Genève et à Veyrier. Un premier échange permet de préparer les travaux à votre adresse.</p><a class="text-link" href="/zones-intervention.html">Explorer nos secteurs d’intervention${arrow}</a></div></div></section>${contactBand()}`;

const about = `<section class="page-intro wrap section"><h1>Des espaces à vivre.<br>Une entreprise à Gex.</h1><p class="large-copy">Création & Rénovation Gessienne accompagne vos projets de maçonnerie et d’aménagement intérieur, avec un point de départ simple : comprendre ce dont vous avez besoin.</p></section><div class="wide-photo wrap">${picture("hero.webp", "Maison et matières naturelles — image d’ambiance", "", true)}</div><section class="section wrap editorial-grid"><h2>Faire évoluer<br>ce qui vous entoure.</h2><div><p>Notre entreprise est implantée à Gex, dans l’Ain. Elle exerce dans le secteur du bâtiment depuis 2022 et réunit plusieurs métiers complémentaires : maçonnerie, plâtrerie, cloisons et carrelage.</p><p>Modifier un volume, créer une séparation ou renouveler un revêtement : chaque projet a son contexte. L’échange sur l’existant, les usages et les contraintes permet de définir les travaux à envisager.</p><p>La commune de votre chantier et les conditions d’intervention sont à préciser lors du premier contact.</p><a class="text-link" href="/#savoir-faire">Explorer nos savoir-faire ${arrow}</a></div></section><section class="business-details section"><div class="wrap editorial-grid"><h2>À votre écoute,<br>à Gex.</h2><div><address>896 rue de l’Oudar<br>01170 Gex, France</address><a class="large-phone" href="tel:+33611499153">06 11 49 91 53</a><p>Maçonnerie générale et gros œuvre de bâtiment<br>SIREN 914 288 691</p>${action("Décrire mon projet")}</div></div></section>${contactBand()}`;

function servicePage(service) {
  return `<section class="service-hero wrap section"><div><a class="back-link" href="/#savoir-faire">Tous nos savoir-faire</a><h1>${service.title}</h1><p class="service-lead">${service.lead}</p><p>${service.intro}</p>${action("Parlons de vos travaux", `/contact.html?service=${service.id}`)}</div><figure>${picture(service.image, service.alt, "", true)}<figcaption>Visuel d’ambiance · illustration du savoir-faire</figcaption></figure></section><section class="section detail-section"><div class="wrap editorial-grid"><h2>${service.heading}</h2><div><p>${service.text}</p><ul class="work-list">${service.items.map((item) => `<li>${item}</li>`).join("")}</ul><p class="muted">La faisabilité, le périmètre et les conditions des travaux sont à définir après étude de votre projet.</p></div></div></section><section class="section wrap editorial-grid faq"><h2>Avant de<br>vous lancer.</h2><div>${service.faq.map(([question, answer]) => `<details><summary>${question}${icon("plus")}</summary><p>${answer}</p></details>`).join("")}</div></section>${contactBand()}`;
}

const contact = `<section class="contact-page wrap section"><div class="contact-heading"><h1>Et si on parlait<br>de votre projet ?</h1><p>Une idée, une pièce à transformer, des travaux à prévoir. Commençons par faire connaissance.</p><a class="large-phone" href="tel:+33611499153">06 11 49 91 53${arrow}</a><address>896 rue de l’Oudar<br>01170 Gex, France</address><a class="text-link map-link" href="https://www.google.com/maps/search/?api=1&query=896+rue+de+l%27Oudar+01170+Gex" target="_blank" rel="noopener noreferrer">Voir l’adresse sur la carte<span class="sr-only"> (nouvel onglet)</span>${arrow}</a><p class="contact-note">Vous préférez préparer votre échange ?<br>Créez un résumé de vos travaux en trois étapes.</p></div><div class="brief-panel"><form id="project-form" novalidate><ol class="form-progress" aria-label="Étapes du projet"><li data-progress="1" aria-current="step">1. Travaux</li><li data-progress="2">2. Projet</li><li data-progress="3">3. Résumé</li></ol><fieldset data-step="1"><legend tabindex="-1">Que souhaitez-vous faire ?</legend><p class="field-help" id="service-help">Choisissez le sujet principal. Nous préciserons la suite ensemble.</p><div class="service-options">${Object.entries(
  services,
)
  .map(
    ([id, name]) =>
      `<label class="service-option"><input type="radio" name="service" value="${id}" aria-describedby="service-help service-error"><span>${name}</span></label>`,
  )
  .join(
    "",
  )}</div><p class="field-error" id="service-error" data-error="service"></p></fieldset><fieldset data-step="2" hidden><legend tabindex="-1">Parlez-nous des lieux.</legend><label class="field-label" for="city">Commune du chantier <span>(obligatoire)</span></label><input id="city" name="city" autocomplete="address-level2" maxlength="100" aria-describedby="city-error" required><p class="field-error" id="city-error" data-error="city"></p><label class="field-label" for="description">Votre projet en quelques mots <span>(obligatoire)</span></label><textarea id="description" name="description" rows="5" minlength="20" maxlength="2000" aria-describedby="description-help description-error" required></textarea><p class="field-help" id="description-help">Pièce concernée, travaux envisagés, dimensions approximatives… 20 à 2 000 caractères.</p><p class="field-error" id="description-error" data-error="description"></p><label class="field-label" for="timing">Période souhaitée</label><select id="timing" name="timing"><option value="À discuter">À discuter ensemble</option><option>Dès que possible</option><option>Dans les 3 prochains mois</option><option>Dans les 6 prochains mois</option><option>Je prépare un futur projet</option></select></fieldset><fieldset data-step="3" hidden><legend tabindex="-1">Préparons votre résumé.</legend><p>Vous pouvez ajouter vos coordonnées au document. Ces champs sont facultatifs.</p><label class="field-label" for="name">Votre nom <span>(facultatif)</span></label><input id="name" name="name" autocomplete="name" maxlength="100" aria-describedby="name-error"><p class="field-error" id="name-error" data-error="name"></p><label class="field-label" for="phone">Votre téléphone <span>(facultatif)</span></label><input id="phone" name="phone" type="tel" autocomplete="tel" maxlength="25" aria-describedby="phone-error"><p class="field-error" id="phone-error" data-error="phone"></p><p class="privacy-inline">Aucune donnée n’est envoyée ni enregistrée par ce formulaire. Vous choisirez ensuite de télécharger le résumé ou d’ouvrir votre application SMS.</p></fieldset><p id="form-status" role="status" aria-live="polite"></p><div class="form-actions"><button type="button" class="text-button" id="previous-step" hidden>Retour</button><button type="button" class="button" id="next-step">Continuer ${arrow}</button><button type="submit" class="button" id="finish-brief" hidden>Préparer mon résumé ${arrow}</button></div><p class="form-footnote">Une préparation de projet, sans engagement.<br><a href="/confidentialite.html">En savoir plus sur vos données</a></p></form><section id="brief-result" hidden><h2 tabindex="-1">Votre résumé est prêt.</h2><p>Il reste sur cet appareil. Pour nous contacter, appelez-nous ou ouvrez un SMS avec ce résumé.</p><pre id="brief-text"></pre><div class="result-actions"><a class="button" id="send-sms" href="sms:+33611499153">Ouvrir dans SMS ${arrow}</a><button class="outline-button" type="button" id="download-brief">Télécharger le résumé</button><button class="text-button" type="button" id="copy-brief">Copier le texte</button></div><p class="field-help">L’ouverture des SMS nécessite une application compatible. Aucun message n’est envoyé automatiquement. Vous pouvez aussi appeler le 06 11 49 91 53.</p><p id="copy-status" role="status"></p><button class="text-button" id="edit-brief" type="button">Modifier mon projet</button></section></div></section>`;

const legal = `<article class="legal-page wrap section"><h1>Informations légales</h1><p class="large-copy">Les informations d’identification de l’entreprise.</p><h2>Éditeur</h2><p>CREATION & RENOVATION GESSIENNE<br>SAS — société par actions simplifiée<br>896 rue de l’Oudar, 01170 Gex, France<br>Téléphone : <a href="tel:+33611499153">06 11 49 91 53</a></p><h2>Immatriculation</h2><p>SIREN : 914 288 691<br>SIRET du siège : 914 288 691 00019<br>RCS : Bourg-en-Bresse<br>Activité : travaux de maçonnerie générale et gros œuvre de bâtiment (43.99C).</p><p><a href="https://annuaire-entreprises.data.gouv.fr/entreprise/creation-renovation-gessienne-914288691" target="_blank" rel="noopener noreferrer">Consulter la fiche officielle dans l’Annuaire des Entreprises<span class="sr-only"> (nouvel onglet)</span></a></p><h2>Contenu et photographies</h2><p>Les prestations et leurs conditions sont définies après échange et étude du projet. Le contenu de ce site ne constitue pas un devis.</p><p>Les visuels illustrent des ambiances et des matériaux. Ils ne représentent pas des chantiers réalisés par l’entreprise. <a href="/photographies.html">Consulter leurs sources.</a></p><h2>Statut de cette version</h2><p>Cette version de présentation est préparée pour validation par l’entreprise avant publication. Les coordonnées du directeur de publication, l’e-mail professionnel et l’identification de l’hébergeur seront complétés avec les informations validées pour la mise en ligne publique.</p><h2>Données personnelles</h2><p><a href="/confidentialite.html">Consulter la page de confidentialité.</a></p></article>`;

const privacy = `<article class="legal-page wrap section"><h1>Votre confidentialité.</h1><p class="large-copy">Vous préparez votre projet. Vos informations restent sur votre appareil.</p><h2>Le résumé de projet</h2><p>Le formulaire de contact ne transmet pas son contenu à un serveur et n’enregistre aucune donnée dans un compte, un cookie ou le stockage local du navigateur. Les informations saisies restent en mémoire pendant l’ouverture de la page. Un rechargement les efface.</p><h2>Téléchargement et copie</h2><p>Le bouton de téléchargement crée un fichier texte sur votre appareil. Le bouton de copie place, à votre demande, le résumé dans votre presse-papiers. Ces actions ne transmettent pas le résumé à l’entreprise.</p><h2>Ouverture d’un SMS</h2><p>Si vous choisissez « Ouvrir dans SMS », votre appareil transmet le texte à l’application de messagerie compatible que vous utilisez. Vous vérifiez le contenu et décidez vous-même de l’envoyer au 06 11 49 91 53. L’envoi dépend de votre forfait et de votre opérateur.</p><h2>Cookies et mesure d’audience</h2><p>Cette version n’intègre aucun cookie publicitaire, traceur de mesure d’audience, carte embarquée ou police chargée depuis un service externe. Les images et les polices sont servies avec le site.</p><h2>Liens externes et hébergement</h2><p>Le lien vers la carte ouvre Google Maps uniquement à votre demande. Le service d’hébergement peut traiter les informations techniques nécessaires à l’accès au site ; ses conditions dépendront de l’hébergement retenu lors de la publication publique.</p><h2>Nous contacter</h2><p>Pour toute question relative à ces informations, contactez l’entreprise au <a href="tel:+33611499153">06 11 49 91 53</a> ou à son adresse : 896 rue de l’Oudar, 01170 Gex, France.</p></article>`;

const photos = `<article class="legal-page wrap section"><h1>Des ambiances,<br>pour se projeter.</h1><p class="large-copy">Ces images illustrent des matériaux, des volumes et des possibilités. Elles ne représentent pas des chantiers réalisés par Création & Rénovation Gessienne.</p><h2>Des visuels créés pour le site</h2><p>Les visuels de maison, de maçonnerie, de plâtrerie, de carrelage et d’escalier ont été créés avec ImageGen pour la direction artistique de ce site. Ce sont des images de synthèse à visée illustrative ; elles ne documentent pas des lieux réels ni des réalisations de l’entreprise.</p><h2>Identité visuelle</h2><p>Le logo et la palette de couleurs ont été fournis pour ce projet. Le logo visible est celui de la planche d’identité officielle ; seule sa taille de fichier a été optimisée pour le web.</p><h2>Typographie</h2><p>Montserrat est servie localement avec le site et distribuée sous licence SIL Open Font License. <a href="/assets/OFL-Montserrat.txt">Consulter la licence de la police.</a></p></article>`;

const pages = [
  [
    "index.html",
    "Maçonnerie, plâtrerie & carrelage à Gex",
    "Création & Rénovation Gessienne : entreprise du bâtiment à Gex. Découvrez nos savoir-faire et préparons votre projet de travaux.",
    home,
    "",
  ],
  ...serviceDetails.map((service) => [
    `${service.id}.html`,
    `${service.title} à Gex`,
    service.intro,
    servicePage(service),
    "service",
  ]),
  [
    "entreprise.html",
    "Une entreprise du bâtiment à Gex",
    "Découvrez Création & Rénovation Gessienne, entreprise française de maçonnerie, plâtrerie, cloisons et carrelage implantée à Gex.",
    about,
    "entreprise",
  ],
  [
    "contact.html",
    "Parlons de votre projet",
    "Contactez Création & Rénovation Gessienne au 06 11 49 91 53 à Gex ou préparez le résumé de vos travaux.",
    contact,
    "contact",
  ],
  [
    "mentions-legales.html",
    "Informations légales",
    "Identification et informations de Création & Rénovation Gessienne, SIREN 914 288 691 à Gex.",
    legal,
    "",
  ],
  [
    "confidentialite.html",
    "Confidentialité",
    "Comment fonctionne le résumé de projet et quelles informations restent sur votre appareil.",
    privacy,
    "",
  ],
  [
    "photographies.html",
    "Visuels et identité visuelle",
    "Sources des photographies d’ambiance et informations sur les visuels illustratifs du site.",
    photos,
    "",
  ],
];

pages.push(...regionalRows({ picture, action, contactBand }));

await mkdir("dist/en", { recursive: true });
for (const [file, title, description, body, current] of pages) {
  const pageDescription = seoDescriptions[file]?.fr ?? description;
  const html = layout(
    title,
    pageDescription,
    body,
    current,
    file === "index.html" ? "" : file,
  );
  await writeFile(`dist/${file}`, html);
  let englishHtml = createEnglishPage(html, { file, origin });
  const serviceType =
    serviceDetails.find((service) => `${service.id}.html` === file)?.title ??
    (file === "renovation-interieure.html"
      ? "Rénovation intérieure"
      : undefined);
  const data = structuredData({
    origin,
    file,
    title: english[title] ?? title,
    description: english[pageDescription] ?? pageDescription,
    locale: "en",
    serviceType: serviceType
      ? (english[serviceType] ?? serviceType)
      : undefined,
  });
  englishHtml = englishHtml.replace(
    /(<script type="application\/ld\+json">)[\s\S]*?(<\/script>)/,
    (_, start, end) => start + jsonLd(data) + end,
  );
  await writeFile(`dist/en/${file}`, englishHtml);
}
await copyFile("src/styles.css", "dist/styles.css");
await copyFile("src/app.mjs", "dist/app.mjs");
await copyFile("src/brief.mjs", "dist/brief.mjs");
await copyFile("src/i18n.mjs", "dist/i18n.mjs");
await copyFile("src/business.mjs", "dist/business.mjs");
await copyFile("src/motion.mjs", "dist/motion.mjs");
await writeFile("dist/robots.txt", robotsFile(seoConfig));
await writeFile(
  "dist/sitemap.xml",
  createSitemap(
    pages.map(([file]) => file),
    seoConfig,
  ),
);
await writeFile(
  "dist/assets/favicon.svg",
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#0E2A47"/><path d="M14 30 32 13l18 17v22H14Z" fill="none" stroke="#FF8A00" stroke-width="5"/><path d="M29 37h8v15h-8Z" fill="white"/></svg>',
);
for (const file of [
  "hero.webp",
  "identite-officielle.webp",
  "maconnerie.webp",
  "platrerie.webp",
  "carrelage.webp",
])
  await readFile(`dist/assets/${file}`);
console.log(
  `Built ${pages.length * 2} pages (French + English). No runtime dependencies.${origin ? " Site origin: " + origin : " Local preview: SITE_URL not configured."}`,
);
