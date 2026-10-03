# Professional Portfolio Redesign Plan

## 1. Current Assessment

The current portfolio is technically lightweight, but its visual presentation feels generic and inexpensive:

- The generic `Portfolio` brand does not establish a personal identity.
- The hero does not quickly explain who the person is, what they do, or what visitors should do next.
- The visual system relies heavily on plain text, borders, and rectangular blocks.
- The page has weak hierarchy and large areas of unexplained empty space.
- The contact section looks like basic form rows rather than a strong closing call to action.
- Project cards do not surface the strongest information already available in the content model, such as outcomes, contributions, and metrics.
- Placeholder content (`Your Name`, `email@example.com`, example companies, URLs, and projects) makes the site look unfinished.
- Automatic dark mode can produce an unintended black appearance without enough visual refinement.

The redesign should improve credibility and hierarchy without adding heavy animation, frontend frameworks, UI libraries, or unnecessary JavaScript.

## 2. Design Direction

### Recommended direction: editorial engineering portfolio

The site should communicate:

> Experienced engineer who designs and ships reliable systems.

Visual characteristics:

- Warm off-white or soft graphite backgrounds instead of pure black and white.
- Deep navy or charcoal text.
- One restrained accent color such as cobalt blue or muted orange.
- Strong typography hierarchy.
- Wide editorial layout with controlled whitespace.
- Thin rules and subtle surface contrast instead of heavy shadows.
- Small uppercase metadata labels.
- Distinctive project and experience layouts.
- Minimal motion for hover and focus polish only.

The result should feel confident, technical, calm, precise, mature, human, and intentional.

Avoid purple/indigo default styling, excessive gradients, over-rounded cards, stock card grids, oversized padding, and decorative effects that compete with content.

## 3. Header and Navigation

Replace the generic `Portfolio` label with a personal identity block:

```text
[Initials or monogram]
Your Name
Software Engineer
```

Desktop navigation:

```text
About   Work   Experience   Writing   Resume   Contact
```

Include a visible resume action in the header.

On mobile:

- Keep the name or monogram on the left.
- Use a compact menu control on the right.
- Use native HTML/CSS interaction where practical.
- Avoid framework hydration for navigation.

## 4. Hero Section

The first viewport must answer:

1. Who is this?
2. What does this person do?
3. What kind of work have they done?
4. What should the visitor click next?

Suggested content structure:

```text
AVAILABLE FOR SELECTED OPPORTUNITIES

Your Name
Software engineer building reliable,
scalable systems for real-world products.

I work across backend systems, cloud infrastructure,
data platforms, and developer tooling.

[View selected work] [Download resume]

Based in Location
Currently focused on Area / Technology
```

Desktop layout:

- Two columns.
- Left: identity, positioning, supporting copy, and actions.
- Right: restrained visual panel containing a monogram, technical diagram, profile image, or current-focus panel.

Mobile layout:

- Single column.
- Text and primary action first.
- Visual panel below.
- No oversized hero height.

## 5. Homepage Structure

### 5.1 Selected work

Move projects near the top of the page. Use a purposeful composition instead of identical cards:

- One large featured project.
- Two smaller supporting projects.
- Optional compact project list.

Project summaries should expose:

- Project number.
- Title.
- Outcome or one-line value statement.
- Description.
- Technology tags.
- Role or key contribution.
- One meaningful metric where available.
- GitHub and demo links.
- Optional visual thumbnail or technical diagram.

Example metric treatment:

```text
500k events/sec
<200ms p99 latency
```

Only use real, verified portfolio metrics.

### 5.2 Professional snapshot

Replace the generic long About block with a concise profile section and three capability pillars:

```text
ABOUT

I am a software engineer focused on building dependable backend
systems, data-intensive applications, and cloud infrastructure.

01 / Systems
Reliable services and APIs

02 / Data
Pipelines, storage, and analytics

03 / Delivery
Cloud infrastructure and automation
```

### 5.3 Experience

Use a scan-friendly editorial layout:

- Left column: dates.
- Right column: role, company, summary, achievements, and technologies.

Show fewer bullets on the homepage. Keep the complete detail on the resume page.

### 5.4 Capabilities

Replace the generic skills grid with capability groups:

- Backend: APIs, distributed systems, authentication, service design.
- Data: streaming pipelines, SQL, analytics systems, data modeling.
- Infrastructure: Kubernetes, cloud platforms, Terraform, CI/CD.
- Languages: TypeScript, JavaScript, Python, Go, Rust, SQL.

Emphasize capability areas rather than an unstructured tool inventory.

### 5.5 Education and recognition

Use a compact two-column section:

```text
EDUCATION                         RECOGNITION

Master of Science                 AWS Certified
Computer Science                  Prisma Contributor
Stanford University                VLDB Publication
2018 — 2020                       Hackathon Winner
```

### 5.6 Contact

End with a strong, simple call to action:

```text
LET'S BUILD SOMETHING USEFUL

For engineering opportunities, collaborations,
or technical conversations, reach out.

email@example.com

[Email me] [GitHub] [LinkedIn]
```

Use one primary action rather than presenting every contact link as a large bordered row.

## 6. Resume Page

The resume page should be a polished web resume rather than a duplicate of the homepage.

Recommended order:

1. Resume header.
2. Professional summary.
3. Experience.
4. Selected projects.
5. Technical capabilities.
6. Education.
7. Achievements.
8. Download PDF action.

Resume header:

```text
Your Name
Software Engineer

Location · Email · GitHub · LinkedIn

[Download PDF]
```

Add print styles and verify that the final PDF is real, current, and downloadable.

## 7. Color and Typography

### Suggested light theme

```css
--color-bg: #f4f1eb;
--color-surface: #fbfaf7;
--color-surface-muted: #e9e5dc;
--color-text: #17202a;
--color-text-muted: #59636e;
--color-border: #d6d1c7;
--color-accent: #1457d9;
--color-accent-soft: #dce7ff;
```

### Suggested dark theme

```css
--color-bg: #101419;
--color-surface: #171d24;
--color-surface-muted: #202832;
--color-text: #f1f3f5;
--color-text-muted: #aab3bd;
--color-border: #34404c;
--color-accent: #76a7ff;
```

Start with a polished light theme. Add an explicit theme toggle only if needed, and keep it progressively enhanced so the site remains usable without JavaScript.

Typography guidance:

- Large display heading for the hero only.
- Small uppercase labels for section metadata.
- Strong project and role hierarchy.
- System sans-serif for body text.
- Monospace font for technical details.
- Keep the existing spacing scale and extend it deliberately rather than introducing arbitrary values.

## 8. Component Changes

### `MainLayout.astro`

- Redesign brand and navigation.
- Add resume action.
- Improve desktop and mobile header behavior.
- Preserve semantic landmarks and keyboard focus states.

### `ProjectCard.astro`

Support:

- Featured and compact variants.
- Project number.
- Outcome/metric display.
- Contribution summary.
- Technology tags.
- Optional image or diagram.
- Improved link treatment.

### `ExperienceItem.astro`

Support:

- Date column.
- Role/company hierarchy.
- Short summary.
- Achievement list.
- Technology tags.
- Compact and expanded variants.

### `SkillsList.astro`

Render grouped capability blocks instead of a generic grid.

### `AchievementsList.astro`

Render compact editorial rows instead of large card blocks.

## 9. Data Model and Content Cleanup

Potential profile fields:

```ts
availability
location
shortIntro
currentlyFocused
socialLinks
```

Potential project fields:

```ts
slug
shortTitle
metric
role
featuredOrder
imagePosition
```

Potential experience fields:

```ts
shortSummary
companyUrl
employmentType
```

Only add fields when real content exists. Do not invent professional history or metrics.

Before deployment, replace:

- Name.
- Email.
- GitHub and LinkedIn URLs.
- Company and education records.
- Project URLs.
- Project metrics.
- Resume PDF.
- Production site URL.

## 10. Responsive and Accessibility Requirements

Test at:

- 320px.
- 375px.
- 768px.
- 1024px.
- 1440px.

Mobile must avoid horizontal overflow, tiny navigation text, dense multi-column cards, excessive hero height, large blank areas, and oversized contact rows.

Preserve or improve:

- One meaningful `h1` per page.
- Logical `h2`/`h3` hierarchy.
- Keyboard-visible focus states.
- Minimum 4.5:1 normal-text contrast.
- Descriptive external-link labels.
- Skip link.
- Semantic navigation.
- Reduced-motion support.
- Accessible theme control if added.
- No information conveyed only through hover or color.

## 11. Implementation Phases

### Phase A — Content and brand foundation

- Replace placeholder profile content.
- Define professional positioning.
- Confirm the identity, accent color, and theme direction.
- Update site title, canonical URL, and social metadata.
- Replace the placeholder PDF.

### Phase B — Design tokens

- Redesign colors.
- Establish typography scale.
- Add editorial spacing and layout tokens.
- Fix dark-theme contrast.
- Define border, surface, and focus treatments.

### Phase C — Header and hero

- Redesign the brand/header.
- Build the new hero hierarchy.
- Add a current-focus or capability panel.
- Implement responsive behavior.
- Validate the first viewport on desktop and mobile.

### Phase D — Selected work

- Add project-card variants.
- Use featured-project composition.
- Surface outcomes and metrics.
- Add project visuals only when they clarify the work.

### Phase E — Experience and capabilities

- Redesign the experience timeline.
- Replace the generic skills grid.
- Create compact education and recognition sections.
- Reduce duplicate information between home and resume.

### Phase F — Contact and resume

- Redesign the contact closing section.
- Add polished web-resume layout.
- Add print styles.
- Verify resume download and metadata.

### Phase G — Browser and performance verification

- Test all target viewport widths.
- Check console errors and warnings.
- Check the accessibility tree and keyboard focus order.
- Test themes and reduced motion.
- Run the production build.
- Compare page weight and JavaScript size with the current baseline.

## 12. Definition of Done

The redesign is complete when:

- The page has a clear personal identity rather than a generic `Portfolio` label.
- The first viewport communicates expertise and provides an obvious next action.
- The layout has strong hierarchy and no unexplained empty spaces.
- Featured work is visible quickly.
- Projects show outcomes, not just technology names.
- Experience is easy to scan.
- Light and dark themes are both readable and intentional.
- Placeholder content has been removed.
- The site feels designed at desktop and mobile widths.
- The site remains static-first and lightweight.
- No unnecessary frontend framework or animation dependency is introduced.
- Accessibility and keyboard navigation remain intact.
- The production build succeeds.
- The final browser rendering has been visually verified.

## 13. Recommended First Implementation Slice

Start with:

1. `src/data/profile.ts`
2. `src/styles/variables.css`
3. `src/layouts/MainLayout.astro`
4. `src/pages/index.astro`
5. `src/components/ProjectCard.astro`

This slice establishes the brand, visual language, header, hero, and first impression before changing every secondary section.
