# Game imagery

The image collection contains character portraits, W-Engine and Drive Disc icons, Bangboo, enemies, location views and selected gameplay screenshots. The original game visuals belong to HoYoverse. Zenless Zone Zero Wiki / Fandom is identified as the community host, not the owner of the underlying artwork. These are publicly accessible copyrighted images, not openly licensed photographs. No permission or endorsement is claimed; attribution does not itself grant commercial reuse rights.

Every image has an exact file-description URL, original asset URL, original dimensions, source revision and retrieval date in `scripts/media-sources.json`. The same manifest is published at `/media/sources.json`. Images and 480px thumbnails are served locally as WebP. Resizing preserves aspect ratio; enlarged views show the complete image. Only landscape card previews use a cover crop. Original downloaded files are not committed.

`src/media-assets.json` contains presentation metadata and output SHA-256 hashes. `src/Media.tsx` maps builds to their Agent, squads to their members and context pages to labelled reference images. A Scott Outpost view on a mode page identifies the setting; it is not labelled as that mode’s gameplay screenshot. Images do not establish build performance or prove that a guide was play-tested.

## Maintenance

1. Review a source file page and its actual subject before changing the manifest. Never substitute a similarly named Agent or boss.
2. Run `npm run media:sync` explicitly to retrieve the reviewed URLs and generate both sizes. This operation requires network access; normal builds and CI do not.
3. Run `npm run check:media` to check dimensions, budgets, hashes, coverage and attribution consistency.
4. Check the visual result, keyboard enlargement, Escape dismissal and narrow screens.

`scripts/prepare-media.mjs` is a discovery helper for maintainers. It queries exact wiki filenames and reports missing files rather than inventing image URLs. Its output must be reviewed before syncing. Re-running it can update source revisions; do not run it as part of ordinary builds.

Game imagery is excluded from any software license. Advertising integrations remain disabled. A future commercial launch needs an appropriate rights review for the actual intended use.
