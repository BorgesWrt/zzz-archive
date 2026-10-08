# ZZZ Archive

Independent English-language fan service, inspired by Ashen Archive’s dark panels, signal typography and linked records. Original Ashen Archive is not modified.

## Local use

Node 22+ recommended. From this folder:

    npm install
    npm run dev
    npm run check
    npm run check:data
    npm run build

Vite is a local dependency: globally upgrading npm does not install project dependencies. Local URL: http://127.0.0.1:4174/. To preview advertising layout add VITE_AD_PREVIEW=true in .env.local and restart. Advertising is off by default.

## Coverage and architecture

222 records: 33 Agents, 15 editorial teams, 49 build contexts, 19 W-Engines, 22 Disc sets, 10 Bangboo, 13 factions, 7 learning guides and 33 Agent library pages (5 individual guides, 28 reference profiles), and linked modes/stages/enemies/patches/events. This is a curated starter catalog, not the entire game roster.

- domain.ts: typed entities, introduction/version/date semantics.
- catalog.ts: factual catalog and per-record sources.
- service-data.ts: separate teams, build variants, equipment plans and original tactical text.
- data.ts: stable IDs, index and directed graph edges. Namespace zzz:ID is reserved for future cross-site linking.
- logic.ts: additional-ability rules, engine specialty matching through the planner, Bangboo count checks and validated local roster input.
- Tools.tsx: URL-shareable squad selection, device-local roster, missing-Agent team candidates, greedy disjoint squad suggestion.
- GraphMap.tsx: interactive incoming/outgoing connection view.
- Compare.tsx: equipment and mode execution comparison.

Routes: /, /builds, /explore/:kind, /records/:kind/:id, /search, /graph?node=ID, /planner?squad=ID,ID,ID, /roster, /compare?a=BUILD&b=BUILD, /sources, /privacy. Search/filter parameters survive a shared URL. Lists can filter by tags such as attributes, specialties and access category.

## Evidence and patch boundaries

Snapshot reviewed 2026-10-04, indexed release 3.2. Official sources: https://zenless.hoyoverse.com/en-us/news/166000 and /166475; faction directory /en-us/character. Individual equipment/stat suggestions link to Prydwen profiles, Bangboo to Icy Veins. Small paraphrases and original text are used, without copying full guides.

patch is the catalog snapshot; introducedIn filters availability when known; sourceReviewedIn records older equipment review versions; validFrom/validUntil use explicit offsets only. Server-time events are displayed as text until server region is known. Earlier patch selection filters introductions and does not reconstruct historical balance. Unknown kit rules return Unknown, never a guessed activation. Frost counts as Ice for squad conditions while anomaly mechanics remain distinct.

Build candidates are not a DPS ranking. Source dates do not prove current-patch testing. Additional ability activation is separate from actual synergy. The three-squad tool is greedy and may miss a better allocation.

## Internal advertising plan

No provider, trackers, analytics or remote fonts are connected. AdSlot is disabled normally; the optional preview reserves a clearly labeled area after page content without interfering with tools. Privacy preference is device-local and does not authorize or load a network.

Before commercial release: choose network and regions, disclose operator contact and exact provider purposes, implement the provider-approved consent manager with reject/withdraw controls, integrate scripts only after valid consent where required, add publisher-issued ads.txt, measure layout shifts and ad density on mobile, and enforce accessibility and performance budgets. Never invent publisher IDs. Add placements between sections/sidebar only after usability checks.

Interface graphics and CSS are original. Game imagery is locally hosted with source attribution and is excluded from software licensing. See IMAGE_SOURCES.md for provenance and commercial-use limitations. No soundtrack or videos are bundled.

## Next content milestones

Complete remaining Agents and support/Stun builds; add exact effect values with revision history; add stage modifier snapshots by server and period; controlled rotation tests with investment stated; optimize disjoint team assignment; localized Russian terminology; editorial CMS/import validation; tested historical balance snapshots. Preserve unknown fields rather than fabricate data.

Before public hosting: configure real domain, generate prerendered pages, canonical URLs and sitemap, return real 404 responses, test direct routes on selected host, add operator/legal details and ad consent integration. The build now prerenders 210 public routes. Search-engine indexing is not guaranteed by deployment.

## Validation

check:data checks unique IDs, relation targets, six-piece plans, engine compatibility, team membership, ability conditions and stored roster input. Editorial checks also validate source IDs, distinct prose, semantic sections, dependencies, honest reference states and guide/build consistency. TypeScript check and production build are separate gates.

## Agent build articles and hosting

Five Agents have individual articles at /guides/:agentId: Miyabi, Zhu Yuan, Lycaon, Nicole and Caesar. The other 28 URLs are reference profiles, not generated guides. /guides supports name, specialty and coverage filters. There are 49 build contexts and 228 graph records. Reviewed equipment baselines feed both the article and existing context pages. See docs/EDITORIAL.md for publication and patch review.

Brand.tsx contains original SVG entity icons and the new archive monogram; public/favicon.svg is the tab icon. Game media uses local WebP images and thumbnails with native-dialog enlargement and source links.

The production build prerenders 210 public routes, 42 noindex routes (5 utilities, 28 reference profiles, 9 consolidated build contexts), and 404. Set VITE_SITE_URL to the final HTTPS origin before building. scripts/prerender.mjs creates canonical links, sitemap.xml, robots.txt and basic response headers. Deploy only the generated `dist` directory, never source files, local storage or environment files. Cloudflare Pages serves the generated 404.html for unknown paths.

Deployment workflow:

    npm run check:data
    npm run build

Cloudflare Pages builds `main` with `npm run build` and publishes `dist` at `https://zenless-archive.pages.dev/`. Set `VITE_SITE_URL` to this HTTPS origin in the Cloudflare project settings so canonical links and the sitemap point at the published host. New commits on `main` trigger deployment through Git integration.


Production checks: HTML routes, favicon, sitemap and robots return 200; unknown paths return 404. Query-based routes render from the shared URL instead of hydrating unfiltered static markup, avoiding mismatches when opening saved filters or squad links.

## Interface and responsive behavior
The homepage signal map uses stationary navigation cards and subtle animated connectors. Pause motion stops the signal; prefers-reduced-motion disables animation. Layouts cover small phones, tablets and desktop screens. Guide filters have a reset and result count, roster selection has search and an owned-only view, and build comparison uses two columns on desktop. The graph keeps its full linked list on mobile where the dense diagram is hidden.

## Individual editorial guides

The shared page template consumes separate files in src/content/guides. Facts and equipment dates are separate from rotation and mode tests; no in-game test is claimed. Use npm run check:editorial to inspect review status or -- --patch=3.3 --changed=nicole to find affected guides. See [editorial workflow](docs/EDITORIAL.md).

## Images and locations

99 attributed game images cover all 33 Agents, 19 W-Engines, 22 Drive Disc sets, 10 Bangboo, 6 enemies, 6 locations, 1 mode emblem and 2 additional gameplay screenshots. Browse `/explore/location`; locations participate in the same graph and search. Team and build pages reuse their actual Agents’ images. Each source is recorded in [IMAGE_SOURCES.md](IMAGE_SOURCES.md) and the linked JSON manifest.

`npm run check:media` verifies coverage, WebP dimensions, checksums and size budgets. `npm run media:sync` is a maintainer-only network import, never a build dependency. CI runs data/media checks and prerender validation on every push and pull request.

Development servers bind to localhost. Stop them after testing to release the port; do not leave a preview running after completing a task.
