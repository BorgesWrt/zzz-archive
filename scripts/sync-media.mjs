// Explicit maintainer command. Builds only the reviewed URLs in media-sources.json.
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';
const sources=JSON.parse(await fs.readFile('scripts/media-sources.json','utf8'));
await fs.mkdir('public/media',{recursive:true});
const manifest={};
for(const row of sources){
 const response=await fetch(row.url,{signal:AbortSignal.timeout(25000)});
 if(!response.ok)throw Error(`${row.id}: HTTP ${response.status}`);
 const input=Buffer.from(await response.arrayBuffer());
 const large=await sharp(input).rotate().resize({width:1280,height:1280,fit:'inside',withoutEnlargement:true}).webp({quality:84}).toBuffer({resolveWithObject:true});
 const small=await sharp(input).rotate().resize({width:480,height:480,fit:'inside',withoutEnlargement:true}).webp({quality:78}).toBuffer({resolveWithObject:true});
 for(const [suffix,output] of [['',large],['-thumb',small]])await fs.writeFile(`public/media/${row.id}${suffix}.webp`,output.data);
 manifest[row.id]={label:row.label,kind:row.kind,src:`/media/${row.id}.webp`,thumb:`/media/${row.id}-thumb.webp`,width:large.info.width,height:large.info.height,alt:`${row.label} — ${row.kind==='agent'?'character artwork':row.kind==='location'||row.kind==='screenshot'||row.kind==='mode'?'game screenshot':'in-game artwork'}`,source:row.source,credit:row.credit,sha256:crypto.createHash('sha256').update(large.data).digest('hex')};
 console.log(row.id,large.data.length);
}
await fs.writeFile('src/media-assets.json',JSON.stringify(manifest,null,2)+'\n');
await fs.copyFile('scripts/media-sources.json','public/media/sources.json');
console.log(`Prepared ${sources.length} images and thumbnails.`);
