import { validateStep, createSummary, createSmsLink } from "./brief.mjs";
import { getMessages } from "./i18n.mjs";

const locale = document.documentElement.lang === "en" ? "en" : "fr";
const text = getMessages(locale);

document.querySelectorAll("a[data-language]").forEach((link) => {
  const destination = new URL(link.href);
  destination.search = location.search;
  destination.hash = location.hash;
  link.href = destination.href;
});

const menu = document.querySelector("#main-nav");
const menuButton = document.querySelector("#menu-toggle");

function closeMenu() {
  menuButton?.setAttribute("aria-expanded", "false");
  menu?.classList.remove("is-open");
}

menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  menu?.classList.toggle("is-open", open);
});
menu
  ?.querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuButton?.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});

const form = document.querySelector("#project-form");
if (form instanceof HTMLFormElement) {
  let step = 1;
  let summary = "";
  const panels = [...form.querySelectorAll("[data-step]")];
  const previous = form.querySelector("#previous-step");
  const next = form.querySelector("#next-step");
  const finish = form.querySelector("#finish-brief");
  const status = document.querySelector("#form-status");
  const result = document.querySelector("#brief-result");
  const output = document.querySelector("#brief-text");
  const params = new URLSearchParams(location.search);
  const selected = form.querySelector(
    `input[name="service"][value="${["maconnerie", "platrerie", "carrelage"].includes(params.get("service")) ? params.get("service") : ""}"]`,
  );
  if (selected instanceof HTMLInputElement) selected.checked = true;

  function data() {
    return Object.fromEntries(new FormData(form).entries());
  }

  function showStep(target, focus = true) {
    step = target;
    panels.forEach((panel) => {
      panel.hidden = Number(panel.dataset.step) !== step;
    });
    form.querySelectorAll("[data-progress]").forEach((item) => {
      if (Number(item.dataset.progress) === step)
        item.setAttribute("aria-current", "step");
      else item.removeAttribute("aria-current");
    });
    previous.hidden = step === 1;
    next.hidden = step === 3;
    finish.hidden = step !== 3;
    status.textContent = "";
    if (focus) panels[step - 1].querySelector("legend").focus();
  }

  function validateCurrent() {
    const errors = validateStep(step, data(), locale);
    panels[step - 1]
      .querySelectorAll("[aria-invalid]")
      .forEach((field) => field.removeAttribute("aria-invalid"));
    form.querySelectorAll("[data-error]").forEach((item) => {
      item.textContent = "";
    });
    for (const [name, message] of Object.entries(errors)) {
      const error = form.querySelector(`[data-error="${name}"]`);
      if (error) error.textContent = message;
      form
        .querySelector(`[name="${name}"]`)
        ?.setAttribute("aria-invalid", "true");
    }
    if (Object.keys(errors).length) {
      status.textContent = text.checkFields;
      form.querySelector(`[name="${Object.keys(errors)[0]}"]`)?.focus();
      return false;
    }
    return true;
  }

  next.addEventListener("click", () => {
    if (validateCurrent()) showStep(step + 1);
  });
  previous.addEventListener("click", () => showStep(step - 1));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (step < 3) {
      if (validateCurrent()) showStep(step + 1);
      return;
    }
    if (!validateCurrent()) return;
    summary = createSummary(data(), locale);
    output.textContent = summary;
    document.querySelector("#send-sms").href = createSmsLink(summary);
    form.hidden = true;
    result.hidden = false;
    result.querySelector("h2").focus();
  });
  document.querySelector("#edit-brief").addEventListener("click", () => {
    result.hidden = true;
    form.hidden = false;
    showStep(2);
  });
  document.querySelector("#download-brief").addEventListener("click", () => {
    const url = URL.createObjectURL(
      new Blob([summary], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = text.downloadName;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  document.querySelector("#copy-brief").addEventListener("click", async () => {
    const copyStatus = document.querySelector("#copy-status");
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(summary);
      copyStatus.textContent = text.copied;
    } catch {
      copyStatus.textContent = text.copyUnavailable;
    }
  });
  showStep(1, false);
}
