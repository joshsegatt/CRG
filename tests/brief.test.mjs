import test from "node:test";
import assert from "node:assert/strict";
import { validateStep, createSummary, createSmsLink } from "../src/brief.mjs";

test("requires a recognized service, including hostile property names", () => {
  for (const service of ["", "toString", "__proto__", "<script>"])
    assert.ok(validateStep(1, { service }).service);
  assert.deepEqual(validateStep(1, { service: "maconnerie" }), {});
});
test("requires an informative project and a commune", () => {
  assert.ok(validateStep(2, { city: " ", description: " " }).city);
  assert.ok(
    validateStep(2, { city: "Gex", description: "Petits travaux" }).description,
  );
  assert.deepEqual(
    validateStep(2, {
      city: "Gex",
      description: "Créer une cloison dans une chambre existante.",
    }),
    {},
  );
  assert.ok(
    validateStep(2, { city: "G".repeat(101), description: "a".repeat(2001) })
      .city,
  );
  assert.ok(
    validateStep(2, { city: "Gex", description: "a".repeat(2001) }).description,
  );
});
test("optional contact fields accept empty input and reject malformed phone", () => {
  assert.deepEqual(validateStep(3, { name: "", phone: "" }), {});
  assert.deepEqual(
    validateStep(3, { name: "Élodie", phone: "+33 6 12 34 56 78" }),
    {},
  );
  assert.ok(validateStep(3, { phone: "bonjour@example.fr" }).phone);
  for (const phone of [
    "........",
    "--------",
    "((((((((",
    "12......",
    "1234567890123456",
  ]) {
    assert.ok(validateStep(3, { phone }).phone);
  }
  assert.ok(validateStep(3, { name: "a".repeat(101) }).name);
});
test("summary preserves French and input as plain text; SMS encodes it completely", () => {
  const data = {
    service: "carrelage",
    city: " Gex ",
    description: "Sol de cuisine : 25 m². Texte <b>littéral</b> & accents.",
    name: "Élodie",
    phone: "",
    timing: "Dans les 3 prochains mois",
  };
  const summary = createSummary(data);
  assert.match(summary, /Carrelage/);
  assert.match(summary, /Commune : Gex/);
  assert.match(summary, /25 m²/);
  assert.match(summary, /<b>littéral<\/b>/);
  assert.match(summary, /Élodie/);
  assert.doesNotMatch(summary, /undefined/);
  const link = createSmsLink(summary);
  assert.ok(link.startsWith("sms:+33611499153?body="));
  assert.equal(decodeURIComponent(link.split("?body=")[1]), summary);
});
test("no personal data is silently added to an empty brief", () => {
  const summary = createSummary({
    service: "plusieurs",
    city: "Gex",
    description: "Rénover les murs de mon salon.",
  });
  assert.doesNotMatch(summary, /Nom :|Téléphone :/);
  assert.match(summary, /sans engagement/);
});
