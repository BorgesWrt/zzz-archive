import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';
import {build} from 'esbuild';
const media=JSON.parse(await fs.readFile('src/media-assets.json','utf8'));
const sources=JSON.parse(await fs.readFile('scripts/media-sources.json','utf8'));
assert.deepEqual(JSON.parse(await fs.readFile('public/media/sources.json','utf8')),sources,'Published attribution drift');
await build({entryPoints:['src/data.ts'],bundle:true,platform:'node',format:'esm',outfile:'.media-check/catalog.mjs'});
const {allRecords}=await import('../.media-check/catalog.mjs');
const ids=new Set(allRecords.map(r=>r.id));let bytes=0;
assert.equal(sources.length,Object.keys(media).length);
for(const [id,a] of Object.entries(media)){
 assert(ids.has(id)||id.endsWith('-gameplay'),`Unmapped media ${id}`);
 assert(a.alt.length>15&&a.credit&&a.source.startsWith('https://'),`Missing attribution: ${id}`);
 const original=await fs.readFile('public'+a.src);const meta=await sharp(original).metadata();
 assert.equal(crypto.createHash('sha256').update(original).digest('hex'),a.sha256,`Checksum ${id}`);
 assert.equal(meta.width,a.width);assert.equal(meta.height,a.height);assert.equal(meta.format,'webp');
 const thumb=await sharp('public'+a.thumb).metadata();assert(thumb.width<=480&&thumb.height<=480,`Oversized thumbnail ${id}`);
 assert(original.length<650000,`Image budget exceeded ${id}`);bytes+=original.length;
}
for(const r of allRecords.filter(r=>['agent','engine','disc','bangboo','enemy','location'].includes(r.kind)))assert(media[r.id],`Missing image for ${r.id}`);
console.log(JSON.stringify({images:Object.keys(media).length,fullSizeMB:(bytes/1e6).toFixed(2),checks:'passed'}));
