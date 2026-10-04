# Portfolio

Lightweight static portfolio built with Astro 7. No client JavaScript (0 bytes), no images, system fonts, no third-party requests. Content lives in typed collections (`src/content/`), shared profile data in `src/data/profile.ts`.

## Commands

```sh
npm install        # install dependencies
npm run dev        # local dev server
npm run build      # production build -> dist/
npm run preview    # serve the built dist/ locally
npm run check      # Astro type checking (astro check)
npm run lint       # ESLint (TypeScript, Astro, JSX-a11y)
npm run lint:fix   # auto-fix ESLint issues
npm run format     # Prettier format check
npm run format:fix # auto-fix formatting
npm run ci         # run all quality gates (check + lint + format)
```

## Structure

```text
src/
  content/          # content collections (projects, experience, skills, etc.)
  content.config.ts # collection schemas (Zod, build-time validation)
  data/profile.ts   # shared profile data (name, links, contact)
  layouts/          # BaseLayout (head metadata), MainLayout (header/footer)
  pages/            # index, resume, 404
  components/       # UI components
  styles/           # variables.css (theme), global.css, components.css
public/             # robots.txt, favicon, resume.pdf
Docs/               # PRD, tech_phases, CHANGES (mandatory dev log), design-plan
```

## Deployment

The build output is a plain static site in `dist/` — any static host works.

**Before deploying:** replace the placeholder origin `https://portfolio.example.com` in `astro.config.mjs` (site — drives canonical URLs, Open Graph, sitemap) and in `public/robots.txt` (Sitemap URL) with the real domain.

### Netlify

`netlify.toml` is included (build command, publish dir, security + caching headers).

- **Git:** connect the repo — Netlify reads `netlify.toml` automatically.
- **Drag & drop:** run `npm run build`, then drop the `dist/` folder at app.netlify.com/drop (headers need the `netlify.toml` path — use Git for full config).

### Vercel / Cloudflare Pages / GitHub Pages / any static host

- Framework: Astro (auto-detected), build `npm run build`, output directory `dist`.
- GitHub Pages: publish the contents of `dist/` from CI or `gh-pages` branch.

## Documentation

- Requirements: `Docs/PRD.md`
- Phases: `Docs/tech_phases.md`
- Development log (mandatory): `Docs/CHANGES.md`

## Quality Gates

This project enforces code quality via automated checks:

| Tool              | Purpose                                   | Config                     |
| ----------------- | ----------------------------------------- | -------------------------- |
| `astro check`     | TypeScript diagnostics for `.astro` files | `astro.config.mjs`         |
| ESLint 10         | Linting (TS, Astro, accessibility)        | `eslint.config.js`         |
| Prettier 3        | Code formatting                           | `prettier.config.json`     |
| GitHub Actions CI | Runs all gates on push/PR                 | `.github/workflows/ci.yml` |

Run locally before committing:

```sh
npm run ci  # runs check + lint + format
```

Auto-fix common issues:

```sh
npm run lint:fix   # fix ESLint issues
npm run format:fix # fix formatting
```

### CI Pipeline

The `.github/workflows/ci.yml` runs on every push and PR to `main`:

1. Install dependencies (`npm ci --legacy-peer-deps`)
2. Type check (`npm run check`)
3. Lint (`npm run lint`)
4. Format check (`npm run format`)
5. Build (`npm run build`)

PRs also upload build artifacts for preview.

### Security Hardening

- CSP without `'unsafe-inline'` (styles extracted to external CSS)
- No wildcard CORS headers
- Security headers on all responses (including `/resume.pdf`)
- `inlineStylesheets: 'never'` in `astro.config.mjs`
- Astro telemetry disabled
- Dev server host validation enabled
