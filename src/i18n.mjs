export const messages = {
  fr: {
    services: {
      maconnerie: "Maçonnerie",
      platrerie: "Plâtrerie & cloisons",
      carrelage: "Carrelage",
      plusieurs: "Plusieurs travaux / à définir",
    },
    errors: {
      service: "Choisissez le type de travaux qui correspond à votre projet.",
      city: "Indiquez une commune (2 à 100 caractères).",
      description: "Décrivez vos travaux en 20 à 2 000 caractères.",
      name: "Le nom doit contenir au maximum 100 caractères.",
      phone: "Vérifiez le numéro de téléphone ou laissez ce champ vide.",
    },
    checkFields: "Vérifiez les champs indiqués pour continuer.",
    copied: "Résumé copié.",
    copyUnavailable:
      "La copie automatique est indisponible. Téléchargez le résumé ou sélectionnez son texte.",
    downloadName: "mon-projet-gessienne.txt",
    summary: {
      title: "PROJET — CRÉATION & RÉNOVATION GESSIENNE",
      service: "Travaux",
      city: "Commune",
      timing: "Période souhaitée",
      name: "Nom",
      phone: "Téléphone",
      discuss: "À discuter",
      undefinedService: "À définir",
      notice:
        "Ce résumé est une demande de prise de contact, sans engagement ni estimation de prix.",
    },
  },
  en: {
    services: {
      maconnerie: "Masonry",
      platrerie: "Plastering & partitions",
      carrelage: "Tiling",
      plusieurs: "Several types of work / to be discussed",
    },
    errors: {
      service: "Choose the type of work that best matches your project.",
      city: "Enter a town or village (2 to 100 characters).",
      description: "Describe your project in 20 to 2,000 characters.",
      name: "Your name must be no longer than 100 characters.",
      phone: "Check the phone number or leave this field empty.",
    },
    checkFields: "Check the highlighted fields to continue.",
    copied: "Summary copied.",
    copyUnavailable:
      "Automatic copying is unavailable. Download the summary or select its text.",
    downloadName: "my-gessienne-project.txt",
    summary: {
      title: "PROJECT — CRÉATION & RÉNOVATION GESSIENNE",
      service: "Work",
      city: "Town or village",
      timing: "Preferred timeframe",
      name: "Name",
      phone: "Phone",
      discuss: "To be discussed",
      undefinedService: "To be defined",
      notice:
        "This summary is a request to get in touch. It is not a commitment or a price estimate.",
    },
  },
};

export function getMessages(locale = "fr") {
  return messages[locale === "en" ? "en" : "fr"];
}

export function getPagePath(file = "index.html", locale = "fr") {
  return `${locale === "en" ? "/en/" : "/"}${file === "index.html" ? "" : file}`;
}

export function getSiteOrigin(value = "") {
  if (!value) return "";
  const url = new URL(value);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.pathname !== "/" ||
    url.search ||
    url.hash ||
    url.username ||
    url.password
  ) {
    throw new Error(
      "SITE_URL must be an http(s) origin without a path, credentials, query or fragment.",
    );
  }
  return url.origin;
}
