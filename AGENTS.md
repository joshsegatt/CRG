# Project instructions

Read PRODUCT.md, DESIGN.md and .senior/project.json before substantive changes. Keep French at the root and English under /en/; every public page must have a language counterpart. Use Node.js >=22 and npm scripts. There are no runtime dependencies.

For interface work, use Impeccable as requested by the owner: run `npm exec --yes --package=impeccable@4.8.2 -- impeccable context --target <file>` before design changes, follow its applicable craft and command references, then run one final `impeccable detect` pass after finishing the UI. Preserve the official brand palette and Montserrat. Keep motion purposeful and honor reduced-motion preferences.

Use src/business.mjs as the business-fact authority. The confirmed phone is +33611499153, with one base in Gex and service in France and Switzerland including Veyrier. Never invent branches, projects, reviews, credentials, assurances, hours or an email. Architectural images are illustrative, not completed company projects.

Keep contact preparation local to the visitor's device unless the owner explicitly requests a real sending service. Public indexing requires an HTTPS SITE_URL and SITE_INDEXABLE=1; previews must remain noindex. Never commit .env files or .openai local configuration.

Run formatting, npm run lint, npm test, npm run build, npm run check, then verify desktop/mobile navigation and the contact flow in the browser. Syntax checking is not a TypeScript or ESLint check. Keep dist/ synchronized because this repository stores the static output.
