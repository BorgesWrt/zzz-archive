import {readFile,readdir} from 'node:fs/promises';
import {publicRoutes,privateRoutes,referenceRoutes,contextRoutes} from '../.prerender/entry-server.js';
const routeFile=route=>route==='/'?'dist/index.html':`dist${route}/index.html`;
for(const route of publicRoutes){
 const html=await readFile(routeFile(route),'utf8');
 if(!html.includes('<title>')||!html.includes('rel="canonical"')||!html.includes('data-prerender="true"'))throw new Error(`Metadata missing: ${route}`);
 if((html.match(/<title>/g)??[]).length!==1)throw new Error(`Duplicate title: ${route}`);
 if(html.includes('name="robots" content="noindex'))throw new Error(`Public route unexpectedly noindex: ${route}`);
 if(route.startsWith('/guides/')&&(!html.includes('Rotation and resource management')||!html.includes('Sources and review history')||!html.includes('Not performed')))throw new Error(`Missing guide evidence: ${route}`);
}
const sitemap=await readFile('dist/sitemap.xml','utf8');
if((sitemap.match(/<loc>/g)??[]).length!==publicRoutes.length)throw new Error('Sitemap route count');
for(const route of privateRoutes){const html=await readFile(routeFile(route),'utf8');if(!html.includes('name="robots" content="noindex'))throw new Error(`Missing noindex: ${route}`);if(sitemap.includes(`${route}/</loc>`))throw new Error(`Private route in sitemap: ${route}`);}
for(const route of referenceRoutes){const html=await readFile(routeFile(route),'utf8');if(!html.includes('Reference profile')||html.includes('Rotation and resource management'))throw new Error(`Reference misrepresented as article: ${route}`);}
for(const route of contextRoutes){const html=await readFile(routeFile(route),'utf8');if(!html.includes('Read equipment decisions and mode notes'))throw new Error(`Missing consolidated guide link: ${route}`);}
if(!(await readFile('dist/404.html','utf8')).includes('Signal lost'))throw new Error('404 body');
if((await readFile('dist/assets/'+(await readdir('dist/assets')).find(f=>f.endsWith('.js')),'utf8')).includes('⌁'))throw new Error('Decorative glyph persists');
console.log(`${publicRoutes.length} public pages, ${referenceRoutes.length} reference profiles and ${contextRoutes.length} consolidated build contexts checked; sitemap, evidence, noindex and 404 passed.`);
