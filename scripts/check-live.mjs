import {publicRoutes,referenceRoutes} from '../.prerender/entry-server.js';
const origin=process.env.SITE_ORIGIN;
if(!origin)throw new Error('Set SITE_ORIGIN to the public deployment origin before running the live check.');
const routes=['/','/guides/','/guides/claret/','/guides/nicole/','/records/build/yixuan-field-build/','/favicon.svg','/sitemap.xml','/robots.txt','/page-that-does-not-exist'];
const results=await Promise.all(routes.map(async route=>{const r=await fetch(origin+route);const text=await r.text();if(r.status!==(route.includes('does-not-exist')?404:200))throw new Error(`${route}: ${r.status}`);if(route.startsWith('/guides/')&&route!=='/guides/'&&!referenceRoutes.includes(route.replace(/\/$/,''))&&!text.includes('Rotation and resource management'))throw new Error(`Missing guide ${route}`);if(route==='/'&&!text.includes(origin))throw new Error('Canonical origin');if(route==='/sitemap.xml'&&(text.match(/<loc>/g)??[]).length!==publicRoutes.length)throw new Error('Sitemap count');return {route,status:r.status,type:r.headers.get('content-type')};}));
console.log(JSON.stringify(results,null,2));
