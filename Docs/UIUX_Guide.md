# UIUX_Guide.md
## Professional Website UI/UX Design System — Rules, Rationale, and Priority Weights

**Purpose:** A practical, implementation-oriented standard for designing clear, accessible, consistent, responsive, and trustworthy websites. Use this guide for new interfaces, redesigns, design reviews, and AI-assisted frontend implementation.

**How to use the weights**
- **P0 — Critical (Weight 5):** A failure can block users, break core functionality, create serious accessibility barriers, or damage trust. Fix before release.
- **P1 — High (Weight 4):** Strongly affects comprehension, task completion, usability, or professional quality. Fix before polish work.
- **P2 — Medium (Weight 3):** Improves consistency, efficiency, scanning, and perceived quality. Fix after P0/P1 issues.
- **P3 — Polish (Weight 2):** Refinements that improve finish but rarely outweigh usability defects.
- **P4 — Contextual (Weight 1):** Apply when relevant to the product, audience, brand, and user goals.

Weights are prioritization guidance, not a substitute for user research or product-specific judgment. A rule can move up in priority if the context makes it safety-critical or business-critical.

## 1. Product Strategy and User Goals

| ID | UI rule | Importance weight | Why it matters / acceptance check |
|---|---|---:|---|
| STR-01 | Define the primary audience, their needs, and the main task before designing screens. | P0 · 5 | Each major screen should serve a clearly stated user need. |
| STR-02 | Give every page one explicit primary objective. | P0 · 5 | The page's main action or information goal is obvious without explanation. |
| STR-03 | Prioritize content and actions by user value, not by internal organizational structure. | P1 · 4 | Users can find the thing they came for without learning company terminology. |
| STR-04 | Design the shortest reasonable path to the user's primary goal. | P0 · 5 | Remove unnecessary steps, fields, decisions, and page transitions. |
| STR-05 | Make the next useful action clear at each meaningful step. | P1 · 4 | Users do not have to guess what to do next. |
| STR-06 | Separate primary, secondary, and destructive actions visually and semantically. | P0 · 5 | The most important action is easy to identify; destructive actions are not mistaken for routine ones. |
| STR-07 | Do not add UI elements solely because they are fashionable or easy to implement. | P1 · 4 | Every component supports a user goal, comprehension, feedback, or brand expression. |
| STR-08 | Validate important design assumptions with users, analytics, support data, or usability testing. | P1 · 4 | Major choices have evidence or are clearly recorded as hypotheses. |

## 2. Information Architecture and Navigation

| ID | UI rule | Importance weight | Why it matters / acceptance check |
|---|---|---:|---|
| IA-01 | Group related information into recognizable categories. | P1 · 4 | Users can predict where content belongs. |
| IA-02 | Use navigation labels that match the audience's language. | P0 · 5 | Labels are specific, familiar, and understandable without internal jargon. |
| IA-03 | Keep the primary navigation focused on the most important destinations. | P1 · 4 | The main menu is not overloaded with every possible link. |
| IA-04 | Make the current location or active navigation item identifiable. | P1 · 4 | Users can tell which section or page they are viewing. |
| IA-05 | Use consistent navigation placement and behavior across related pages. | P1 · 4 | Users do not have to relearn the interface on each page. |
| IA-06 | Provide breadcrumbs when users need to understand a deep hierarchy or move to parent levels. | P2 · 3 | Breadcrumbs add orientation where hierarchy exists; do not add them mechanically to flat sites. |
| IA-07 | Make the logo's destination predictable, usually the homepage. | P2 · 3 | Logo behavior matches common expectations. |
| IA-08 | Give search a clear purpose, useful results, and an understandable empty state. | P1 · 4 | Search is not merely a decorative input; it helps users find relevant content. |
| IA-09 | On long pages, provide useful section headings and in-page navigation when it materially improves orientation. | P2 · 3 | Users can scan or jump to relevant sections efficiently. |
| IA-10 | Avoid duplicate navigation patterns that compete for attention. | P2 · 3 | Header, sidebar, tabs, and in-page links each have a clear role. |

## 3. Layout, Grid, and Spacing

| ID | UI rule | Importance weight | Why it matters / acceptance check |
|---|---|---:|---|
| LAY-01 | Establish a consistent spacing scale and reuse it across components. | P1 · 4 | Spacing feels intentional rather than arbitrary. |
| LAY-02 | Use a grid and alignment system for page sections, cards, and controls. | P1 · 4 | Related edges line up and layouts feel coherent. |
| LAY-03 | Align elements by meaningful edges, baselines, and shared containers. | P1 · 4 | Avoid small, unexplained misalignments that make a page feel unfinished. |
| LAY-04 | Group related elements closely and separate unrelated groups more clearly. | P0 · 5 | Proximity communicates relationships without extra labels. |
| LAY-05 | Use whitespace to improve grouping and readability, not as filler. | P1 · 4 | Empty space has a clear purpose and does not push key content unnecessarily far away. |
| LAY-06 | Set a readable content width for text-heavy pages. | P1 · 4 | Long lines do not make paragraphs difficult to track. |
| LAY-07 | Avoid forcing equal card heights when doing so creates large, meaningless gaps. | P2 · 3 | Alignment supports scanning without making content feel sparse. |
| LAY-08 | Keep spacing rules consistent between repeated components. | P1 · 4 | Equivalent cards, fields, and sections use equivalent spacing. |
| LAY-09 | Use responsive constraints instead of relying on fixed widths for major containers. | P0 · 5 | Layouts adapt to narrow screens and enlarged text. |
| LAY-10 | Check for horizontal overflow at all supported viewport sizes. | P0 · 5 | No essential content or control is clipped or requires unintended horizontal scrolling. |
| LAY-11 | Keep important content away from unsafe edges, notches, sticky overlays, and browser UI. | P1 · 4 | Content remains visible and operable on real devices. |
| LAY-12 | Use full-width sections only when the content or visual goal benefits from them. | P3 · 2 | Wide layouts do not make reading or scanning harder. |

## 4. Typography and Readability

| ID | UI rule | Importance weight | Why it matters / acceptance check |
|---|---|---:|---|
| TYP-01 | Define a deliberate type scale for page titles, headings, body text, labels, and metadata. | P1 · 4 | Hierarchy is consistent across the site. |
| TYP-02 | Use body text that remains comfortably readable on common devices. | P0 · 5 | Essential text is not made tiny to fit more content. |
| TYP-03 | Use font weights to communicate hierarchy rather than making everything bold. | P2 · 3 | Emphasis remains meaningful. |
| TYP-04 | Keep paragraph line length comfortable, generally around 45–85 characters where practical. | P2 · 3 | Long passages are easier to read and track. |
| TYP-05 | Use line height appropriate to text size and density. | P1 · 4 | Lines do not collide or feel unnecessarily detached. |
| TYP-06 | Avoid awkward wrapping and automatic hyphenation in headings, labels, and short descriptions. | P1 · 4 | Text does not split words unnaturally or create ragged, distracting layouts. |
| TYP-07 | Use sentence case for most headings and interface labels unless the brand system has a reason not to. | P3 · 2 | Text is easier to scan and does not feel unnecessarily shouty. |
| TYP-08 | Reserve all-caps text for short labels and use suitable letter spacing. | P3 · 2 | Small labels can look deliberate without becoming hard to read. |
| TYP-09 | Use no more typefaces than the design system can justify. | P2 · 3 | A restrained type palette improves consistency and performance. |
| TYP-10 | Do not use color alone to communicate a heading level or important status. | P0 · 5 | Structure and meaning remain available to users with color-vision differences. |
| TYP-11 | Avoid low-contrast, overly thin, or excessively condensed type for essential content. | P0 · 5 | Text remains legible in different lighting and display conditions. |
| TYP-12 | Check headings, buttons, and navigation at translated text lengths and browser zoom. | P1 · 4 | The interface does not depend on one exact string length. |

## 5. Color, Contrast, and Visual Hierarchy

| ID | UI rule | Importance weight | Why it matters / acceptance check |
|---|---|---:|---|
| COL-01 | Define semantic color tokens for text, surfaces, borders, actions, success, warning, and error. | P1 · 4 | Components use consistent meanings rather than ad hoc colors. |
| COL-02 | Meet WCAG AA contrast targets for normal text and large text. | P0 · 5 | Aim for at least 4.5:1 for normal text and 3:1 for large text. |
| COL-03 | Ensure meaningful controls, boundaries, and focus indicators have adequate non-text contrast. | P0 · 5 | Interactive elements remain distinguishable from their surroundings. |
| COL-04 | Use color to reinforce hierarchy, not to make every element compete. | P1 · 4 | A small number of clear accents carry more meaning. |
| COL-05 | Do not rely on color alone for errors, statuses, charts, or selection states. | P0 · 5 | Add text, icons, patterns, or other cues where needed. |
| COL-06 | Verify both light and dark themes independently. | P0 · 5 | Do not simply invert colors; review contrast, depth, borders, and hierarchy in each theme. |
| COL-07 | Keep backgrounds and surfaces visually distinct enough to show grouping without excessive borders. | P2 · 3 | Cards and sections are discernible without creating visual noise. |
| COL-08 | Reserve the strongest accent for primary actions and genuinely important states. | P2 · 3 | Accent color retains its signal value. |
| COL-09 | Avoid gradients and decorative color effects when they weaken contrast or content clarity. | P3 · 2 | Decoration does not interfere with reading or task completion. |
| COL-10 | Test color combinations using measured contrast rather than visual intuition alone. | P0 · 5 | A palette that looks fine on one screen may fail contrast requirements elsewhere. |

## 6. Components, Cards, and Surfaces

| ID | UI rule | Importance weight | Why it matters / acceptance check |
|---|---|---:|---|
| CMP-01 | Build repeated UI from reusable components with shared tokens and documented variants. | P1 · 4 | Fixes and refinements remain consistent across the site. |
| CMP-02 | Give every card a clear purpose and a predictable content hierarchy. | P1 · 4 | Users can identify the title, supporting information, and relevant action quickly. |
| CMP-03 | Do not wrap content in cards unless the grouping adds meaning or improves scanning. | P2 · 3 | Excessive card surfaces create visual fragmentation. |
| CMP-04 | Keep card padding, heading placement, and internal spacing consistent across equivalent cards. | P1 · 4 | Repeated content looks deliberate and is easier to compare. |
| CMP-05 | Use borders, shadows, and background contrast sparingly; avoid stacking all three without a reason. | P2 · 3 | Surfaces gain definition without looking heavy. |
| CMP-06 | Make the full card clickable only when the whole card represents one coherent destination. | P1 · 4 | Nested links and controls do not create ambiguous click targets. |
| CMP-07 | Give interactive cards clear hover, focus, and pressed states. | P1 · 4 | Users can recognize interaction and keyboard users receive equivalent feedback. |
| CMP-08 | Use badges and chips only when they communicate status, category, selection, or a meaningful action. | P2 · 3 | Decorative tags do not overwhelm the primary content. |
| CMP-09 | Keep chip labels short and ensure chips wrap cleanly on narrow screens. | P2 · 3 | Tags remain readable without awkward clipping or excessive height. |
| CMP-10 | Use consistent corner-radius tokens and avoid mixing unrelated radius styles. | P3 · 2 | Components share a coherent visual language. |
| CMP-11 | Avoid unnecessary icons when text already communicates the meaning clearly. | P2 · 3 | Icons should improve recognition, not add decoration or ambiguity. |
| CMP-12 | Use a consistent icon family, stroke weight, and optical size. | P3 · 2 | Icons look related rather than assembled from mismatched sources. |

## 7. Buttons, Links, and Interactive Controls

| ID | UI rule | Importance weight | Why it matters / acceptance check |
|---|---|---:|---|
| INT-01 | Use one visually dominant primary action per major decision area when possible. | P1 · 4 | Users can identify the recommended next step without sorting through competing buttons. |
| INT-02 | Use action labels that describe the result, such as “Save changes” rather than “Submit” when appropriate. | P1 · 4 | Users understand what will happen before acting. |
| INT-03 | Make links visually distinguishable from ordinary text. | P0 · 5 | Link affordance does not depend solely on hover. |
| INT-04 | Provide visible hover, focus-visible, active, disabled, and loading states where applicable. | P0 · 5 | Users receive consistent feedback across input methods and network states. |
| INT-05 | Ensure touch targets are comfortably sized; aim for at least 44 × 44 CSS pixels where practical. | P1 · 4 | Small controls are less likely to be missed on touchscreens. |
| INT-06 | Separate destructive actions from routine actions and require confirmation when the consequence warrants it. | P0 · 5 | Users are less likely to delete or overwrite important data accidentally. |
| INT-07 | Do not use a pointer cursor or hover styling on elements that are not interactive. | P2 · 3 | Visual behavior accurately communicates what can be clicked. |
| INT-08 | Make external links and downloads understandable when the destination or behavior is not obvious. | P2 · 3 | Users can make informed decisions before leaving a page or downloading a file. |
| INT-09 | Prevent double submission and communicate progress for actions that take time. | P0 · 5 | Users do not accidentally trigger duplicate purchases, forms, or records. |
| INT-10 | Ensure every visible control has a real, tested outcome. | P0 · 5 | No dead buttons, fake toggles, or controls that merely look functional. |

## 8. Forms, Validation, and Data Entry

| ID | UI rule | Importance weight | Why it matters / acceptance check |
|---|---|---:|---|
| FRM-01 | Label every input persistently; do not rely on placeholder text as the only label. | P0 · 5 | Context remains available after users start typing. |
| FRM-02 | Ask only for information necessary to complete the task or a clearly explained secondary purpose. | P1 · 4 | Shorter forms reduce effort and abandonment. |
| FRM-03 | Group fields logically and order them in the sequence users expect. | P1 · 4 | The form follows a predictable mental model. |
| FRM-04 | Use the appropriate input type, autocomplete token, and keyboard for each field. | P1 · 4 | Browsers can offer better autofill and mobile input behavior. |
| FRM-05 | Explain formatting requirements before users encounter an error. | P1 · 4 | Users can enter valid data on the first attempt. |
| FRM-06 | Validate at a useful time and preserve entered data when errors occur. | P0 · 5 | Users are not forced to reconstruct a long form after a preventable failure. |
| FRM-07 | Put error messages beside the relevant field and explain how to fix the problem. | P0 · 5 | Errors are easy to locate and actionable. |
| FRM-08 | Associate labels, instructions, and error messages programmatically with inputs. | P0 · 5 | Assistive technology can convey the same context. |
| FRM-09 | Distinguish required and optional fields clearly and consistently. | P1 · 4 | Users understand what must be completed. |
| FRM-10 | Show a clear success state after saving or submitting. | P1 · 4 | Users know whether the action worked. |
| FRM-11 | Warn before discarding substantial unsaved work when loss would be costly. | P1 · 4 | Accidental navigation does not silently destroy effort. |
| FRM-12 | Avoid resetting the entire form after a recoverable server or validation error. | P0 · 5 | Failure does not erase user progress. |

## 9. Accessibility and Inclusive Design

| ID | UI rule | Importance weight | Why it matters / acceptance check |
|---|---|---:|---|
| ACC-01 | Use semantic HTML elements according to their purpose. | P0 · 5 | Native semantics improve keyboard use, assistive technology, and browser behavior. |
| ACC-02 | Ensure every interactive feature is operable using a keyboard. | P0 · 5 | Users do not need a mouse to navigate, activate, or dismiss controls. |
| ACC-03 | Provide a visible focus indicator and never remove it without an equivalent replacement. | P0 · 5 | Keyboard users can track their current position. |
| ACC-04 | Use a logical heading hierarchy without skipping levels merely for visual styling. | P1 · 4 | Screen-reader navigation reflects the content structure. |
| ACC-05 | Give meaningful images useful alternative text and decorative images empty alt text. | P0 · 5 | Image meaning is conveyed without redundant narration. |
| ACC-06 | Give icon-only buttons accessible names. | P0 · 5 | Assistive technology can explain each control's purpose. |
| ACC-07 | Ensure dialogs manage focus, support dismissal when appropriate, and return focus to the trigger. | P0 · 5 | Modal interactions do not trap users in confusing navigation states. |
| ACC-08 | Respect reduced-motion preferences and avoid essential information conveyed only through animation. | P1 · 4 | Motion-sensitive users can use the interface comfortably. |
| ACC-09 | Support zoom and text resizing without loss of content or functionality. | P0 · 5 | Users can enlarge content without being blocked by fixed layouts. |
| ACC-10 | Use descriptive link text rather than repeated vague labels such as “Click here.” | P1 · 4 | Links make sense in context and when encountered out of context. |
| ACC-11 | Announce important dynamic updates appropriately to assistive technology. | P1 · 4 | Status changes, validation results, and async outcomes are not silently missed. |
| ACC-12 | Do not set a time limit unless the task requires it; warn users and allow extensions when possible. | P1 · 4 | Users have enough time to complete tasks. |
| ACC-13 | Test with automated checks and manual keyboard/screen-reader review. | P0 · 5 | Automated scans alone cannot detect every interaction or comprehension problem. |
| ACC-14 | Target WCAG 2.2 AA unless a stricter product or legal requirement applies. | P0 · 5 | A recognized accessibility baseline guides design and validation. |

## 10. Responsive Design and Mobile UX

| ID | UI rule | Importance weight | Why it matters / acceptance check |
|---|---|---:|---|
| RSP-01 | Design for content-driven breakpoints rather than copying device-specific dimensions blindly. | P1 · 4 | Layout changes occur where content needs them. |
| RSP-02 | Test narrow, medium, and wide viewports, including intermediate widths. | P0 · 5 | A layout that works at two endpoints can still break between them. |
| RSP-03 | Reflow content in a sensible reading order on small screens. | P0 · 5 | The visual and keyboard order remain understandable. |
| RSP-04 | Avoid fixed-height containers around content that can wrap or grow. | P0 · 5 | Text, translation, and zoom do not clip essential content. |
| RSP-05 | Make mobile navigation easy to open, understand, and dismiss. | P1 · 4 | Navigation does not obscure the task or become difficult to operate. |
| RSP-06 | Keep important actions reachable without covering content with sticky elements. | P1 · 4 | Sticky bars and headers do not obstruct controls or reading. |
| RSP-07 | Do not communicate information only through hover. | P0 · 5 | Touch and keyboard users receive equivalent information. |
| RSP-08 | Use responsive images and avoid loading unnecessarily large assets on small devices. | P1 · 4 | Performance and bandwidth use remain reasonable. |
| RSP-09 | Test real touch interactions, including scrolling, swipe areas, and accidental activation. | P1 · 4 | Controls do not interfere with common gestures. |
| RSP-10 | Ensure tables, code blocks, charts, and other dense content have an intentional small-screen strategy. | P1 · 4 | Complex content remains usable rather than simply overflowing. |

## 11. Content Design and Microcopy

| ID | UI rule | Importance weight | Why it matters / acceptance check |
|---|---|---:|---|
| CNT-01 | Use plain, specific language and explain unavoidable technical terminology. | P1 · 4 | Users understand the interface without decoding internal jargon. |
| CNT-02 | Put the most important information first. | P1 · 4 | Users can scan rather than read every line to understand the point. |
| CNT-03 | Keep labels, instructions, and messages concise without removing necessary context. | P2 · 3 | Short copy reduces clutter while preserving clarity. |
| CNT-04 | Use consistent terms for the same concept throughout the product. | P1 · 4 | Different labels do not make one feature appear to be several. |
| CNT-05 | Write useful empty states that explain what is absent and how to proceed. | P1 · 4 | Empty screens provide direction instead of dead ends. |
| CNT-06 | Make error messages factual, respectful, and actionable. | P0 · 5 | Users know what failed, what remains intact, and what to do next. |
| CNT-07 | Avoid fake urgency, misleading scarcity, hidden fees, and manipulative interface patterns. | P0 · 5 | Trust and informed consent take precedence over conversion tricks. |
| CNT-08 | Use realistic content during design and testing, not only short placeholder strings. | P1 · 4 | Realistic lengths reveal wrapping and layout failures early. |
| CNT-09 | Specify date, time, currency, and number formats appropriate to the user's locale. | P1 · 4 | Data is interpreted correctly across regions. |
| CNT-10 | Proofread all visible text and remove placeholder copy before release. | P1 · 4 | Typos and unfinished content undermine credibility. |

## 12. Feedback, Loading, Empty, and Error States

| ID | UI rule | Importance weight | Why it matters / acceptance check |
|---|---|---:|---|
| STA-01 | Design default, hover, focus, active, disabled, loading, success, empty, and error states as relevant. | P0 · 5 | Components are complete beyond the ideal path. |
| STA-02 | Show loading feedback when an action takes long enough that users might wonder whether it worked. | P1 · 4 | The interface communicates that work is in progress. |
| STA-03 | Use skeletons only when they reflect the eventual layout and do not create misleading motion. | P3 · 2 | Loading placeholders help orientation rather than becoming decoration. |
| STA-04 | Preserve user input and context after recoverable failures. | P0 · 5 | Users can retry without repeating completed work. |
| STA-05 | Explain whether an error is temporary, what failed, and whether retrying is safe when relevant. | P1 · 4 | Users can make a sensible recovery decision. |
| STA-06 | Confirm successful actions with feedback proportional to their importance. | P1 · 4 | Minor actions need subtle confirmation; consequential actions need explicit confirmation. |
| STA-07 | Do not use transient toasts for critical information that users must retain or act upon. | P1 · 4 | Important messages remain available long enough to understand and resolve. |
| STA-08 | Ensure feedback is perceivable without relying only on color, sound, or animation. | P0 · 5 | Users with different sensory abilities receive equivalent information. |

## 13. Motion and Animation

| ID | UI rule | Importance weight | Why it matters / acceptance check |
|---|---|---:|---|
| MOT-01 | Animate to explain a transition, confirm an action, or preserve spatial context. | P2 · 3 | Motion has a functional purpose. |
| MOT-02 | Keep routine transitions short and unobtrusive. | P3 · 2 | Animation does not slow down repeated tasks. |
| MOT-03 | Avoid parallax, looping motion, and large entrance animations that delay access to content. | P2 · 3 | Visual spectacle does not compete with the task. |
| MOT-04 | Respect `prefers-reduced-motion` and provide a reduced-motion experience. | P0 · 5 | Users can limit nonessential motion. |
| MOT-05 | Do not make essential information available only during an animation or hover transition. | P0 · 5 | Content remains accessible regardless of motion or input method. |
| MOT-06 | Keep animation behavior consistent for similar actions. | P3 · 2 | The interface feels predictable. |

## 14. Images, Icons, and Visual Assets

| ID | UI rule | Importance weight | Why it matters / acceptance check |
|---|---|---:|---|
| IMG-01 | Use images that support the content, product, or brand message. | P2 · 3 | Assets clarify or strengthen meaning rather than filling space. |
| IMG-02 | Preserve appropriate image aspect ratios and use intentional cropping. | P2 · 3 | Subjects are not stretched or cropped unpredictably. |
| IMG-03 | Optimize image formats, dimensions, and compression for the display context. | P1 · 4 | Large assets do not unnecessarily slow the page. |
| IMG-04 | Avoid generic stock imagery when authentic product visuals or relevant diagrams would be more informative. | P3 · 2 | Visuals feel credible and specific to the product. |
| IMG-05 | Ensure charts and diagrams have labels, legends, and accessible summaries where needed. | P0 · 5 | Visual data remains understandable beyond color and shape alone. |
| IMG-06 | Use consistent illustration and icon styles throughout a page or product. | P3 · 2 | Assets do not feel visually disconnected. |
| IMG-07 | Provide explicit dimensions or aspect ratios to reduce layout shift during loading. | P1 · 4 | Content does not jump unexpectedly as assets appear. |

## 15. Performance and Perceived Speed

| ID | UI rule | Importance weight | Why it matters / acceptance check |
|---|---|---:|---|
| PER-01 | Treat performance as part of UX, not a final optimization task. | P0 · 5 | Slow interfaces reduce confidence and task completion. |
| PER-02 | Prioritize good Core Web Vitals: LCP, INP, and CLS. | P1 · 4 | Monitor real-user data and investigate regressions against current recommended thresholds. |
| PER-03 | Load only the JavaScript and CSS needed for the experience. | P1 · 4 | Unnecessary bundles increase download, parse, and execution cost. |
| PER-04 | Lazy-load below-the-fold images and noncritical content where appropriate. | P2 · 3 | Initial loading work is focused on what users need first. |
| PER-05 | Reserve space for images, embeds, and dynamic content. | P1 · 4 | Late-loading content does not shift controls or text unexpectedly. |
| PER-06 | Avoid autoplaying heavy media and loading third-party scripts without a clear need. | P1 · 4 | Network, battery, privacy, and responsiveness are protected. |
| PER-07 | Provide feedback for slow network requests and make retries safe. | P1 · 4 | Users can understand and recover from delayed operations. |
| PER-08 | Test on realistic lower-end devices and slower connections. | P1 · 4 | Performance does not depend on a powerful development machine. |

## 16. Trust, Privacy, and Security UX

| ID | UI rule | Importance weight | Why it matters / acceptance check |
|---|---|---:|---|
| TRU-01 | Explain why sensitive or personal information is requested. | P0 · 5 | Users understand the purpose before sharing data. |
| TRU-02 | Request consent clearly and do not bundle unrelated permissions into one vague choice. | P0 · 5 | Consent is informed and specific. |
| TRU-03 | Make pricing, renewal terms, fees, and cancellation conditions visible before commitment. | P0 · 5 | Users can make informed purchasing decisions. |
| TRU-04 | Make destructive, financial, or irreversible actions explicit before completion. | P0 · 5 | Consequences are understood before the user commits. |
| TRU-05 | Avoid dark patterns, disguised advertisements, preselected optional purchases, and obstructive cancellation. | P0 · 5 | The interface respects user autonomy. |
| TRU-06 | Explain permission failures and provide a reasonable alternative when possible. | P1 · 4 | Users are not stranded by denied permissions. |
| TRU-07 | Never expose secrets, private data, or sensitive account details in visible UI or logs unnecessarily. | P0 · 5 | Interface and debugging behavior protect user information. |
| TRU-08 | Make security-related status and session behavior understandable without revealing sensitive implementation details. | P1 · 4 | Users can recognize relevant security events and take appropriate action. |

## 17. Design Tokens, Themes, and Consistency

| ID | UI rule | Importance weight | Why it matters / acceptance check |
|---|---|---:|---|
| DS-01 | Centralize color, spacing, typography, radius, shadow, and breakpoint tokens. | P1 · 4 | Global changes are reliable and consistent. |
| DS-02 | Use semantic tokens such as `text-primary`, `surface-card`, and `border-subtle` rather than scattering raw values. | P1 · 4 | Components communicate intent and support theme changes. |
| DS-03 | Define a limited, documented set of component variants. | P2 · 3 | Similar components do not drift into unrelated designs. |
| DS-04 | Maintain consistent interaction states and motion conventions. | P1 · 4 | Users learn behavior once and reuse that knowledge. |
| DS-05 | Verify theme combinations for contrast and semantic meaning. | P0 · 5 | A theme switch does not make content invisible or statuses misleading. |
| DS-06 | Avoid one-off styles unless there is a documented reason. | P2 · 3 | Exceptions remain intentional rather than accumulating into inconsistency. |
| DS-07 | Document token names, component anatomy, variants, and usage guidance. | P2 · 3 | Designers and developers can apply the system consistently. |

## 18. SEO, Discoverability, and Shareability

| ID | UI rule | Importance weight | Why it matters / acceptance check |
|---|---|---:|---|
| SEO-01 | Use a unique, descriptive page title and a meaningful primary heading. | P1 · 4 | Users and search engines can identify the page's purpose. |
| SEO-02 | Use semantic links and meaningful anchor text for important destinations. | P1 · 4 | Navigation remains understandable and discoverable. |
| SEO-03 | Ensure essential content is available to search engines where discoverability is a product goal. | P1 · 4 | Core content is not hidden behind inaccessible client-only behavior without a reason. |
| SEO-04 | Provide meaningful metadata and social-sharing previews for shareable pages. | P2 · 3 | Shared links communicate their destination accurately. |
| SEO-05 | Avoid misleading headings, link labels, and metadata that promise content the page does not provide. | P0 · 5 | Discoverability does not come at the cost of trust. |

## 19. Testing, Quality Assurance, and Release Readiness

| ID | UI rule | Importance weight | Why it matters / acceptance check |
|---|---|---:|---|
| QA-01 | Test critical user journeys from entry to successful completion. | P0 · 5 | Core workflows work end to end, not just as isolated screens. |
| QA-02 | Review every page at supported viewport sizes and browser zoom levels. | P0 · 5 | Layout and functionality survive realistic viewing conditions. |
| QA-03 | Test keyboard navigation, visible focus, and logical focus order. | P0 · 5 | Keyboard-only operation is complete and predictable. |
| QA-04 | Check text and non-text contrast with an appropriate tool. | P0 · 5 | Accessibility does not depend on subjective visual judgment. |
| QA-05 | Test empty, loading, success, validation, offline, and server-error states where relevant. | P0 · 5 | Failure paths receive the same design attention as success paths. |
| QA-06 | Check console errors, broken links, missing assets, and nonfunctional controls. | P1 · 4 | The delivered interface is operational, not merely visually convincing. |
| QA-07 | Test long text, short text, missing data, and unusually large content. | P1 · 4 | Layouts tolerate realistic data variation. |
| QA-08 | Review the design at actual rendered size rather than relying only on design-tool zoom. | P2 · 3 | Typography and spacing work at the scale users experience. |
| QA-09 | Run usability tests on high-impact flows and observe where users hesitate or make errors. | P1 · 4 | Design decisions are validated against behavior. |
| QA-10 | Fix functional, accessibility, and hierarchy defects before adding decorative polish. | P0 · 5 | Effort is spent in order of impact. |
| QA-11 | Check analytics and feedback for task failures, repeated errors, and abandonment after release. | P2 · 3 | The interface improves based on real usage. |
| QA-12 | Keep a documented exception list for rules intentionally not followed. | P3 · 2 | Trade-offs are visible, deliberate, and reviewable. |

## 20. Landing Pages and Marketing Websites

| ID | UI rule | Importance weight | Why it matters / acceptance check |
|---|---|---:|---|
| MKT-01 | Make the hero section communicate what the product is, who it serves, and its primary value. | P1 · 4 | A first-time visitor can understand the offer quickly. |
| MKT-02 | Use one clear primary hero CTA and a secondary action only when it serves a distinct need. | P1 · 4 | Visitors are not forced to choose between several equally prominent actions. |
| MKT-03 | Show evidence for important claims through real features, examples, results, or credible testimonials. | P0 · 5 | Persuasion is supported by verifiable substance. |
| MKT-04 | Keep navigation, hero content, and the first major section focused on the visitor's decision. | P1 · 4 | The page does not bury its value under decorative content. |
| MKT-05 | Use screenshots or product demonstrations when they explain the product better than generic imagery. | P2 · 3 | Visitors can see what they are evaluating. |
| MKT-06 | Make CTA destinations and post-click outcomes match the labels. | P0 · 5 | The next step is predictable and does not feel like a bait-and-switch. |
| MKT-07 | Keep testimonials, customer logos, metrics, and certifications authentic and permissioned. | P0 · 5 | Social proof builds trust only when genuine. |
| MKT-08 | Avoid pop-ups that interrupt users before they understand the page, unless evidence supports the interruption. | P2 · 3 | Conversion tactics do not overwhelm the core experience. |

## 21. Dashboards and Data-Heavy Interfaces

| ID | UI rule | Importance weight | Why it matters / acceptance check |
|---|---|---:|---|
| DSH-01 | Put the most decision-relevant metrics first and explain unfamiliar metrics. | P1 · 4 | Users can identify what requires attention. |
| DSH-02 | Use charts that match the analytical question and label units, axes, and time ranges. | P0 · 5 | The visualization does not distort or obscure the data. |
| DSH-03 | Avoid using pie charts for many categories or subtle differences that require precise comparison. | P2 · 3 | Chart form supports accurate interpretation. |
| DSH-04 | Provide a table or textual equivalent when chart precision or accessibility requires it. | P1 · 4 | Users can inspect exact values without relying on visual estimation. |
| DSH-05 | Make filters, sort order, and applied date ranges visible. | P1 · 4 | Users understand which data they are seeing. |
| DSH-06 | Distinguish zero values, missing data, loading, and errors. | P0 · 5 | Absence of information is not mistaken for a real zero. |
| DSH-07 | Use stable formatting and units across related metrics. | P1 · 4 | Comparisons are meaningful and not misleading. |
| DSH-08 | Avoid showing every available metric at once; progressively disclose secondary detail. | P1 · 4 | The dashboard remains focused on decisions rather than data volume. |

## 22. Practical Design Review Checklist

Use this checklist before approval or release.

### Critical — resolve before release
- [ ] The page's primary purpose and next action are clear.
- [ ] All visible controls work and provide appropriate feedback.
- [ ] Keyboard navigation and visible focus work throughout the page.
- [ ] Text and interactive elements meet applicable contrast requirements.
- [ ] Forms have persistent labels, useful validation, and recoverable errors.
- [ ] Content remains usable at narrow widths and enlarged text settings.
- [ ] No important content is clipped, hidden, or available only on hover.
- [ ] Destructive actions, costs, permissions, and consent are clearly explained.
- [ ] Loading, empty, success, and error states are designed where relevant.
- [ ] No critical privacy, security, or misleading-content issue remains.

### High — resolve before visual polish
- [ ] Information architecture and labels match the user's mental model.
- [ ] Spacing, alignment, typography, and component patterns are consistent.
- [ ] Primary and secondary actions are visually distinguishable.
- [ ] Realistic content lengths have been tested.
- [ ] Mobile navigation and touch interactions are usable.
- [ ] Images are optimized and do not cause layout shifts.
- [ ] Key journeys have been tested end to end.

### Medium and polish
- [ ] Unnecessary cards, borders, badges, icons, and labels have been removed.
- [ ] Decorative motion serves a clear purpose and respects reduced-motion settings.
- [ ] Light and dark themes have been reviewed independently, if supported.
- [ ] Visual assets use a coherent style.
- [ ] Remaining exceptions are intentional and documented.

## 23. Implementation Guidance for AI Coding Agents

When using this guide as a prompt or repository instruction:

1. Inspect the existing application, routes, components, styling conventions, and design tokens before changing code.
2. Preserve the product's established brand identity unless the task explicitly requests a rebrand.
3. Identify the highest-impact usability and accessibility problems before making visual changes.
4. Reuse existing components and dependencies when they are fit for purpose; do not add libraries for minor visual effects.
5. Make changes in coherent, testable increments rather than replacing unrelated parts of the application.
6. Do not fabricate product copy, user metrics, customer logos, testimonials, certifications, project results, or technical capabilities.
7. Ensure every new interaction has a defined action, state, keyboard behavior, and feedback.
8. Verify responsive behavior at representative widths and check for overflow, clipping, and layout shifts.
9. Run available tests, linting, type checks, and builds when possible; report failures honestly.
10. Report what changed, what was tested, what remains uncertain, and any intentional exceptions.
11. Prefer simple, robust layouts over trend-driven effects that add complexity without improving usability.
12. Do not claim WCAG conformance, performance compliance, or complete browser support unless the relevant checks were actually performed.

## 24. Rule Application and Conflict Resolution

When rules conflict, use this order of precedence:

1. Safety, privacy, security, and legal obligations.
2. Core task completion and data integrity.
3. Accessibility and inclusive use.
4. Content clarity and information hierarchy.
5. Responsive behavior and performance.
6. Consistency and maintainability.
7. Brand expression and visual polish.

Do not interpret this order as permission to ignore lower-ranked requirements; it is a method for resolving genuine trade-offs. Document context-specific exceptions and validate them where practical.

**Final standard:** A professional interface is not one with the most effects, cards, animations, or visual novelty. It is one that helps the intended user understand the content, complete the task, recover from errors, and trust the product with the least unnecessary effort.
