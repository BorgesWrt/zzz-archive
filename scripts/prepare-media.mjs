// Maintainer-only discovery: queries exact file names, never substitutes unrelated art.
import {build} from 'esbuild';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const temp=await fs.mkdtemp(path.join(os.tmpdir(),'zzz-media-'));
await build({entryPoints:['src/data.ts'],bundle:true,platform:'node',format:'esm',outfile:path.join(temp,'catalog.mjs')});
const {allRecords}=await import(pathToFileURL(path.join(temp,'catalog.mjs')));
const aliases={nekomata:'Nekomiya Mana',lucy:'Luciana de Montefio',remielle:'Remielle Dan',sigrid:"Sigrid de L'Azur"};
const rows=allRecords.filter(r=>['agent','engine','disc','bangboo','enemy'].includes(r.kind)).map(r=>({id:r.id,label:r.name,kind:r.kind,file:'File:'+({agent:'Agent ',engine:'W-Engine ',disc:'Drive Disc ',bangboo:'Bangboo ',enemy:'Enemy '}[r.kind])+(aliases[r.id]??r.name)+(r.kind==='agent'?' Portrait.png':r.kind==='enemy'?'.png':' Icon.png')}));
for(const [id,label,file] of [
 ['sixth-street','Sixth Street','Area Sixth Street.png'],
 ['lumina-square','Lumina Square','Area Lumina Square.png'],
 ['scott-outpost','Scott Outpost','Area Scott Outpost.png'],
 ['ballet-twins-road','Ballet Twins Road','Area Ballet Twins Road.png'],
 ['brant-street','Brant Street Construction Site','Area Brant Street Construction Site.png'],
 ['blazewood','Blazewood','Area Blazewood.png'],
 ['shiyu-defense','Shiyu Defense','Shiyu Defense.png'],
 ['ye-shiyuan-gameplay','Ye Shiyuan the Thrall — in-game view','Ye Shiyuan the Thrall In-game.png'],
 ['miasmic-fiend-gameplay','Miasmic Fiend — in-game view','Miasmic Fiend - Unfathomable In-Game.png'],
]) rows.push({id,label,kind:id.includes('gameplay')?'screenshot':id==='shiyu-defense'?'emblem':'location',file:'File:'+file});
const assets=[];const missing=[];
for(let i=0;i<rows.length;i+=20){
 const chunk=rows.slice(i,i+20);const url=new URL('https://zenless-zone-zero.fandom.com/api.php');
 url.search=new URLSearchParams({action:'query',titles:chunk.map(r=>r.file).join('|'),prop:'imageinfo',iiprop:'url|size|timestamp',format:'json'});
 const response=await fetch(url,{signal:AbortSignal.timeout(20000)});if(!response.ok)throw Error(`Wiki ${response.status}`);
 const data=await response.json();if(!data.query)throw Error(JSON.stringify(data));
 for(const row of chunk){const page=Object.values(data.query.pages).find(p=>p.title===row.file);const info=page?.imageinfo?.[0];
  if(!info){missing.push(row);continue;}
  assets.push({...row,url:info.url,source:info.descriptionurl,originalWidth:info.width,originalHeight:info.height,sourceRevision:info.timestamp,credit:'HoYoverse · Zenless Zone Zero Wiki',retrievedAt:new Date().toISOString().slice(0,10)});
 }
}
await fs.writeFile('scripts/media-sources.json',JSON.stringify(assets,null,2)+'\n');
console.log(JSON.stringify({resolved:assets.length,missing},null,2));
