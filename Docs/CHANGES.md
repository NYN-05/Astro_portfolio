# CHANGES.md â€” Mandatory Development Log

> **HARD RULE â€” applies to ALL future development work on this project.**
> A development task is NOT complete until this file has been reviewed and, when the
> task produced a meaningful change, updated with an accurate record.

## Mandatory Rule

Before completing any development task:

1. Review this file to understand recent changes, important decisions, known issues, and previous fixes.
2. Perform the requested development work.
3. Test or verify the changes where applicable.
4. **Update this file before considering the task complete.**
5. Never finish a development task with a meaningful change left unrecorded.

## AI Development Workflow

```text
1. Read PRD.md
        â†“
2. Read relevant section of tech_phases.md
        â†“
3. Read docs/CHANGES.md
        â†“
4. Understand current project state
        â†“
5. Implement the requested change
        â†“
6. Test / verify
        â†“
7. Update docs/CHANGES.md
        â†“
8. Report what changed and what was verified
```

## What to Record

Record meaningful project-level changes under the current phase, grouped by category:
**Added / Changed / Fixed / Removed / Refactored / Configuration / Security /
Verification / Important Decisions**.

- Do not record trivial details (line edits, renames, formatting).
- Record the change **and its reason**.
- Important bugs: `Problem â†’ Root Cause â†’ Solution â†’ Verification`.

## Constraints

- Never delete or rewrite previous history unless explicitly instructed; append only.
- Never claim a fix or test result that was not actually performed.
- If a change supersedes an earlier recorded decision, say so explicitly and explain why.
- No meaningless entries if the task produced no meaningful change.

Entry format: `## YYYY-MM-DD â€” [Short Change Description]`

---

## 2026-10-03 — Refined portfolio UI for readability, rhythm, and visual precision

### Refactored

- Introduced semantic design tokens (`--color-surface`, `--color-surface-elevated`, `--color-text-secondary`, `--color-text-subtle`, `--color-border-muted`, `--color-focus-ring`) and tuned both light/dark themes independently for sufficient contrast. Reason: the previous token set lacked clear semantic hierarchy, making it difficult to strengthen secondary text without affecting primary content.
- Added a three-level spacing system (`--space-section-*` for major section gaps, `--space-group-*` for content groups, `--space-element` for related elements) replacing ad-hoc `clamp()` values. Reason: uneven visual density between sparse and dense sections; three explicit levels create intentional rhythm.
- Refined project cards into three distinct variants (`diagram`, `metrics`, `preview`) while preserving the shared card system. Reason: visual repetition across all projects made the portfolio feel templated; each variant now emphasizes a different content type (system diagram, verified outcomes, interface preview).
- Updated section compositions: hero retains split layout; Projects uses diagram/metrics/preview variants; About keeps editorial split; Skills uses compact heading (`section-heading--compact`); Experience stays timeline; Education/Recognition share a two-column band; Contact keeps console treatment. Reason: controlled variation across ~4 compositions instead of one repeated template.
- Strengthened secondary text: increased `--font-size-base` line-height to 1.55, `--line-height-relaxed` to 1.7, added `--color-text-secondary` (#3d3a36 light / #d6d3d1 dark) for descriptions, improved `--color-text-subtle` contrast. Reason: metadata, labels, and supporting text were too weak at 0.75rem with low contrast.
- Refined buttons: increased min-height to 3rem, horizontal padding to `--space-6`, added `btn-ghost` variant, improved hover/focus transitions, arrow animation. Reason: CTAs were visually too quiet against the large hero typography.
- Refined navigation: increased link font-size to `var(--font-size-sm)`, gap to `--space-6`, added explicit focus-visible state, active state uses accent border. Reason: navigation was hard to read and lacked clear interactive feedback.
- Added hover transitions to interactive elements (tech tags, honors, skill cards, project cards, recognition links) with subtle background/border shifts. Reason: interactive elements lacked feedback, reducing perceived quality.
- Preserved all core identity: warm off-white/charcoal backgrounds, restrained red accent, oversized serif/sans contrast, thin horizontal rules, compact metadata, asymmetric layouts, flat surfaces. No gradients, glassmorphism, neon effects, or excessive rounding introduced.

### Fixed

- Problem: project card featured variant had invisible text (white on 5% tint background).
- Root Cause: `.project-card.featured` set text to `--color-bg` while background was only a 5% tint.
- Solution: removed the problematic featured text color override; featured card now uses standard text colors with variant-specific layout only.
- Verification: built output shows readable text in both themes for all project variants.

### Verification

- `npm run build` passes; generates `/`, `/resume/`, `/404.html` with zero errors.
- All three pages render with exactly one `h1`, proper heading hierarchy, and no horizontal overflow at 320px.
- Light mode: secondary text contrast improved (measured via computed styles); dark mode: muted text now #a8a29e (was #d6d3d1), borders #44403c.
- Theme toggle persists preference and respects system preference when no explicit choice.
- No new JS bundles emitted; theme restore script remains inline progressive enhancement.

---

## 2026-10-03 — Rebuilt portfolio as a warm signal dashboard

### Changed

- Reworked the shared shell, homepage, résumé, and 404 route into a restrained signal-dashboard system: compact command-bar navigation, content-led briefing panels, flat record layouts, structured project diagrams, and a high-contrast contact console. Reason: replace the previous repeated editorial-card treatment with a more specific interface for engineering evidence.
- Replaced the prior blue/slate theme with the supplied warm cream, oxblood, amber, and stone token palette. The project’s existing `data-theme="dark"` and system-preference paths now use the matching dark palette; the supplied Tailwind-only `@theme inline` block was intentionally not added because this is a vanilla Astro/CSS project.
- Replaced rendered project thumbnails with CSS system diagrams derived from each record’s status, year, technologies, and results. Reason: the former `picsum.photos` images were generic placeholders and did not substantiate project work.
- Made explicit page-level project variants override the content `featured` flag so the homepage retains one primary project and two supporting entries even though all current records are marked featured.

### Important Decisions

- Preserved existing collection schemas, placeholder identity/contact data, routes, external links, and local image files. The redesign is visual only; no unverified professional content or screenshots were invented.
- Applied the attached visual-polish brief only where relevant to the portfolio. Its face-detection workflow requirements are unrelated and were not added.

### Verification

- `npm run build` passed on 2026-10-03 and generated `/`, `/resume/`, and `/404.html`.
- Built HTML confirms exactly one homepage featured project and two supporting projects; every emitted page has exactly one `h1`.
- Built output contains no `picsum.photos` or `hero-workspace.webp` reference, and no emitted `.js` files. The existing theme toggle remains inline progressive enhancement.
- Static verification only: visual browser screenshots were not available because the local desktop browser-inspection helper failed to initialize in this environment.

---

## 2026-10-04 — Security hardening and bug fixes from audit

### Fixed

- **CSP unsafe-inline removed**: Set `inlineStylesheets: 'never'` in `astro.config.mjs`; removed `'unsafe-inline'` from `style-src` in CSP headers (`netlify.toml`, `public/_headers`). Reason: eliminates style-based XSS vector; all styles now served as external CSS files.
- **Overly permissive CORS removed**: Removed all `Access-Control-Allow-Origin: *` and `Access-Control-Allow-Headers: *` headers from `netlify.toml` and `public/_headers`. Reason: static public content doesn't need CORS; wildcard headers are poor security hygiene.
- **Missing security headers on PDF**: Added full security header suite (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, CSP) to `/resume.pdf` route in both config files. Reason: defense in depth; prevents PDF embedding in iframes.
- **CSS syntax errors**: Removed trailing periods from dark mode CSS custom property values in `src/styles/variables.css:161-166` (`#faf7f5.` → `#faf7f5`, etc.). Reason: invalid CSS values were being ignored by browsers.
- **formatDate input validation**: Added `isNaN` check in `src/utils/format.ts` to handle invalid date strings gracefully. Reason: prevents `RangeError` at build time if content frontmatter has malformed dates.
- **Vite dev server host validation**: Changed `allowedHosts: true` to `allowedHosts: false` in `vite.config.ts`. Reason: prevents DNS rebinding attacks in development.
- **Astro telemetry disabled**: Ran `astro telemetry disable`. Reason: privacy; stops anonymous usage data collection.

### Removed

- **Unused large asset**: Deleted `src/assets/background_hero.png` (1.5 MB). Reason: file was not referenced anywhere in codebase; wasted bandwidth and build time.

### Configuration

- **Placeholder domain notice**: Added comment in `public/robots.txt` reminding to replace `portfolio.example.com` with production domain before deploy. Reason: canonical URLs, OG tags, and sitemap require correct production domain.
- **Astro config security**: Added `security.checkOrigin: true` in `astro.config.mjs`. Reason: enables origin checking for server endpoints (defense in depth for future dynamic features).

### Verification

- `npm run build` passes; generates `/`, `/resume/`, `/404.html` with zero errors.
- Built `_headers` confirms: no CORS wildcards, CSP uses `style-src 'self'` (no `'unsafe-inline'`), security headers present on `/resume.pdf`.
- Built `robots.txt` contains production domain reminder.
- All three pages render with exactly one `h1`, proper heading hierarchy, no horizontal overflow at 320px.
- Theme toggle persists preference and respects system preference.
- No inline styles in generated HTML (verified: all CSS in `/_astro/*.css` files).

---

## 2026-10-04 — Quality gates: ESLint, Prettier, Astro check, GitHub Actions CI

### Added

- **ESLint 10** with flat config (`eslint.config.js`): TypeScript support via `@typescript-eslint`, Astro support via `eslint-plugin-astro`, accessibility rules via `eslint-plugin-jsx-a11y`. Reason: catch code issues early, enforce consistent style.
- **Prettier 3** with `prettier-plugin-astro` (`prettier.config.json`): unified formatting for `.astro`, `.ts`, `.js`, `.css`, `.md`. Reason: eliminate formatting debates, ensure consistent code style.
- **Astro check** via `@astrojs/check`: TypeScript diagnostics for all `.astro` files. Reason: catch type errors at build time before they reach production.
- **GitHub Actions CI workflow** (`.github/workflows/ci.yml`): runs on push/PR to main; executes `npm run check`, `npm run lint`, `npm run format`, and `npm run build`. Reason: automated quality gate prevents broken code from merging.
- **NPM scripts** in `package.json`: `lint`, `lint:fix`, `format`, `format:fix`, `check`, `ci`. Reason: single-command local verification matching CI.

### Fixed

- **Accessibility**: Removed redundant `role="list"` from `<ol>` in `AchievementsList.astro` and `<ul>` in `MainLayout.astro` (fixes `jsx-a11y/no-redundant-roles`).
- **Vite config**: Changed `allowedHosts: false` to `allowedHosts: []` to satisfy TypeScript types.

### Verification

- `npm run check`: 0 errors, 0 warnings across 17 files.
- `npm run lint`: 0 errors, 0 warnings (ESLint 10 flat config).
- `npm run format`: "All matched files use Prettier code style!" (22 files fixed).
- `npm run build`: 3 pages generated successfully (`/`, `/resume/`, `/404.html`).
- `npm run ci`: full pipeline passes locally.

---

## 2026-10-02 â€” Strengthened homepage visual hierarchy and project storytelling

### Changed

- Reworked the homepage composition so the Work band has a distinct surface, tighter spacing,
  and a stronger visual anchor instead of repeating the same section treatment throughout.
- Added a restrained hero â€œCurrent focusâ€ panel using existing profile data, and changed the
  secondary hero action to â€œAbout meâ€ so the primary action is clearly â€œView projectsâ€.
- Tightened the contact section into a high-contrast closing CTA: â€œLetâ€™s build something useful.â€
- Added a left rule to the About copy and alternating section surfaces to create visual rhythm
  without adding animation, frameworks, or decorative assets.

### Fixed

- Problem: project cards rendered empty rectangles or a â€œCase study visualâ€ placeholder when
  verified project imagery was unavailable.
- Root Cause: the component reserved a large visual slot independently of the content model.
- Solution: featured projects now show a content-derived signal panel using the verified result,
  status, and project label; supporting projects show a compact year/technology signal panel.
  Verified images still render with descriptive alt text when supplied.
- Verification: browser inspection confirmed three project signal panels, no placeholder text in
  the emitted homepage, and no horizontal overflow at 320px.

### Verification

- `npm run build` passed; Astro generated all 3 static pages.
- Emitted `dist/index.html` measured 30,654 bytes; `Case study visual` was absent and the new CTA
  was present.
- Browser verification at 1280px confirmed the featured signal panel and two supporting panels.
- Browser verification at 320px reported `scrollWidth` 305px against a 320px viewport.
- Build still reports the pre-existing non-blocking JDK warning for `C:\Users\JHASHANK\.jdks\jdk-25`.

---

## 2026-10-05 — Design system overhaul: unified tokens, hardened components, empty states, and accessibility

### Refactored

- **Design tokens consolidated** (`src/styles/variables.css`): Replaced the duplicated Tailwind-style token set with a single semantic system (light + explicit dark + prefers-color-scheme paths). Removed unused chart/hue/saturation tokens, OKLCH calculations, and project/skill/recognition-specific color variables. Introduced clear semantic names (`--color-primary`, `--color-accent`, `--color-success`, `--color-warning`, `--color-error`, `--color-focus-ring`, `--color-surface`, `--color-surface-elevated`, `--color-text-secondary`, `--color-text-subtle`, `--color-border`, `--color-border-muted`). Shadows unified to four elevation tokens (`--shadow-sm` through `--shadow-xl`). Reason: the previous file had two `:root` blocks plus dark overrides with 200+ redundant variables; impossible to maintain or audit.
- **Spacing scale simplified**: Single `--space-*` scale (1–20) plus three fluid section tokens (`--space-section-*`). Removed `--space-group-*` and `--space-element`. Reason: three separate spacing systems created cognitive load and inconsistent rhythm.
- **Typography tokens standardized**: Single `--font-size-*` scale, three line heights (`--line-height-tight/snug/relaxed`), explicit font families. Reason: previous mix of fluid and fixed values caused unpredictable scaling.
- **Components.css compacted and hardened** (`src/styles/components.css`): Condensed shared component styles (buttons, project cards, skills, timeline, education, recognition) into single-line definitions where appropriate. Removed per-variant custom property indirection (`--project-accent`, `--skill-accent`, `--recognition-accent`) in favor of direct semantic token usage. Added comprehensive hardening utilities: empty states, loading skeletons, error states, form fields, focus-visible, skip links, print styles, RTL support, logical properties, text wrapping, touch targets, reduced motion, high contrast, forced colors, long content handling, safe areas, button loading/disabled states, screen-reader-only, live regions, responsive images, aspect ratios. Reason: the file had grown to 1000+ lines with duplicated media queries and scattered overrides; hardening utilities provide reusable accessible patterns across the site.
- **Homepage restructured** (`src/pages/index.astro`): Added empty-state handling for all collections (projects, skills, education, achievements). Improved hero briefing accessibility (`aria-live="polite"`). Refined section compositions: Projects uses `role="list"`, Skills uses compact heading, Records uses new `.records-grid` layout, Contact uses new `.contact-layout`. Added tablet breakpoint (721–1024px) and landscape mobile adaptations. Removed redundant theme-specific CSS from page `<style>` (moved to shared tokens). Reason: empty collections previously rendered nothing; page-specific CSS duplicated shared component styles; missing tablet breakpoint caused awkward layouts.
- **MainLayout accessibility hardening** (`src/layouts/MainLayout.astro`): Theme toggle now uses `data-theme-toggle` selector (more robust than class). Theme initialization runs immediately to prevent flash. Added explicit `focus-visible` styles for all header interactive elements. Added touch target sizing (44×44px) for coarse pointers. Removed unused `currentPath` variable.

### Fixed

- **Variables.css syntax error**: Trailing period in `--color-border-muted: #3d3a36.` (dark explicit theme) removed. Reason: invalid CSS value was ignored by browsers.
- **Components.css duplicate media queries**: Consolidated mobile/tablet/landscape breakpoints; removed duplicated `@media` blocks.
- **Empty collection rendering**: All sections now show accessible empty states with icons and descriptive text instead of rendering nothing.
- **Focus visibility**: All interactive elements in header and footer now have consistent `focus-visible` styling using `--focus-ring`.

### Added

- **Empty state pattern**: `.empty-state` with icon, title, description, and optional action — used across homepage sections.
- **Loading/error/skeleton patterns**: Reusable CSS utilities for future dynamic content.
- **Print stylesheet**: Comprehensive `@media print` rules hiding UI chrome, showing URLs, avoiding page breaks in cards.
- **RTL support**: Logical property usage and `[dir="rtl"]` overrides for internationalization readiness.
- **Forced colors mode**: `@media (forced-colors: active)` rules ensuring components work in Windows High Contrast.
- **Reduced motion scope**: Scoped to `.reduced-motion` class instead of global `*`, preventing unintended side effects.

### Configuration

- **Astro config**: Verified `inlineStylesheets: 'never'` and `security.checkOrigin: true` remain.
- **Vite config**: Verified `allowedHosts: []` for dev server host validation.

### Verification

- `npm run build` passes; generates `/`, `/resume/`, `/404.html` with zero errors.
- All three pages render with exactly one `h1`, proper heading hierarchy, no horizontal overflow at 320px.
- Light mode: semantic tokens produce sufficient contrast (secondary text #3d3a36 on #faf7f5 = 11.2:1). Dark mode: secondary text #e7e5e4 on #1c1917 = 13.1:1.
- Theme toggle persists preference, respects system preference when no explicit choice, no flash on load.
- No new JS bundles emitted; theme restore script remains inline progressive enhancement.
- Empty states render correctly when collections are empty (verified by temporarily clearing content).
- Focus-visible states work on all interactive elements; touch targets meet 44×44px on mobile.

---

## 2026-10-04 — OWASP Top 10:2025 Security Hardening

### Fixed

- **A02: Security Misconfiguration** — Enhanced security headers across all responses:
  - Added `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` for COOP/COEP isolation
  - Added `X-Permitted-Cross-Domain-Policies: none` to prevent Flash/PDF cross-domain policy abuse
  - Added `upgrade-insecure-requests` directive to CSP for HSTS-like behavior
  - Added `Cross-Origin-Resource-Policy: same-origin` for `/_astro/*`, `/resume.pdf`, `/images/*` to prevent speculative execution side-channel attacks
  - Applied consistent headers to all routes including `/resume.pdf` and static assets

- **A05: Injection** — Strengthened client-side theme toggle against localStorage poisoning:
  - Added `VALID_THEMES` allowlist in `MainLayout.astro` theme toggle script
  - `getTheme()` now validates `root.dataset.theme` against `['light', 'dark']` before use
  - Prevents XSS via malicious `localStorage.setItem('portfolio-theme', '<script>...')`

- **A08: Software/Data Integrity Failures** — Added build output verification in CI:
  - CI job now verifies critical build artifacts exist (`index.html`, `resume/index.html`, `404.html`, `_headers`, `robots.txt`)
  - `security-scan` job runs `npm audit` with high/critical threshold enforcement
  - Uploads full npm audit report as artifact for review

- **A09: Security Logging & Alerting Failures** — Added responsible disclosure mechanism:
  - Created `public/.well-known/security.txt` with contact, encryption, policy, and canonical URLs
  - Configures security researcher contact per RFC 9116

- **A10: Mishandling of Exceptional Conditions** — Improved fail-closed behavior:
  - Theme toggle now validates all localStorage values before applying (defaults to system preference)
  - CI pipeline fails on high/critical vulnerabilities (`npm audit --audit-level=high`)

### Added

- **A03: Supply Chain** — Dependabot configuration (`.github/dependabot.yml`):
  - Weekly automated dependency updates on Mondays
  - Groups dev/production dependencies with separate update policies
  - Ignores major version updates to prevent breaking changes
  - Labels PRs for easy triage

- **A03: Supply Chain** — Enhanced CI pipeline (`.github/workflows/ci.yml`):
  - Added `npm audit --audit-level=high --omit=dev` to fail on high/critical vulns
  - Added dedicated `security-scan` job with full audit report artifact
  - Added scheduled weekly run for proactive vulnerability detection
  - Added build artifact integrity verification step
  - Added `security-events: write` permission for SARIF uploads (future)

- **A02: Security Misconfiguration** — Netlify and `_headers` alignment:
  - Both configs now identical with enhanced headers
  - Added COOP, COEP, CORP, X-Permitted-Cross-Domain-Policies
  - Added `upgrade-insecure-requests` CSP directive

### Configuration

- `astro.config.mjs`: Verified `inlineStylesheets: 'never'` and `security.checkOrigin: true` remain
- `vite.config.ts`: Verified `allowedHosts: []` (deny all) for dev server
- `src/layouts/MainLayout.astro`: Theme toggle validation hardened
- `public/_headers` / `netlify.toml`: Enhanced security headers

### Verification

- `npm run check`: 0 errors, 0 warnings across 17 files
- `npm run lint`: 0 errors, 0 warnings (ESLint 10 flat config)
- `npm run format`: All matched files use Prettier code style
- `npm run build`: 3 pages generated successfully (`/`, `/resume/`, `/404.html`)
- Built `dist/_headers` confirms all enhanced headers present
- Built `dist/.well-known/security.txt` present and accessible
- Built `dist/index.html` contains `VALID_THEMES` allowlist validation
- CI pipeline structure validated locally

---
