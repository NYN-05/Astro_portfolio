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


