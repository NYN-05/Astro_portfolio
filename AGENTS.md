# AGENTS.md

Personal portfolio site. Astro 7 static output, TypeScript strict, no framework, no bundler.
Node >= 22.12.

## Hard rule — `Docs/CHANGES.md` is mandatory

Not a nicety; it is a stated project requirement.

1. Read it first — it holds prior fixes, known issues, and decisions.
2. Do the work.
3. Verify (`npm run build` is the only automated gate — see below).
4. **Append an entry before reporting done**: `## YYYY-MM-DD — [short description]`, appended at
   the top of the log, grouped under Added / Changed / Fixed / Removed / Refactored /
   Configuration / Security / Verification / Important Decisions.

Append only, never rewrite history. Record the change *and* the reason. Bugs:
`Problem → Root Cause → Solution → Verification`. Never claim a verification you did not run.
Skip the entry only if the task produced no meaningful change.

Its embedded workflow references `Docs/tech_phases.md`, which does not exist. Real docs:
`Docs/PRD.md` (requirements), `Docs/design-plan.md` (visual direction), `Docs/CHANGES.md` (log).

## Commands

```sh
npm run dev       # astro dev
npm run build     # astro build -> dist/   (exit 0 is the only pass/fail gate)
npm run preview   # serve the built dist/
```

- **There is no lint, format, typecheck, or test command** — no ESLint, Prettier, `astro check`,
  or CI config exists in the repo. `CHANGES.md`'s "editor diagnostics" entries refer to the VS Code
  Astro extension, not a script. Don't invent `npm run check`.
- Verification without a server means reading `dist/` after a build: confirm rendered content is
  present in the emitted HTML.

## Current state — the build is broken

`src/pages/index.astro` is truncated mid-refactor. `<MainLayout>` is never closed, so the build
fails with `CompilerError: Unexpected token` at line 71. The About / Experience / Education /
Skills / Achievements / Contact sections and the page `<style>` are missing; the imports of
`ExperienceItem`, `EducationItem`, `SkillsList`, `AchievementsList` are unused. `dist/` is empty.

Establish whether that truncation is intended before treating it as a regression you caused.

Also unreferenced in the tree: `src/assets/background_hero.png` (1.5 MB) and root `dark.png` /
`light.png`. `CHANGES.md`'s claim of a ~50 KB WebP hero does not match the current files.

## Architecture

- Three routes only: `src/pages/index.astro`, `resume.astro`, `404.astro`. No project detail pages
  — a deliberate decision recorded in `CHANGES.md`.
- `layouts/BaseLayout.astro` = head metadata (title/description/OG/Twitter/canonical) + the
  pre-paint theme-restore script. `layouts/MainLayout.astro` = header, nav, theme toggle, footer.
  Every page renders through `MainLayout`.
- Identity, name, and contact links live in `src/data/profile.ts` and are **placeholders**
  (`Your Name`, `example.com`). Never invent a real name, location, URL, metric, or date —
  `PRD.md` §4.5 and `CHANGES.md` both require verified data only.
- Nav targets are homepage section ids (`/#about`, `/#projects`, `/#experience`, `/#contact`).
  Rename or remove a section and you must update `MainLayout.astro`, or you ship dead links.

## Content collections (Astro 7 content layer)

- Config lives at `src/content.config.ts` with explicit `loader: glob(...)`. The legacy
  `src/content/config.ts` location throws `LegacyContentConfigError` — never move it.
- Collections: `projects`, `experience`, `education`, `achievements` (markdown frontmatter) and
  `skills` (**JSON**, not markdown).
- Schemas are the build-time gate: malformed frontmatter fails the build with
  `InvalidContentEntryDataError`. Externally-derived fields are optional or defaulted on purpose,
  so missing real-world data can't break the build — keep new fields that way.
- Zod is imported from `astro/zod` and is **Zod 4**: use `z.url()`, not `z.string().url()`.
- Add content by dropping a file into the collection folder and rendering via `getCollection()`.
  Never hardcode records in a page.
- YAML frontmatter has broken this build twice: quote list items containing `:`, and never use `\'`
  inside single-quoted strings — use `"Dean's ..."`.
- Shared `formatDate` lives in `src/utils/format.ts` and must be imported in frontmatter. Defining
  it inside a `<script>` caused `ReferenceError: formatDate is not defined` at prerender time.

## Styling

- `styles/variables.css` holds the theme verbatim as the source of truth (`--background`,
  `--foreground`, `--primary`, `--ring`, `--radius`, `--chart-*`, …), then a second `:root` block of
  project aliases (`--color-*`, `--space-*`, `--font-size-*`, `--content-width*`).
  For a site-wide change, edit the theme token, not the alias.
- Dark mode has two paths that must stay in sync: `@media (prefers-color-scheme: dark)` on
  `:root:not([data-theme])` and `:root[data-theme='dark']`. There is no `data-theme='light'` block —
  an explicit light choice relies on `:root` winning via the `:not([data-theme])` guard.
- Every `--radius-*` alias resolves to the single `--radius` (0.375rem), so buttons, cards, and
  pills are intentionally not rounded. Not a bug.
- Shared classes (`.btn`, `.grid`, `.card`, `.meta`, `.timeline*`, `.skill-*`, `.project-card*`,
  `.education-*`) live in `components.css`. Pages and components keep only page-specific rules —
  one definition per class; re-implementing a shared class in a page `<style>` is a regression.
- `.grid` uses `minmax(min(var(--grid-min, 280px), 100%), 1fr)` deliberately: plain
  `minmax(300px, 1fr)` caused horizontal overflow at 320px.
- Negative custom properties are invalid CSS: use `calc(-1 * var(--x))`, never `-var(--x)`.

## Known visual defect

`.project-card.featured` sets its text to `var(--color-bg)` while the card background is only a 5%
tint of `--color-bg` (`components.css:207-218`). Featured-project text is effectively invisible in
both themes — a leftover from the palette swap. Fix the colors; don't compensate with an image.

## Conventions

- Vanilla Astro only. React/Vue/Svelte, UI or animation libraries, analytics, and backends require
  concrete justification (`PRD.md` §9). Default is no.
- Vanilla JS lives only in `<script is:inline>` (theme restore + toggle). Keep it there: no bundled
  output, and navigation must work with JS disabled.
- External links need `target="_blank" rel="noopener noreferrer"`; `isExternal()` in
  `data/profile.ts` is the existing helper.
- Accessibility is verified, not assumed: exactly one `h1` per page, no skipped heading levels, and
  `:focus-visible` / `prefers-reduced-motion` handling must survive every change.
- Before deploying, replace the placeholder origin `https://portfolio.example.com` in
  `astro.config.mjs` (`site`, drives canonical URLs/OG/sitemap) and in `public/robots.txt`
  (Sitemap URL). `netlify.toml` holds the CSP, security headers, and cache rules.

## Housekeeping

- `CLAUDE.md` is a symlink to this file. Edit `AGENTS.md`; never write `CLAUDE.md` directly.
- `dist/`, `.astro/`, `node_modules/`, and `.playwright-mcp/` are gitignored. No CI workflows.