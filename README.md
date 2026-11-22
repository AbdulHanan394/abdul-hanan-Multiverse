# Abdul Hanan — The Code Corsair

A cinematic full-stack developer portfolio built with Next.js App Router, TypeScript, React, Tailwind CSS, Lucide, GSAP ScrollTrigger, and an optional React Three Fiber observatory. The illustrated ship, four project landscapes, compass rose, and interactive charts are original to this portfolio. Fonts are self-hosted and include their licenses.

## Run locally

Use Node.js 22.13 or newer and npm. From this directory run the following commands.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env.local`. Open the local URL printed by Next.js. The full portfolio runs with an empty environment file.

```sh
npm run build
npm run typecheck
npm run lint
npm start
```

## Deploy to Vercel

Import this directory as the root of a Git repository into a new Vercel project. Select the Next.js preset and use the default output directory. Use Node.js 22 or newer, the install command `npm ci`, and the build command `npm run build`. Set `SITE_URL` to the final HTTPS origin and redeploy to generate correct canonical, social, robots, and sitemap URLs. Add secrets in the project’s environment settings and redeploy. The Node route at `app/api/[...path]/route.ts` serves the backend. The Worker packaging script is specific to the included private hosted edition.

## Integrations

| Setting | Behavior |
| --- | --- |
| `GITHUB_TOKEN` | Optional server-side token for the public Events API. Successful requests are cached for ten minutes per warm instance. An empty event list and an API failure have distinct displays. |
| `ASSISTANT_URL` | Full URL of a public-profile FastAPI endpoint. Enabling it replaces the curated profile explorer with a conversation. Use a portfolio-scoped knowledge collection and a stateless or visitor-isolated endpoint. |
| `ASSISTANT_API_KEY` | Optional server-side `x-api-key` sent to FastAPI. |
| `ASSISTANT_QUERY_FIELD` | Request field expected by FastAPI. Defaults to `query`. The adapter sends the current question with up to six recent messages. It accepts a string in `answer`, `content`, `response`, `response.content`, or `response.answer`. |
| `RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO` | Enable email through Resend. Use a provider-verified sender and your real recipient. The form validates names, addresses, project types, and message length on both sides. Provider acceptance triggers the success state. |
| `PUBLIC_EMAIL` | Verified email address to display publicly. |
| `RESUME_URL` | Path to a real résumé in `public/` or a trusted HTTPS file URL. Leave blank until available. |
| `ANALYTICS_SCRIPT_URL` | Optional privacy-conscious analytics script. Leave blank to disable analytics. |

The contact endpoint uses a honeypot, a request-size limit, a same-origin check, and a per-instance burst limit. The assistant uses the same request protections and separate limit. Distributed quotas for a high-traffic deployment belong at the hosting edge. The browser keeps the current conversation in memory and persists only the visitor’s quality and cursor preferences.

## Edit content and visuals

- `content/profile.ts` defines projects, stacks, milestones, profile questions, and social links. Add one project object with a unique slug and an illustration in `public/art/` to generate a case study and gallery entry. Update its chart label as appropriate.
- `app/projects/[slug]/page.tsx` renders statically generated case studies with architecture, challenges, solutions, and implementation flow. Project artwork is conceptual illustration.
- `components/` contains the sections, interactive map, logbook, sound toggle, shader-enhanced sea, and lazy 3D observatory.
- `app/globals.css` owns typography, design tokens, responsive layout, motion, and reduced-motion alternatives.
- `services/api.ts` contains the shared server adapters. The source includes no provider credentials.
- `public/art/` holds compressed WebP images. The original art direction placed a lantern-lit ship at the right of a moonlit seascape, and assigned an observatory, lighthouse, trading port, and merchant harbor to the projects.
- `scripts/build-sites.mjs` packages the production prerendered pages, public files, framework chunks, and shared API for the private deployment. Run `npm run build` before `npm run build:sites`.

## Interaction and rendering

The navigation chart is available from the hero and experience timeline. It includes direct section links, the current ship location, and quality controls. The gallery and chart lead to the same case-study URLs. The compass rose hides a captain’s note on its third click.

Lightweight mode uses the original still. Balanced adds localized water and ship motion and scroll parallax. Ultra also renders the interactive observatory near the Oracle. The initial tier considers screen width, available CPU cores, and reduced-motion preferences. The sea pauses outside the viewport, audio requires a visitor action, and WebGL failure leaves the illustrated experience usable.

Run `node scripts/verify.mjs` after packaging to check the production routes, referenced assets, missing-credential states, provider response handling, validation, and activity caching. These checks use local provider fixtures and send no email.

## Portfolio editions

Visitors enter through The Code Corsair and can select a world from the header or the illustrated gallery. Each edition has a shareable URL, four illustrated project case studies, a custom display face, a signature scene effect, and a keyboard-accessible project finder. The header selector keeps the current project when switching editions from a case study.

| Route | Edition | Project finder |
| --- | --- | --- |
| `/` | The Code Corsair | Compass bearing |
| `/worlds/orbital` | Orbital Relay | Satellite docking radius |
| `/worlds/frontier` | Dust & Iron | Two-symbol telegraph |
| `/worlds/marvel` | Marvel Multiverse | Swipeable comic panels |
| `/worlds/neon` | Neon District | Project command terminal |
| `/worlds/abyss` | Hadal Station | Sonar pulse and echo selection |
| `/worlds/clockwork` | The Clockmaker | Geared crown |
| `/worlds/alpine` | Aurora Ridge | Aurora wavelength tuner |

World identity and navigation copy live in `content/worlds/index.ts`. The shared portfolio content remains in `content/profile.ts`. Each non-maritime project illustration is in `public/worlds/{world}-{art}.webp`. The themed case studies are generated at `/worlds/{world}/projects/{slug}`. The scene renderer stops outside the viewport and when the browser tab is hidden. The pause control remembers the visitor’s preference across the seven new editions. Reduced-motion settings disable burst and transition effects. Each edition remains navigable with direct project links.
