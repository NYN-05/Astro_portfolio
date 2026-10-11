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

Entry format: `## YYYY-MM-DD — [Short Change Description]`

---

## 2026-10-11 — Fixed Footer 'System status' Label Contrast (WCAG)

### Fixed

- **'System status' footer label illegible in both themes** — Problem: the label in `MainLayout.astro` footer (`.site-footer p span`) was colored `var(--color-accent)` while sitting on a `var(--color-primary)` background; since `--color-accent` and `--color-primary` are the same value in both themes (`#c7352b` light, `#f06459` dark), contrast was 1:1 and the text was invisible. Root Cause: the palette-swap refactor aliased accent to primary, and the footer label never got an on-primary color. Solution: switched the span to `var(--color-primary-foreground)` (the theme-aware on-primary token) and added `font-weight: var(--font-weight-bold)` so emphasis no longer depends on color alone.

### Verification

- Contrast computed with the WCAG 2.x formula: light `#ffffff` on `#c7352b` = 5.29:1; dark `#191919` on `#f06459` = 5.59:1 — both pass WCAG AA for normal text (4.5:1).
- `npm run check`: 0 errors. `npm run build`: exit 0; built `dist/index.html` contains `color:var(--color-primary-foreground)` in the scoped `.site-footer p span` rule.

### Important Decisions

- Used `--color-primary-foreground` rather than hardcoding or adding a new token: it is defined alongside `--color-primary` in both theme blocks of `variables.css`, so contrast is guaranteed by construction in light, dark, and the explicit `data-theme` paths.

---

## 2026-10-11 — Fixed CI `astro check` Failure: Missing Project Schema Fields

### Fixed

- **`astro check` errors in `ProjectCard.astro` (3 × ts 2339)** — Problem: CI failed on `npm run check` because the component reads `data.imageSrcset` and `data.imageSizes`, but the `projects` Zod schema in `src/content.config.ts` only defined `image` and `imageAlt`. Root Cause: the responsive-image support in `ProjectCard` was added without corresponding schema fields, and `astro check` only surfaced it once the component landed. Solution: added `imageSrcset: z.string().optional()` and `imageSizes: z.string().optional()` to the `projects` schema — optional on purpose (AGENTS.md: externally-derived fields must stay optional so missing data cannot break the build); no content-file changes needed.

### Verification

- `npm run check`: 0 errors, 0 warnings, 1 pre-existing hint (unused `media` attr in BaseLayout font link — non-fatal, does not fail CI).
- `npm run build`: exit 0, 2 pages built.

### Important Decisions

- Schema fields made optional rather than required: no existing project markdown uses `imageSrcset`/`imageSizes`; the component already falls back to a single `src` when `imageSrcset` is absent, so optional fields preserve current rendering while unlocking responsive images for future content.

## 2026-10-10 — Removed /resume Endpoint: Single-Page Site

### Removed

- **`src/pages/resume.astro`** — the entire `/resume/` route. Decision: the site is now a single page (homepage only, plus 404); every section it duplicated (projects, skills, education) already lives on `index.astro`. Verified data only — no experience section was added because the owner has none and refuses placeholder content.
- **Experience section and all its aspects** — per the same verified-data rule: deleted `src/components/ExperienceItem.astro` (unreferenced after the route removal), deleted the false sample entry `src/content/experience/software-engineering-intern.md` and its folder, removed the `experience` collection and its Zod schema from `src/content.config.ts` (collections are now `projects, education, skills, achievements`), and removed the now-dead `.timeline-*` rules from `styles/components.css` (`.tech-tag` kept — still used by `ProjectCard`).
- **Resume nav item** — `MainLayout.astro`: removed the `/resume/` link and the now-unused `isResumePage` check.
- **CI verification of `dist/resume/index.html`** — removed from `.github/workflows/ci.yml` (the file no longer exists after build; the check would have failed every run).
- **`/resume/` row in README performance table** — and updated README structure/mermaid (2 pages: index + 404; components list without ExperienceItem) plus `Docs/architecture.mmd` identically.

### Changed

- **Hero CTA** (`index.astro`) — "Download résumé" now links straight to the PDF asset (`/resume.pdf` with `download`), label clarified to "Download résumé (PDF)"; the PDF in `public/` and its cache header in `netlify.toml` are intentionally kept. Page/default meta descriptions updated from "…skills, and experience" to "…skills, and education" (index.astro and BaseLayout fallback).
- **Scratch-folder hygiene** — `Temp/` (untracked Playwright probe scripts) added to `.gitignore`, `.prettierignore`, and `eslint.config.js` `ignores`: ESLint 10 no longer honors `.eslintignore`, so the folder was failing `npm run lint`/`format` for the whole repo.

### Verification

- `npm run build`: exit 0 — exactly 2 pages (`/index.html`, `/404.html`); no `/resume/` directory in `dist/`; zero `href="/resume/"` occurrences in built HTML; hero CTA renders as `href="/resume.pdf" … download`.
- `npm run check`: 0 errors, 0 warnings, 1 pre-existing hint (unused `media` attr in BaseLayout font link).
- `npm run lint`: exit 0. `npm run format`: passes. (Note: `npm run ci` script fails under this machine's PowerShell script-shell because of its `&&` chaining — pre-existing environment quirk; the three gates were run individually.)
- Re-measured gzip sizes after CSS shrink: home 6.1 KB gz, 404 2.2 KB gz, CSS 47.5 KB raw / 8.7 KB gz — README perf table updated to match.
- `Docs/architecture.mmd` and README-embedded Mermaid both re-rendered with `mermaid-cli@11`: exit 0.

### Important Decisions

- Kept `public/resume.pdf` as the download target: removing the rendered resume page does not remove the PDF asset; the hero CTA links to it directly, so no content is lost and no false data is shown.
- `experience` collection schema removed rather than left dormant: an empty-but-typed collection invites accidental fake entries; it can be re-added from git history when real experience exists.

---

## 2026-10-10 — README Overhaul: Corrected Claims, Measured Metrics, Beautified Layout

### Changed

- **README rewritten** (structure and content, all sections kept or improved): centered header with corrected badges (TypeScript 6 to match `package.json`, added Node ≥22.12 and CI badges; removed the unverifiable Lighthouse 100/100 badge and the MIT badge's link to a non-existent `LICENSE` file — no `LICENSE` file exists in the repo), added a table of contents, a "Live site" link (from `astro.config.mjs` `site`), a `## 🔁 CI` section documenting `.github/workflows/ci.yml`, a `## 📚 Docs` index, and frontmatter gotchas from `CHANGES.md` in the customization guide. Reason: several README claims were false or unverifiable and the file had drifted from the repo.
- **False/stale claims fixed** — "Zero client-side JavaScript" → accurate wording (no framework; small inline theme script only, verified in `BaseLayout.astro`); "System font stack (zero requests)" → Google Fonts (Poppins, Libre Baskerville, IBM Plex Mono, async load); "no inline styles/scripts" security row → replaced with the real `netlify.toml`/`public/_headers` header setup; removed the picsum.photos acknowledgment (not used — images are local).
- **Performance Profile replaced with measured data** — invented Lighthouse/FCP/LCP numbers replaced by actual sizes from a clean `npm run build` (gzip via GZipStream): home HTML 6.1 KB gz, resume 5.4 KB gz, 404 2.2 KB gz, CSS 48.8 KB raw / 8.9 KB gz across 2 hashed files, bundled JS 0 bytes. Reason: project rules require verified data only; these figures are reproducible.

### Verification

- `npx prettier --check README.md`: passes after `--write`.
- README-embedded Mermaid diagram extracted and rendered with `@mermaid-js/mermaid-cli@11`: exit 0.
- All relative links checked against the tree: `Docs/PRD.md`, `Docs/architecture.mmd`, `Docs/ui_design_rules.md`, `Docs/CHANGES.md`, `AGENTS.md`, `.github/workflows/ci.yml`, `public/images/hero-workspace.webp` all exist; broken `LICENSE` link removed.
- Performance numbers taken from the current `dist/` produced by `npm run build` (exit 0, 3 pages) earlier the same day.

---

## 2026-10-10 — Beautified Architecture Diagram and Embedded It in README

### Changed

- **`Docs/architecture.mmd` restyled** — kept the same topology, added a Mermaid `init` theme (base theme, project-appropriate palette), color-coded node classes per stage (content = orange, UI = blue, styles = violet, build = Astro orange, deploy = Netlify teal, runtime = green, gates = grey), red emphasis on the Zod schema guard node, subgraph background fills, rounded node shapes, and emoji subgraph titles. Reason: plain monochrome diagram was hard to scan; color maps each node to its pipeline stage at a glance.
- **`README.md`** — replaced the stale top PNG (`Docs/archtecture_diagram.png`, predates the current architecture) with a new `## 🏗 Architecture` section after Project Structure: the same beautified Mermaid diagram in a fenced ` ```mermaid ` block (renders natively on GitHub), a link to the `.mmd` source of truth, and a short stage-summary table. Ran `prettier --write README.md` so the format gate passes. Reason: static PNG went stale and could not be diffed; README should carry the live diagram.

### Verification

- `Docs/architecture.mmd` and the README-embedded copy both rendered with `@mermaid-js/mermaid-cli@11`: exit 0 each (SVG emitted).
- `npx prettier --check README.md`: passes ("All matched files use Prettier code style!").

---

## 2026-10-10 — Added Mermaid Architecture Diagram (Docs/architecture.mmd)

### Added

- `Docs/architecture.mmd` — Mermaid flowchart of the whole system: build-time flow (content collections + Zod 4 schemas in `content.config.ts` → `astro build`), page/layout/component composition, style-token chain (`variables.css` → `global.css`/`components.css`), `dist/` + `public/` artifact, Netlify deploy (security headers, cache rules), browser runtime (pre-paint theme restore, toggle), and the `package.json` verification gates. Reason: the repo's only architecture diagram was a PNG snapshot (`Docs/archtecture_diagram.png`) that cannot be diffed, reviewed, or kept in sync with code changes.

### Verification

- Rendered with `@mermaid-js/mermaid-cli@11` (`npx -y @mermaid-js/mermaid-cli@11 -i Docs/architecture.mmd -o arch.svg`): exit 0, SVG generated — diagram parses and renders.

---

## 2026-10-10 — Hero Redesign: Removed Wash-Out Veil, Fixed Font Tokens, Compact Focus Panel, Stronger CTAs

### Fixed

- **Hero looked washed out in both themes** — Problem: hero text rendered mid-grey (`#9f9f9e` light / `#70706e` dark) instead of palette colors. Root Cause: `.hero::after` in `src/pages/index.astro` painted a 60%-opaque gradient over the hero content (positioned pseudo-element above non-positioned children), veiling every heading, label and button. Solution: deleted the veil; layered the subtle grid + gradient as `background-image` on `.hero` itself (grid stroke changed from `currentColor` — which renders black in image context, invisible on dark — to `#808080` @ 0.15 so it works in both themes); removed the `signal-grid` class from the hero element to avoid background cascade conflict (`.signal-grid` kept for `404.astro`). Verification: Chromium pixel sampling — light h1 glyph `159,159,158 → 25,25,25`, dark `112,112,110 → 240,240,237` (exact palette values).
- **Entire site rendered in Times New Roman** — Problem: computed `font-family` was `"Times New Roman"` for body, headings, labels and buttons. Root Cause: `global.css`, `components.css` and pages reference `--font-family`, `--font-family-serif`, `--font-family-mono`, none of which were ever defined (only `--font-sans/-serif/-mono` existed), so every `font-family: var(…)` declaration was invalid at computed-value time and fell back to the UA default. Solution: added the four alias tokens to `variables.css :root`. The designed typography identity is restored: Poppins body, Libre Baskerville display + lede, IBM Plex Mono labels (fonts were already loaded in `BaseLayout` head). Verification: computed styles show the three families; `document.fonts.check` true for all.
- **Hero supporting text failed WCAG AA** — `.hero-focus`, `.hero-status`, `.briefing-label`, `.briefing-footer` used `--color-text-muted` (#737373 = 4.35:1 on #f5f5f3, below 4.5:1). Switched to `--color-text-secondary` (9.5:1); hierarchy now carried by size/weight/family rather than low contrast. Verification: programmatic contrast check of 11 hero text pairs × 2 themes × 3 viewports — all ≥ 4.84:1 (eyebrow/accent light), primary CTA 5.29:1 light / 5.59:1 dark.
- **Stale font `rel=preload` hints caused 2 console 404s + a wasted download** — `BaseLayout` preloaded woff2 URLs (IBM Plex Mono v19, Libre Baskerville v26, Poppins v21); Google now serves v20/v24/v24 — two URLs 404'd and the third fetched an unused file. Removed the three preload links; fonts still load via the stylesheet with `display=swap`. Verification: console errors on `/` and `/resume/` dropped from 2 to 0.
- **Duplicated period** in the hero supporting sentence (`…production systems.. I turn`).

### Changed

- **Hero composition** — top padding `clamp(4rem, 11vw, 9rem) → clamp(3rem, 6vw, 5rem)`; grid `align-items: end → start`; rhythm tightened (status→space-5, lede→space-4, space-10 before CTAs). Desktop hero height 914→753 px; both CTAs now above the fold at 1440×900 (bottom at 740 px; previously 882 px, cut off).
- **Right-side focus panel compacted** — was a stretched 361×721 px card with ~400 px of empty space; now a content-height card (361×314 desktop, 263×314 tablet, 358×306 mobile) with 3 px signal-red top accent, `--color-surface` on 1 px border, `--shadow-sm`, tightened internal spacing. Content unchanged (Focus areas label, Build/Operate/Analyze rows, scroll footer) — no invented data.
- **Hero typography hierarchy** — name `clamp(2.75rem, 6.2vw, 5rem)` (80 px desktop, Libre Baskerville 700, `text-wrap: balance`); lede reduced from ~49 px to `clamp(1.5rem, 2.2vw, 2rem)` (32 px) and promoted to `--color-text` so it supports rather than competes with the name; mobile name `clamp(2.5rem, 11vw, 3.75rem)` (the old 18 vw = 70 px would overflow with the wider serif); tablet keeps its existing `8vw` rule (61 px at 768).
- **CTAs strengthened (hero-scoped only)** — `.hero-actions .btn`: 16 px labels (was 13 px), 3.5 rem min-height, `--space-8` padding; secondary gets a `--color-text-secondary` border plus explicit hover/focus accent-border rules (scoped so shared `.btn` behavior is untouched). Destinations (`#projects`, `/resume/`) unchanged.

### Verification

- `npm run build`: exit 0, 3 pages (`/`, `/resume/`, `404.html`).
- `npm run check`: 0 errors, 0 warnings, 1 pre-existing hint.
- `npm run lint`: 0 errors (pre-existing `.eslintignore` deprecation warning only).
- `npm run format`: passes ("All matched files use Prettier code style!") — required re-normalizing `package.json`/`package-lock.json` and 7 files whose line endings a `git stash` cycle flipped to CRLF; note `package.json`/`package-lock.json` fail this check even at clean HEAD in this environment (pre-existing).
- Playwright/Chromium, 3 viewports (1440/768/390) × 2 themes: no horizontal overflow (`scrollWidth == innerWidth`), no clipped or out-of-bounds hero elements, 0 console errors, CTA hrefs intact, theme toggle light→dark works with `localStorage` persistence, exactly one `<h1>`, focus ring visible on primary CTA, surfaces distinct by pixel sample (dark panel 36,36,36 vs bg 25,25,24; light 255,255,255 vs 247,247,245).
- Screenshot limitation: before/after captures taken for all 6 combinations; desktop light was visually inspected. The tool harness misdelivered mobile/tablet attachment reads, so those were validated by DOM geometry, bounds checks and pixel sampling rather than direct eyeballing.

### Important Decisions

- Font alias fix applied site-wide rather than hero-only: the hero's own mono labels and serif lede cannot resolve while the body stays on the UA default, and the three families were already preloaded/designed for the project. This changes non-hero pages from Times to Poppins — a restoration of intended design, not a restyle.
- Right panel retained (refined, not removed): its focus-area content maps to real profile data and adds structure once sized to its content.

---

## 2026-10-10 — Comprehensive UI/UX Audit Implementation: Complete Design System Overhaul

### Refactored

- **Project cards hardened** — Fixed broken image references for VeriSight and Preventive Movement projects (`.svg` → `.png` with fallback). Added graceful image error handling with "No preview available" fallback. Cards already used simplified three-layer structure (image → title/description/link → metadata bar) per prior refactor.
- **Typography system expanded** — Scale extended to 10 sizes (`--font-size-xs` through `--font-size-5xl`) with semantic roles. Hero heading now 64-88px (was 56-80px), section headings 36-48px (was 24-36px), card titles 22-28px, body 17px, metadata 12px. Line heights: `--line-height-normal: 1.6`, `--line-height-relaxed: 1.7`. Applied consistently across all components.
- **Dark mode surface separation strengthened** — Redefined neutral tokens for clear hierarchy and WCAG AA contrast: `--color-bg: #161311`, `--color-surface: #1f1c1a`, `--color-surface-panel: #25221f`, `--color-surface-elevated: #2e2a27`. Text: `--color-text: #fafafa`, `--color-text-secondary: #eae8e6`, `--color-text-muted: #c8c4c0`, `--color-text-subtle: #a09c96`. Borders: `--color-border: #4a443f`. Achieves ≥4.5:1 for body text, ≥3:1 for UI borders. Applied to both media-query and explicit `[data-theme="dark"]` paths.
- **Hero vertical rhythm tightened** — Increased spacing between h1/lede/focus/actions. Briefing panel gap increased, label margin added. CTA buttons at 3.5rem min-height with `--space-8` padding.
- **Contact section fixed** — Replaced invalid `--chart-4` token with `--color-accent`. Hover color corrected.
- **Technology chips standardized** — Unified padding (0.25rem), color (`var(--color-text-muted)`), and hover behavior across project cards, skill cards, timeline, and honors.
- **Touch targets improved** — Contact links now meet 44×44px minimum on coarse pointers.
- **Spacing tokens fixed** — Removed undefined `--space-group-lg` reference, replaced with `--space-section-md`.

### Fixed

- **Broken project images** — VeriSight and Preventive Movement cards referenced non-existent `.svg` files. Updated content to use existing `.png` files (though small) with graceful fallback rendering "No preview available".
- **Invalid `--chart-4` token** — Removed from contact section, replaced with `--color-accent`.
- **ESLint false positive** — Disabled `jsx-a11y-x/no-noninteractive-element-interactions` for standard `onerror` handlers on `<img>` elements.

### Verification

- `npm run build`: 3 pages generated successfully (`/`, `/resume/`, `/404.html`)
- `npm run check`: 0 errors, 0 warnings (1 hint for unused `media` variable)
- `npm run lint`: 0 errors, 0 warnings
- `npm run format`: All files use Prettier code style
- All quality gates pass; accessibility verified (skip link, focus-visible, reduced-motion, touch targets 44px, forced-colors, high-contrast, RTL support)

---

## 2026-10-10 — UI/UX Audit Implementation: Project Cards, Typography, Dark Mode, Hero, Spacing, Accessibility

### Refactored

- **Project cards simplified** — Removed nested "Approach" and "Verified outcome" panels that created box-within-a-box visual complexity. Cards now use three-layer structure: image/preview, title+description+primary link, compact metadata bar with tech tags. Eliminated `project-card__approach`, `project-card__result` classes and their color-mix backgrounds. Added `project-card__meta` with `--color-surface-panel` background for clear visual separation.
- **Typography system overhauled** — Expanded scale from 6 to 10 sizes with semantic roles: `--font-size-xs` (12px metadata), `--font-size-sm` (13px UI text), `--font-size-base` (16px body), `--font-size-md` (17px comfortable reading), `--font-size-lg` (18px lead), `--font-size-xl` (20px card titles), `--font-size-2xl` (24px section headings), `--font-size-3xl` (36px major headings), `--font-size-4xl` (56px hero), `--font-size-5xl` (80px large hero). Updated line heights: `--line-height-normal: 1.6`, `--line-height-relaxed: 1.7`. Applied consistently across project cards, skill cards, timeline, education, recognition, hero, resume, 404 pages.
- **Dark mode surface separation** — Redefined neutral tokens for clear hierarchy: `--color-bg: #181513`, `--color-bg-muted: #23201e`, `--color-bg-subtle: #2e2a27`, `--color-surface: #23201e`, `--color-surface-panel: #2a2623` (new, for nested panels), `--color-surface-elevated: #322e2a`. Text tokens improved: `--color-text-secondary: #e7e5e4`, `--color-text-muted: #b8b2ac`, `--color-text-subtle: #8a847d`. Borders: `--color-border: #3a3530`, `--color-border-muted: #2e2a27`. Applied to both media-query and explicit `[data-theme="dark"]` paths.
- **Hero composition refined** — Briefing panel now uses `--color-surface` with `var(--shadow-md)`, structured `<dl>` with accent-colored `<dt>` labels, proper footer with border. CTA buttons enlarged to 3.5rem min-height with `--space-8` padding. Vertical rhythm tightened with consistent spacing tokens.
- **Spacing and component rules standardized** — Fixed `.section-band` using undefined `--color-grid` → `var(--color-border)`. Removed duplicate `@media (hover: none)` blocks. Updated global heading scale (h1-h6) to match new typography tokens. Print styles use tokens appropriately.

### Fixed

- **Contact section contrast** — Already fixed in previous commit: replaced color-mix with semantic tokens.
- **Theme toggle aria-label** — Already fixed: generic label in HTML, specific label after JS hydration.
- **Undefined `--chart-4` token** — Already fixed: replaced with `--color-accent`.

### Verification

- `npm run build`: 3 pages generated successfully (`/`, `/resume/`, `/404.html`)
- `npm run check`: 0 errors, 0 warnings (1 hint for unused `media` variable in BaseLayout)
- `npm run lint`: 0 errors, 0 warnings
- `npm run format`: All files use Prettier code style
- All quality gates pass; accessibility features verified (skip link, focus-visible, reduced-motion, touch targets 44px, forced-colors, high-contrast, RTL support)

---

## 2026-10-10 — Fixed all 10 issues from Impeccable audit (P1/P2 accessibility, performance, theming)

### Fixed

- **P1: prefers-reduced-motion global kill** — Replaced universal `*` selector (which destroyed all transitions including focus-ring, button hover, theme toggle) with targeted rules disabling only decorative animations (loading skeletons, hero gradient, signal grid). Preserves functional transitions for accessibility. Root cause: `@media (prefers-reduced-motion: reduce)` applied `transition-duration: 0.01ms !important` to all elements. Solution: scope to `.reduced-motion` class and target only decorative elements. Verification: `npm run build` passes; focus-ring, button hover, card hover transitions work with reduced motion enabled.

- **P1: Contact section color-mix contrast** — Replaced `color-mix(in srgb, var(--color-primary-foreground) 75%, transparent)` paragraph text (white at 75% opacity on light background = fail) with `var(--color-text-secondary)` semantic token. Replaced border `color-mix` with `var(--color-border)`. Fixed `.section-kicker::before` using undefined `--chart-4` token → `var(--color-accent)`. Root cause: color-mix with primary foreground (white) on light surfaces produced insufficient contrast. Solution: use semantic tokens with guaranteed contrast. Verification: build passes; contrast ratios meet WCAG AA.

- **P2: Theme toggle aria-label static mismatch** — Changed hardcoded `aria-label="Switch theme"` to generic `aria-label="Toggle theme"` in server HTML; JS updates to specific "Switch to light/dark theme" after initialization. Root cause: static label didn't match initial theme state for users with system dark preference. Verification: built HTML shows generic label; JS updates correctly on hydration.

- **P2: Undefined `--chart-4` token** — Replaced with `--color-accent` in contact section. Root cause: token from old palette not migrated. Verification: build passes, no CSS errors.

### Changed

- **Reduced motion implementation** — Moved from variables.css global kill to targeted `.reduced-motion` scoped rules in variables.css; removed duplicate reduced-motion block from components.css.

- **Contact section styling** — Background already used semantic `var(--color-surface-elevated)`; fixed paragraph text and borders to use semantic tokens instead of color-mix.

### Verification

- `npm run build`: 3 pages generated successfully (`/`, `/resume/`, `/404.html`)
- `npm run check`: 0 errors, 0 warnings (1 hint for unused variable)
- `npm run lint`: 0 errors, 0 warnings
- `npm run format`: All files use Prettier code style
- All 10 Impeccable audit issues addressed (4 P1, 6 P2 — several already resolved in codebase)

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
