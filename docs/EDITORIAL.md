# Individual guide workflow

Each authored guide lives in `src/content/guides/<agent>.ts`. `src/articles.ts` only assembles page records; it must never generate explanatory paragraphs. The same React template renders all authored guides. Agents without authored content retain their URLs as reference profiles with noindex, excluded from the sitemap.

## Publish an individual guide

1. Select a concrete role, squad context and investment level. State Mindscape/Potential assumptions.
2. Read the current skill reference and equipment sources. Record each source URL, access date, scope and its actual revision boundary. If sources disagree, explain the trigger or squad assumptions; do not invent a universal winner.
3. Write individual decisions: when to equip each option, how to spend resources, who receives an assist, what causes the rotation to fail. Reference shared mechanic records instead of repeating introductory prose.
4. Fill the semantic sections in `guide-schema.ts`. Section IDs control rendering and anchors; array positions do not. Each factual section and equipment choice needs source IDs. Original mode practice is explicitly marked editorial.
5. Fill one baseline equipment plan. It also feeds existing build context pages and Compare, preventing a guide from disagreeing with its own record. Mode notes live in the guide; creating extra mode URLs is not required.
6. Add sources, dependencies, open questions and a meaningful changelog entry. Register the file in `guides/index.ts`.
7. Run `npm run check:data`, `npm run check`, `npm run build`, and `node scripts/check-site.mjs`. Check the actual guide and reference fallback on phone and desktop.

## Review dates and status

- `catalogPatch`: scope considered during this editorial pass; a literal value per guide.
- `factsCheckedAt`: date the cited kit/condition facts were checked.
- `equipmentCheckedAt`: date the equipment candidates and conditions were checked.
- `rotationTestedAt` / `modesTestedAt`: null unless an actual game test has supporting evidence. Reading a website does not set these fields. This release's validator explicitly asserts that no game tests have been supplied; update that gate alongside real test evidence before claiming a test.
- `updatedAt`, `revision`, `changelog`: editorial changes, independently of game patch dates.

`CURRENT_PATCH` never advances these values. A mismatch produces “Patch review needed.” “Individual guide” describes authored coverage, not a measured meta ranking. Reference profiles carry neither generated prose nor a fake review date.

## Patch impact review

    npm run check:editorial
    npm run check:editorial -- --patch=3.3
    npm run check:editorial -- --changed=nicole,moonlight-lullaby
    npm run check:editorial -- --patch=3.3 --changed=nicole

The last example flags Nicole and Zhu Yuan because they depend on Nicole. The script is read-only: it does not update sources, dates or recommendations. Supply changed entity IDs from a reviewed patch notice; the script does not infer balance changes from news automatically. Include new equipment, mode and teammate dependencies when a guide mentions them materially.

    npm run check:editorial -- --links

This optional HTTP check reports availability only. Some source sites return 403 to automated requests: “manual check needed” must not be interpreted as a dead link or corrected by bypassing access controls. Read through an available normal browser/search source. Availability is not factual validation. On 2026-10-05 the cited pages were read through the web research tool; direct HTTP requests returned 403.

## Indexing policy

- Individual guides stay indexable with their own canonical URL.
- 28 unfinished guide URLs remain reference profiles, noindex/follow and excluded from sitemap.
- Nine existing context URLs belonging to the five authored Agents remain accessible, noindex/follow, and link prominently to the consolidated guide.
- The remaining legacy catalog and build records have not been individually re-reviewed in this pass.

## Publication

Review the content, build with the configured production origin, upload only `dist` to the existing Pages project, and verify the live guide, profile fallback and sitemap. Do not label a source check as a current-stage performance test.
