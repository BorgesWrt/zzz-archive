import {authoredGuides,buildArticles,guideReadiness} from '../src/articles';
import {CURRENT_PATCH} from '../src/domain';
import {guideDependencies} from '../src/content/guide-schema';
const args=process.argv.slice(2);
const patch=args.find(a=>a.startsWith('--patch='))?.slice(8)??CURRENT_PATCH;
const changed=args.find(a=>a.startsWith('--changed='))?.slice(10).split(',').filter(Boolean)??[];
const links=args.includes('--links');
const report=authoredGuides.map(g=>({
 agent:g.agentId,readiness:guideReadiness(g,patch),reviewedCatalog:g.catalogPatch,targetPatch:patch,
 affectedBy:changed.filter(id=>guideDependencies(g).includes(id)),factsChecked:g.factsCheckedAt,equipmentChecked:g.equipmentCheckedAt,
 rotationTest:g.rotationTestedAt??'not performed',modeTests:g.modesTestedAt??'not performed',
}));
console.log(JSON.stringify({referenceProfiles:buildArticles.filter(g=>!g.content).length,guides:report.filter(r=>!changed.length||r.affectedBy.length)},null,2));
// HTTP availability is separate from editorial correctness and never advances review dates.
if(links){
 const urls=[...new Set(authoredGuides.flatMap(g=>g.sources.map(s=>s.url)))];
 const checks=await Promise.all(urls.map(async url=>{try{
  const response=await fetch(url,{redirect:'follow',signal:AbortSignal.timeout(15000)});
  const body=await response.text();
  return {url,status:response.status,result:response.ok&&body.length>100?'reachable':'manual check needed'};
 }catch{return {url,result:'manual check needed'}}}));
 console.log(JSON.stringify({sourceAvailability:checks},null,2));
 if(checks.some(c=>c.result!=='reachable'))process.exitCode=1;
}
