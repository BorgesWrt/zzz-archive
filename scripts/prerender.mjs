import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { loadEnv } from 'vite';
import { render, publicRoutes, privateRoutes } from '../.prerender/entry-server.js';
const template=await readFile('dist/index.html','utf8');
const config=loadEnv('production',process.cwd(),'VITE_');
const origin=(process.env.VITE_SITE_URL??config.VITE_SITE_URL??'').replace(/\/$/,'');
if(origin&&!/^https:\/\/[a-z0-9.-]+$/i.test(origin))throw new Error('VITE_SITE_URL must be an HTTPS origin');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
for(const route of [...publicRoutes,...privateRoutes,'/404']){
 const head=[];
 const body=render(route).replace(/<title\b[^>]*>[\s\S]*?<\/title>|<meta\b[^>]*\/>/g,tag=>{head.push(tag);return ''});
 if(!head.some(h=>h.startsWith('<title')))head.push(`<title>${route==='/404'?'Page not found':'Squad tools'} · ZZZ Archive</title>`);
 if((privateRoutes.includes(route)||route==='/404')&&!head.some(h=>h.includes('name="robots"')))head.push('<meta name="robots" content="noindex,follow"/>');
 if(origin&&publicRoutes.includes(route))head.push(`<link rel="canonical" href="${esc(origin+(route==='/'?'/':route+'/'))}"/>`);
 const html=template.replace(/<title\b[^>]*>[\s\S]*?<\/title>|<meta name="description"[^>]*\/>/g,'').replace('</head>',`${head.join('\n')}</head>`).replace('<div id="root"></div>',`<div id="root" data-prerender="true">${body}</div>`);
 const output=route==='/404'?'dist/404.html':route==='/'?'dist/index.html':`dist${route}/index.html`;
 await mkdir(resolve(output,'..'),{recursive:true});await writeFile(output,html);
}
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\n${origin?`Sitemap: ${origin}/sitemap.xml\n`:''}`);
if(origin)await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publicRoutes.map(r=>`<url><loc>${esc(origin+(r==='/'?'/':r+'/'))}</loc></url>`).join('\n')}</urlset>`);
await writeFile('dist/_headers','/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: SAMEORIGIN\n');
console.log(`Prerendered ${publicRoutes.length} public and ${privateRoutes.length} utility routes + 404.`);
