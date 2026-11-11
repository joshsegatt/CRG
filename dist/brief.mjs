import { getMessages } from "./i18n.mjs";

export const services = getMessages("fr").services;

export function validateStep(step, data, locale = "fr") {
  const errors = {};
  const text = getMessages(locale).errors;
  if (step === 1 && !Object.hasOwn(services, data.service ?? "")) {
    errors.service = text.service;
  }
  if (step === 2) {
    const city = (data.city ?? "").trim();
    const description = (data.description ?? "").trim();
    if (city.length < 2 || city.length > 100) errors.city = text.city;
    if (description.length < 20 || description.length > 2000)
      errors.description = text.description;
  }
  if (step === 3) {
    if ((data.name ?? "").length > 100) errors.name = text.name;
    const phone = (data.phone ?? "").trim();
    const digitCount = phone.replace(/\D/g, "").length;
    if (
      phone &&
      (!/^\+?[\d\s().-]{8,25}$/.test(phone) ||
        digitCount < 8 ||
        digitCount > 15)
    )
      errors.phone = text.phone;
  }
  return errors;
}

export function createSummary(data, locale = "fr") {
  const messages = getMessages(locale);
  const text = messages.summary;
  return [
    text.title,
    "",
    `${text.service} : ${messages.services[data.service] ?? text.undefinedService}`,
    `${text.city} : ${(data.city ?? "").trim()}`,
    `${text.timing} : ${data.timing || text.discuss}`,
    "",
    (data.description ?? "").trim(),
    "",
    data.name?.trim() ? `${text.name} : ${data.name.trim()}` : undefined,
    data.phone?.trim() ? `${text.phone} : ${data.phone.trim()}` : undefined,
    "",
    text.notice,
  ]
    .filter((line) => line !== undefined)
    .join("\n");
}

export function createSmsLink(summary) {
  return `sms:+33647742333?body=${encodeURIComponent(summary)}`;
}
