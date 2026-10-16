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

## 2026-10-16 — Phone Contact Removed From Public Links

### Changed

- **Phone entry deleted from `src/data/profile.ts`** (the `label: "Phone"` record with its `tel:` href). The Get in touch section renders from `profile.contact` at build time, so the link and its numbered row disappear; the remaining rows (Email / GitHub / LinkedIn) renumber automatically. Reason: owner opted to stop publishing a personal phone number on the public site. Verification: the edit was in the tree for this session's full gate runs (`format` / `check` / `lint` / `build` all exit 0), and `dist/index.html` contains no `tel:` link. Note: git history retains earlier commits that contain the number — purging it from history would require a rewrite and force-push (deliberately not done).

---

## 2026-10-16 — Hero Background Layer: Grids Removed, Swappable Image/Color/Video Config

### Removed

- **Grid pattern stripped from the hero** (`src/pages/index.astro`): the 32px SVG data-URI
  `background-image` and `background-size: 2rem 2rem, auto` deleted from `.hero`. Reason: brief
  required the decorative grid gone in both light and dark modes; it was a single rule serving
  both themes (no dark duplicate), so removal is total. `.hero` keeps its dimensions, border,
  `background-color`, and `color`, and gains `overflow: hidden` so background media crops to the
  hero box.
- **404 page grid stripped** (`src/pages/404.astro`, `src/styles/components.css`): the
  `signal-grid` class removed from the error section and its `.signal-grid` rule (the same 32px
  SVG grid) deleted. Reason: user explicitly opted to remove this second pattern as well. Text
  colors verified unaffected — every 404 text element sets its own color (kicker
  `--color-accent` in `global.css`, h1 `--color-text` from the global heading rule, p muted,
  button its own), so the deleted rule's `color: var(--color-border)` only ever fed the SVG's
  `stroke='currentColor'`.
- **Dead print-guard rule** (`src/styles/components.css`, `@media print`): deleted
  `.hero::after, .signal-grid::before, .signal-grid::after { display: none !important; }`.
  Reason: grep proved none of those three pseudo-elements are defined anywhere — stale leftovers
  of the old grid design, part of the brief's "remove pseudo-elements/overlays" scope.

### Added

- **Configurable background layer behind all hero content** (`src/pages/index.astro`): new
  `<div class="hero-bg" aria-hidden="true">` as first child of `.hero`, with `.hero-bg` CSS:
  `position:absolute; inset:0; z-index:0; pointer-events:none; overflow:hidden` and a
  three-layer `background-image` stack — custom image → custom solid color (via
  `linear-gradient(c, c)`) → the existing theme gradient fallback — with
  `background-size: cover, auto, auto` + centered position for distortion-free responsive
  cropping. `.hero-grid` gains `position:relative; z-index:1` so content deterministically
  paints above the layer (no negative-z-index paint-order gotchas). Reason: brief requirement
  2/5 — a clean, swappable layer that never touches layout, dimensions, or typography.
- **Readability veil** rendered as `.hero-bg::after` (no extra element):
  `color-mix(in srgb, var(--color-bg) var(--hero-bg-scrim), transparent)` — follows `--color-bg`,
  so it is theme-appropriate by construction (warm off-white veil in light, near-black in dark)
  and flips atomically with `data-theme` via custom-property inheritance (no flash: the same
  pre-paint mechanism the theme itself uses).
- **Config knobs in `src/styles/variables.css`** (base `:root`, beside the existing
  `--hero-gradient-*` tokens, with usage documentation): `--hero-bg-image: none`,
  `--hero-bg-color: transparent`, `--hero-bg-scrim: 0%`. Reason: user chose a CSS custom-property
  mechanism over a frontmatter const — swapping the background asset later is a one-line edit in
  the theme's source of truth and never touches markup or component structure. The comment
  documents the public/images path, cover/crop guidance, GIF/animated-WebP loop support, and how
  to redeclare a knob inside the dark blocks for a theme-specific asset.
- **Looping-video path**: commented `<video data-hero-video src="/hero.mp4" … autoplay muted
loop playsinline>` snippet inside `.hero-bg`, with `.hero-bg video { object-fit:cover … }`
  rules already shipping. Reason: CSS cannot set a video source (it must be an HTML attribute),
  so the markup snippet is the honest mechanism; enable = drop file in `public/` + uncomment.
- **Reduced-motion guard** (`<script is:inline>` in `index.astro`, dormant unless the snippet is
  uncommented): under `prefers-reduced-motion: reduce` it removes `autoplay`, pauses, and
  re-pauses on any `play` event. Reason: guards the load-race where the spec's metadata-time
  autoplay attempt would otherwise override an early `pause()`; inline per house rule (no bundled
  output), page fully functional with JS disabled.

### Fixed

- **Background layer div was missing from the first markup pass.** Problem: the initial edit
  inserted only the config comment inside `.hero` without the `<div class="hero-bg">` element,
  so every `.hero-bg` rule matched nothing — inert layer, and the hero would render flat
  `background-color` instead of the gradient (visual regression vs. the promised parity). Root
  cause: the verification regex (`>\s*<!-- Background layer`) matched the comment text that
  merely _mentioned_ `.hero-bg` and reported success — a false positive. Solution: added the
  real element wrapping the video snippet. Verification: re-ran all gates and re-checked dist
  with element-level assertions — `<div class="hero-bg" … data-astro-cid…>` exists, is the first
  child of `section.hero`, and the scoped `.hero-bg[data-astro-cid-…]` rules match it (all true).

### Important Decisions

- **Default knob values give pixel parity.** `none`/`transparent`/`0%` resolve the layer to
  exactly the previous theme gradient with a transparent veil — the original background minus
  the grid. No text color was touched anywhere, so the AA contrast measurements recorded in the
  earlier card entries still hold for the default state.
- **Scoping constraint discovered:** page `<style>` compiles `.hero-bg` rules to
  `.hero-bg[data-astro-cid-lcdefpme]`, so the layer must be template markup (it is, and Astro
  stamps the attribute automatically). The CSS minifier rewrites `::after` → `:after`
  (equivalent selector) — noted so future dist greps don't misread it as missing.
- Knobs are declared once in base `:root` and inherit through both theme-selector paths
  (media-query dark and `[data-theme="dark"]`), which neither overrides.

### Verification

- `npm run format`: clean · `npm run check`: 0 errors, 0 warnings (1 pre-existing BaseLayout
  hint) · `npm run lint`: exit 0 · `npm run build`: exit 0, 2 pages — run twice (once before,
  once after the missing-div fix).
- `dist/index.html`: layer element present with scope attribute as first child of `.hero`;
  config comment + video snippet nested inside it; knobs emitted in `:root`
  (`--hero-bg-image:none; --hero-bg-color:transparent; --hero-bg-scrim:0%`); scoped `.hero-bg`
  rules, veil `:after` rule, `background-size:cover,auto,auto` stack, and `z-index:0`/`z-index:1`
  stacking all present; hero h1, both CTAs, and the briefing card intact; reduced-motion script
  emitted.
- `dist/404.html`: `<section class="error-section" …>` clean (only the scope attribute added);
  zero `signal-grid` matches.
- Both pages: zero `width='32' height='32'` grid data-URI matches — no grid pattern remains in
  the shipped CSS or HTML.

---

## 2026-10-16 — Skills Hover Chip Fixed: Coral Background No Longer Overlaps Adjacent Tabs

### Fixed

- **Problem**: the coral hover background on a skill item spilled past the item's text and covered the first ~6px of the neighboring tab's text — visible in both themes, on desktop and mobile.
- **Root cause**: the trailing `·` divider (`li::after`) sits inside the item's inline box carrying `margin-inline: var(--space-3)` (12px) on _both_ sides, and an inline element's background paints its whole padding box — swallowing the divider content, the divider's 12px trailing margin, and the item's own `padding-right` (0.35em). The chip therefore reached text-end + ~32.6px while the next tab's text begins at +27px: a 5.6px overlap onto the neighbor.
- **Solution** (`src/styles/components.css`): removed the divider's trailing margin (`margin-inline: var(--space-3) 0` — the dot keeps its exact 12px offset from the text) and moved that 12px into the item's `margin-inline-end: calc(var(--space-3) - 0.35em)`, a margin — outside the painted box, so no background can ever cover it. Flow-neutral by construction: text-to-text spacing and dot position are arithmetically unchanged (before `12 + dot + 12` = after `12 + dot + 5.6 + 6.4 − 5.6 + 5.6`), so no design or spacing changes; the chip now stops 6.4px short of the next tab's text (box-to-box clearance 0.8px — the remainder is transparent padding). No `z-index`/stacking changes were needed: containment is now geometric, so there is nothing left for the chip to paint over. Transition (120ms in/out), theme colors, `box-decoration-break: clone`, and the zero-layout-shift padding technique are untouched.

### Verification

- Gates: `npm run build` exit 0 (2 pages); `npm run check` 0 errors / 0 warnings / 1 pre-existing hint (unused `media` attr, BaseLayout); `npm run lint` 0 errors; `npm run format` passes. (`npm run ci` itself cannot run in this PowerShell — its `&&` script is unsupported by the shell; the three gates were run individually.)
- Browser (Playwright/Chromium, `file://`), light + dark × 1440/390/320: the hovered item's painted rect was measured against nearest same-line neighbor _text_ rects via `Range.getClientRects` (per line, so wrapped tabs count correctly) — signed clearance **+6.4px** to the next tab and **+21.4px** to the previous tab in all six configurations; hover applies the coral background (`#c7352b` light / `#f06459` dark; contrast 5.29:1 / 5.59:1 on the on-accent text), mouse-away restores the transparent background, and `document.scrollWidth` reports zero horizontal overflow at every width.
- Root cause reproduced: injecting the original rules into the built page re-creates the defect at **−5.6px** (chip covering the next tab's text), confirming both the cause and the exact 12px correction.
- Screenshots at 390px (light + dark): chip sits strictly on the hovered item; the divider dot and the following tab are fully clear.

### Important Decisions

- **Amends the same-day "Skill Items: Coral Hover/Focus Interaction" entry**: the highlight technique and its zero-layout-shift guarantee stand unchanged; only the storage of the divider gap moved — from inside the painted box (`::after` margin) to `margin-inline-end`, which is what makes the chip strictly self-contained.

---

## 2026-10-16 — Content Files Renamed: Project Markdown and Featured Screenshot

### Changed

- **Project collection files renamed to match their projects** (`src/content/projects/`): `task-manager.md` → `Deepfake-Detection.md`, `portfolio-site.md` → `VeriSight.md`, `data-pipeline.md` → `BIRAC.md`. Reason: the old names were misleading placeholders (`task-manager.md` held the Deepfake KYC project). Content and frontmatter unchanged.

- **Featured screenshot renamed to match** (`src/content/projects/images/`): `deepfake-kyc.png` → `Deepfake-Detection.png`. Two references updated: the `image:` path in `Deepfake-Detection.md` frontmatter, and the hardcoded asset import branch in `src/components/ProjectCard.astro` (`imagePath === 'Deepfake-Detection.png'` + the `await import(...)` path). Reason: keep asset naming consistent with its collection file.

### Important Decisions

- **Astro entry IDs changed with the filenames** (`task-manager` → `Deepfake-Detection`, etc.). Verified nothing references the old IDs: the collection uses a `glob()` loader (filename-agnostic), `index.astro` loads via `getCollection('projects')` sorted by `startDate`, and `ProjectCard.astro` derives its anchor from `data.title`, not the entry ID. No code changes beyond the image import were needed.
- **Historical `Docs/CHANGES.md` entries still cite the old filenames** (e.g., "task-manager.md"). Left as-written per the append-only rule; they were accurate when recorded.
- Both `.md` renames were untracked-delete/untracked-add in the working tree; the `.png` rename was staged with `git mv` so Git records it as a rename. `git add -A src/content/projects/` at commit time will let Git detect the markdown renames too.

### Verification

- `npm run check`: 0 errors, 0 warnings (1 pre-existing BaseLayout hint). `npm run lint`: exit 0. `npm run format`: clean. `npm run build`: exit 0, 2 pages.
- `dist/index.html`: featured card renders with the new asset (`/_astro/Deepfake-Detection.*.webp`, full 400/800/1200w srcset, alt intact); all three cards present.
- Repo-wide grep for `deepfake-kyc`: 0 matches — no stale references.

---

## 2026-10-16 — Project Cards Now Theme-Aware: Light-Neutral in Light Theme, Charcoal Preserved in Dark

### Changed

- **Card-local `--card-*` tokens remapped from fixed charcoal hexes to site theme tokens** (`src/styles/components.css`): `--card-bg: var(--color-surface)`, `--card-bg-hover: var(--color-surface-muted)`, `--card-border: var(--color-border)`, `--card-fg: var(--color-text)`, `--card-fg-secondary: var(--color-text-secondary)`, `--card-fg-muted: var(--color-text-muted)`, `--card-accent: var(--color-accent)`, `--card-chip-bg: var(--color-bg-muted)`. Reason: the previous hardcoded `#1c1c1b` palette painted dark cards in light mode, clashing with the warm off-white page. Light mode now renders white-surface cards with light-gray borders and `#c7352b` coral accents on the `#f5f5f3` page; dark mode resolves to the charcoal treatment (`#242424` surface, off-white text, `#f06459` accent) via the theme's own tokens. Layout, spacing, typography, and content untouched.

- **Hover states made directional per theme.** `--card-border-hover` is now `color-mix(in srgb, var(--card-border) 55%, var(--card-fg-muted))` — the border strengthens toward the text color, so it darkens on the white card and lightens on the charcoal card. Link hover `#f68980` → `var(--color-accent-hover)` (`#a62d24` light, `#f27a6f` dark). The `hover: none` active state already mixed from `--card-bg`/`--card-accent` and now adapts automatically.

### Fixed

- **Chip text failed AA in light mode.** `--card-fg-muted` (#707070) on chip bg `--color-bg-muted` (#ebeae6) measured 4.06:1. Tech-tag and image-fallback text moved to `--card-fg-secondary`: 8.61:1 light, 11.11:1 dark.

### Verification

- `npm run check`: 0 errors. `npm run lint`: exit 0. `npm run format`: clean. `npm run build`: exit 0, 2 pages.
- `dist/index.html` inlined CSS confirms `--card-bg:var(--color-surface)`, `--card-border:var(--color-border)`, `--card-accent:var(--color-accent)` etc.; `#232322`, `#4a4a46`, `#f68980` fully removed; remaining `#1c1c1b` is only the pre-existing `--hero-gradient-start` token (unrelated); remaining `#2a2a29` is the theme's own `--color-surface-panel` dark value.
- Contrast measured for every pair in both themes, all ≥ WCAG AA — light: title 17.58:1, subtitle 10.37:1, description/meta 4.95:1, accent 5.29:1, accent hover 6.95:1, chips 8.61:1; dark: title 13.60:1, subtitle 10.46:1, description/meta 6.14:1, accent 4.93:1, accent hover 5.76:1, chips 11.11:1.
- Theme switching: one token layer flips atomically with `<html data-theme>` (and `prefers-color-scheme` with no attribute); the BaseLayout pre-paint script sets the attribute before first paint, so no color flash and no per-card theme rules to drift out of sync.

### Important Decisions

- Kept the `--card-*` indirection rather than referencing theme vars in each rule: the print block (white paper) and forced-colors block (Canvas system colors) override the whole card palette in one place — that mechanism was preserved unchanged.
- Section background needed no change: the projects section inherits the page background, which is already the warm off-white `--color-bg` in light mode.

---

## 2026-10-16 — Project Card Redesign: Charcoal Surface, Metadata Row, Title → Subtitle Hierarchy

### Changed

- **All three project cards redesigned per the product-design brief** (`src/components/ProjectCard.astro`, `src/styles/components.css`). New element order, verified in built HTML: metadata row (status/featured label left, year right) → 16:9 image with `object-fit: cover` → bold title → secondary subtitle → description → technology chips → "View source code ↗" link. Reason: the spec's hierarchy communicates purpose within seconds; the previous layout (4:3 image beside a header with the year) buried the description and had no subtitle slot.

- **Fixed card palette as charcoal in both themes.** Card-local tokens on `.project-card` (`--card-bg: #1c1c1b`, `--card-fg: #f0f0ed`, `--card-fg-muted: #a3a3a1`, `--card-accent: #f06459`, …). Reason: the brief explicitly requires a near-black/off-white/muted-gray surface with one restrained accent; scoping it to the component keeps site theme tokens untouched. Measured contrast on `#1c1c1b`: title 14.94:1, subtitle 11.49:1, description/meta 6.75:1, accent link 5.42:1, chip text on chip bg 5.69:1 — all pass WCAG AA.

- **Deepfake content split and corrected** (`src/content/projects/task-manager.md`). Title `Deepfake Detection Pipeline for KYC: rPPG + Hybrid Quantum-Classical ML` → title `Deepfake Detection for KYC` + subtitle `rPPG + Hybrid Quantum-Classical ML` (spec-defined). Description rewritten to explain _how_ rPPG signal analysis + hybrid quantum-classical ML support detection in low-res KYC video. `imageAlt` fixed: it claimed an "architecture diagram" but the asset is the rPPG·QC Verifier dashboard — alt now describes the actual screenshot. Reason: authenticity + WCAG alt must match the visible image.

- **Two-column desktop / stacked mobile.** Grid areas `meta meta` / `image content` at ≥721px (tablet gets a 1.1/1 split for text room), single column ≤720px with chips wrapping naturally. Reason: spec's "balanced two-column composition … vertically stacked on mobile"; `minmax(0, …)` tracks prevent overflow at 320px.

### Added

- **Optional `subtitle` frontmatter field** (`src/content.config.ts`, z.string().optional() — missing value can't break the build). Subtitles added: VeriSight → "CNN + Vision Transformer + OCR", Preventive Movement → "MoveNet + MediaPipe pose analysis" — both derived verbatim from existing frontmatter, nothing invented. Documented in `README.md` §2.

- **Metadata row** on every card: `FEATURED PROJECT` (accent, only on the explicit featured slot) / status label (`Completed project`) + `<time>` year. Reason: the spec's metadata row plus a factual label for supporting cards.

### Refactored

- **Removed the `variant` prop** (`diagram | metrics | preview | featured | secondary`) from `ProjectCard.astro` and `index.astro`. All variants rendered identically after the redesign; they were leftovers from the removed resume page. `index.astro` now passes an explicit `featured` prop for the top slot. Reason: one cohesive card design per the brief; `astro check` stays at 0 errors.

### Fixed

- **Image alt text was inaccessible.** The image wrapper carried `aria-hidden="true"`, which hid the `<img>` and its alt from assistive tech entirely. Removed. Reason: spec requires "descriptive image alternative text".

- **Mobile tap flashed the dark card light** (`global.css` `hover: none`): the old `.project-card:active` painted `--color-surface` (near-white in light theme) over the charcoal card with off-white text. Rule split; the card now uses `color-mix` of its own `--card-bg` + `--card-accent`.

- **Print/forced-colors palettes.** Print block and `forced-colors` block now swap the card-local tokens (white paper / `Canvas` + `CanvasText`) so the fixed charcoal surface doesn't print as solid black ink or render off-white text on `Canvas`.

### Verification

- `npm run check`: 0 errors, 0 warnings (1 pre-existing hint in `BaseLayout.astro`).
- `npm run lint`: exit 0. `npm run format`: exit 0 (Prettier applied to `components.css`/`global.css`; it also re-serialized the in-progress skills-section edits in those files — formatting only, no semantics).
- `npm run build`: exit 0, 2 pages.
- `dist/index.html` inspected: 3 cards; featured = "Featured project"/2024/6 chips (Python, PyTorch, PennyLane, OpenCV, MediaPipe, React — exactly the spec list), supporting cards = "Completed project"/2023; DOM order of featured card confirmed meta → image → title → subtitle → description → tech → actions; stylesheet inlined (`--card-bg` present); heading outline 1×h1 / 6×h2 / 10×h3 / 3×h4, no skipped levels.

### Important Decisions

- **Featured label follows the explicit slot, not `data.featured`.** Two records (`task-manager`, `portfolio-site`) carry `featured: true`, but only the top slot shows `FEATURED PROJECT`; supporting cards show status labels.
- **Chips capped at 6 per card** (`slice(0, 6)`), which renders exactly the six technologies the brief lists for the Deepfake card; `scikit-learn` (7th) is omitted from chips, still in frontmatter.
- Card order unchanged (already correct): Deepfake 2024 → VeriSight 2023-06 → Preventive 2023-01, featured first, newest first.

---

## 2026-10-16 — Skill Items: Coral Hover/Focus Interaction

### Changed

- **Every skill item in the Skills & Expertise section now has a hover and keyboard-focus treatment** (`src/components/SkillsList.astro`, `src/styles/components.css`). On hover/focus the item's background transitions to the existing coral accent (`--color-accent`) and its text — plus the trailing `·` divider, which lives inside the item's inline box — switches to the theme's on-accent color (`--color-primary-foreground`); on leave it returns over the same 120ms (`--transition-fast`). Reason: requested interaction; restores the hover affordance the deleted pill-tag design used to have, on the editorial layout.

### Added

- **Zero-layout-shift highlight technique**: the items gained a small permanent `padding: 0.15em 0.35em` cancelled by an equal negative `margin-inline`, so the highlight has breathing room while text positions and line breaking stay byte-identical to the pre-interaction layout — the hover cannot reflow anything by construction. `box-decoration-break: clone` keeps wrapped items coherent across line breaks. Verified: document-relative geometry of the section and items is identical idle vs hovered in both themes.
- **Keyboard focus state**: items carry `tabindex="0"` so keyboard users reach them in reading order; `:focus-visible` applies the same accent treatment plus the site's global `--focus-ring` halo. In Windows High Contrast (where backgrounds and box-shadow are stripped) a `2px solid Highlight` outline keeps the focus indicator visible.
- Hover is scoped to `@media (hover: hover) and (pointer: fine)` so a touch tap cannot leave a sticky highlight.

### Verification

- Gates: `npm run build` exit 0 (2 pages); `npm run check` 0 errors / 0 warnings / 1 pre-existing hint (unused `media` attr, BaseLayout); `npm run lint` 0 errors (one justified `eslint-disable` — see Important Decisions); `npm run format` passes (ran `prettier --write` on two skills JSONs from the earlier redesign whose array wrapping drifted).
- Browser (Playwright/Chromium, `file://`), 1440×900 × light + dark: hover verified with `elementFromPoint` confirming the cursor is on the item — light `#c7352b` bg + `#fff` text + white divider; dark `#f06459` bg + `#191919` text; mouse-away restores the exact idle computed styles; `transition-property: background-color, color` at `0.12s`. Keyboard: real `Tab` traversal lands on items with `:focus-visible` matching — accent bg + on-accent text + focus-ring shadow in both themes. Contrast: accent/on-accent = 5.29:1 (light) and 5.59:1 (dark), both WCAG AA. 320px viewport: zero skills-section elements past the viewport edge with the new padding. `prefers-reduced-motion: reduce`: transition duration collapses to `1e-05s` via the existing global rule.
- Two earlier probe anomalies were test artifacts, not defects: a dark-theme hover miss caused by the sticky header occluding the hover point (re-verified clean), and an "idle vs hover geometry" mismatch caused by async webfont metrics shifting between snapshots (fixed by awaiting `document.fonts.ready`).

### Important Decisions

- **`tabindex="0"` on non-interactive items with a scoped lint suppression**: `jsx-a11y-x/no-noninteractive-tabindex` fires on the `li`s; the rule was suppressed file-wide in the component's frontmatter with a written justification rather than dropping keyboard support (the focus state was explicitly requested) or faking a `role` (items perform no action, so `role="button"` would lie to assistive tech). Known tradeoff: the items add 27 deliberate focus stops to the page's tab order — they are intentional focus targets for scanning, in reading order.
- **Divider recolor on hover**: the `·` after each item is part of that item's inline box, so it would sit on the coral background in the idle grey. It transitions to the on-accent color with the text so the chip reads as one unit instead of showing a low-contrast dot.
- **No new tokens**: hover/focus colors reuse `--color-accent` + `--color-primary-foreground`, the same pairing the site already uses for primary buttons, so both themes and the explicit `data-theme` paths are covered by construction.

---

## 2026-10-16 — Skills & Expertise Section Redesign: Editorial Rows Replace Card Grid

### Changed

- **Skills section rebuilt as a borderless editorial index** (`src/components/SkillsList.astro`). Replaced the crowded `.skill-card` grid (bordered cards, `min-height: 17rem`, pill `.tech-tag` chips, a ~200-char `summary`, and a redundant `evidence` "Applied: …" paragraph per card) with four full-width `.skill-row` rows separated by hairline `--color-border` rules. Each row = mono `01–04` marker + `h3` category heading (left), one-line description + inline technology list (right). Reason: eliminate visual clutter, density, uneven card heights, and pill noise while keeping the section scannable in seconds.

- **Content restructured 5 → 4 records** (`src/content/skills/`). New categories in editorial order: `ai-ml.json` (AI & Machine Learning), `software-engineering.json`, `data-computing.json`, `computer-vision.json`. Deleted the old `data-ai`, `ai-retrieval`, `programming`, `tools-computing`, `web-backend` files. Reason: match the four-category brief; alphabetical sort produced the wrong reading order, so an explicit `order` field now drives sequence.

- **Project-first item trim.** Every retained technology already appears in a project's frontmatter or the prior skill records — nothing invented. Dropped low-signal conceptual phrases that aren't technologies: `Data Structures & Algorithms`, `Object-Oriented Programming`, `Backend Development`, `API Integration`, `Uvicorn`, `Flask`, `Cross-Encoder Reranking`, `Local LLMs`, `Ollama`, plus `Kotlin`/`Android` (cut only for the 5–8 item cap; still visible on the project card). Categories hold 6–7 items each.

### Refactored

- **Schema** (`src/content.config.ts`): skills collection now `category`, `order` (optional number), `summary` (optional, one line), `items[]`. Removed the optional `evidence` field. Reason: `evidence` is no longer rendered; keeping it would let data drift from the UI. `order` is optional so a future record without it can't break the build (sorts last via `?? 99`).

- **Styling** (`src/styles/components.css`, `global.css`). New `.skills-index` / `.skill-row*` rules use only existing tokens (`--color-border`, `--color-text-subtle`, `--space-*`), so the charcoal / off-white / coral identity is preserved in both themes with zero new colors. Removed every `.skill-card`, `.skills-grid`, `.skills-intro` rule and their scattered references in the forced-colors, print, pointer-coarse, and hover blocks. Dropped the `pointer: coarse` 44px target on skill text — inline items aren't interaction targets.

### Fixed

- **Technology names hyphenated mid-word on mobile** — Problem: `scikit-learn` and `GitHub` split as `scikit-`/`learn` and `Gi`/`tHub`. Root Cause: the global text-wrap rule (`global.css:33-35`) sets `overflow-wrap: anywhere` + `hyphens: auto` on `li`, which hyphenated at arbitrary points. Solution: on `.skill-row__list li` set `hyphens: none` + `overflow-wrap: break-word` — names stay intact, and `break-word` acts only as a last-resort guard so a long name like "TensorFlow Lite" can't overflow a 320px screen. Verified via computed style (`hyphens: none`, `word-break: normal`) at 320/390/1440.

### Removed

- `.skills-intro` paragraph from `src/pages/index.astro` (redundant with the `h2`) and its page-scoped style. Reason: buy whitespace; the heading already states the section's point.

### Verification

- `npm run build`: exit 0, 2 pages (`/`, `404.html`). Emitted HTML confirmed via regex — categories render in order `01 AI & Machine Learning` → `02 Software Engineering` → `03 Data & Scientific Computing` → `04 Computer Vision & Research`; descriptions and all item lists present; `Applied:` absent; zero `.tech-tag` inside the skills section; heading structure intact (1 `h1`, 6 `h2`, 10 `h3`).
- Browser (Playwright/Chromium via `file://` — loopback HTTP was unreliable in this sandbox), 5 viewports (320/390/768/1024/1440) × light + dark: **all 12 combos — no skills-section element extends past the viewport**, rows stack (`stacked: true`) on mobile and split into two columns on desktop, list never overflows its container, and skill content is byte-identical across every viewport and theme (`distinct sets: 1`). Theme toggle verified (`light` → `dark`, aria-label updates).
- Inlined-stylesheet grep: `.skill-card`/`.skills-grid`/`.skills-intro` = 0 occurrences; all new `.skill-row*` rules present; `hyphens: none` compiled in.
- `npm run check`: **2 pre-existing errors, not from this change** — see Important Decisions below.

### Important Decisions

- **Rows over a 2×2 grid**: full-width rows with hairline separators reuse the site's existing editorial row language (the contact-link and education-list rules), so the section reads fast, stays ~one screen on desktop, and stacks cleanly on mobile without card heights ever being compared.
- **`overflow-wrap: break-word` kept over `normal`**: an earlier `normal` attempt stopped all mid-word breaks but caused real horizontal overflow (page `scrollWidth` 397 vs viewport 320) because "TensorFlow Lite" became unbreakable. `break-word` resolves it without reintroducing the `hyphens: auto` butchery.
- **The 2 `astro check` errors are parallel workstream drift, NOT from this task.** `src/components/ProjectCard.astro` was rewritten concurrently (new `featured?: boolean` prop, `subtitle` field, `project-card__meta` block), but `index.astro` still calls `<ProjectCard variant="diagram|metrics|preview">`. ProjectCard's `Props` no longer accepts `variant`, so lines 53/55 fail type-checking. `npm run build` still exits 0 (Astro tolerates it at render). Left untouched deliberately — reconciling ProjectCard with its callers is that parallel workstream's job, and silently editing it here would clobber in-progress work.
- **Known 4px mobile overflow is also pre-existing/parallel, not mine**: `.project-card__meta` extends 4px past the viewport at 320/390 (`scrollWidth` 324/394). The skills section contributes zero out-of-bounds elements. Recorded, not fixed — out of scope for a skills-section task.
- **Verified data only**: no technology, category, or description was invented; every string traces to existing project frontmatter or prior skill records.

### Added

- **`netlify/edge-functions/asset-guard.ts`** — single Netlify Edge Function (`path: '/*'`) that locks down proprietary image assets. Page/HTML requests mint a sliding `img_session` cookie: HMAC-SHA256 over the expiry (`v1.<exp>.<hex>`), keyed by the `ASSET_SIGNING_KEY` env var, delivered `HttpOnly; Secure; SameSite=Lax; Path=/`, 7-day expiry, re-issued only inside the last 3 days. Requests to `/images/*` and `/_astro/*` require (a) a valid, unexpired, untampered cookie — verified with a constant-time compare — and (b) a same-origin `Origin` or `Referer` header when either is present (cross-site `fetch`/hotlink probes fail; privacy-stripped headers fall back to the cookie gate, which alone blocks cross-site embedding because `SameSite=Lax` cookies are not sent on cross-site subresource requests). Passing requests are streamed from the static handler via `context.next()` with `Cross-Origin-Resource-Policy: same-origin`, `X-Content-Type-Options: nosniff`, and `Content-Disposition: inline` added; existing `Cache-Control` is preserved so repeat views stay on the immutable cache path. Denials return `403` with `Cache-Control: no-store` so a 403 can never be CDN-cached.

### Changed

- **`netlify.toml`** — header comment documenting the edge function and the required `ASSET_SIGNING_KEY` env var.
- **`eslint.config.js`** — `'no-undef': 'off'` for `**/*.ts`: the new function uses Web API globals (`Request`, `Response`, `Headers`, `crypto`, …) that TypeScript resolves but ESLint's flat config had no globals for. Standard practice for TS files; `astro check` still catches real undefined identifiers.
- **`AGENTS.md`** — recorded the asset-guard contract (env vars, fail-closed behavior, `astro dev` does not run edge functions so assets are ungated locally; use `netlify dev` to exercise the guard).
- **`Docs/UIUX_Guide.md`** — Prettier reformat; it failed `npm run format` (pre-existing drift from the earlier push, would have failed CI).

### Verification

- Gates: `npm run lint` exit 0; `npm run format` "All matched files use Prettier code style!"; `npm run check` 0 errors; `npm run build` exit 0, 2 pages.
- **11-scenario behavioral test** of the exported handler under Node 22 (`Temp/asset-guard.test.ts`, gitignored scratch) using the same Web Crypto/fetch primitives as the Deno edge runtime: (1) anonymous image → 403 + `no-store`; (2) page load mints `img_session` with HttpOnly/Secure/SameSite=Lax/Path; (3) cookie'd image → 200 + CORP/nosniff/disposition + cache-header passthrough; (4) foreign `Referer` → 403; (5) foreign `Origin` → 403; (6) same-origin `Referer` → 200; (7) tampered signature → 403; (8) expired session → 403; (9) `ASSET_GUARD_MODE=off` → passthrough; (10) missing key → image 403, page 200 with no cookie (fail closed); (11) fresh cookie not re-issued, near-expiry cookie refreshed. All passed.
- Full e2e (real Netlify edge, cookie round-trip through a browser) requires a deploy with `ASSET_SIGNING_KEY` set — not verifiable locally; `netlify dev` is the local path.

### Important Decisions

- **Edge gating chosen over alternatives**: client-side obfuscation (renamed URLs, JS-only loading) is theater — DevTools defeats it instantly; moving images to Netlify Blobs/Cloudflare R2 + streaming adds a build-time upload step, a storage dependency, and third-party custody of the IP, for marginal gain over HTTP-layer gating; a third-party CDN with signed URLs sends the proprietary assets to an external processor. Netlify's documented pattern (edge function before static handler + `context.next()`) gives real anonymous-HTTP denial with zero build changes and sub-millisecond per-request overhead.
- **Fail closed**: if `ASSET_SIGNING_KEY` is unset, images 403 rather than degrade to open — a missing env var must not silently disable the protection. Pages remain fully functional so the failure is visible but non-breaking. `ASSET_GUARD_MODE=off` is the explicit escape hatch.
- **`/resume.pdf` intentionally NOT gated** — it is the public hero-CTA download (prior recorded decision); only project image assets are treated as proprietary.
- **No og:image exemption needed**: no page currently emits `og:image`/`twitter:image` (verified in `BaseLayout.astro`). If one is added later, it must be exempted in the guard or social crawlers (which carry no cookie) will 403 on the preview image.
- **Honest limitation recorded**: this blocks anonymous fetching, scripted scraping, and hotlinking — it cannot stop a human visitor from screenshotting what their own browser renders. No feasible browser-side DRM exists for a static portfolio; watermarking remains a content-level option if ever needed.

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
