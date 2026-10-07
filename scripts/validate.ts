import {buildArticles,authoredGuides,guideReadiness} from '../src/articles';
import {guideDependencies} from '../src/content/guide-schema';
import { allRecords, byId, builds, teams, agents, engines, bangboos } from '../src/data';
import { abilityState, bangbooState, readIds } from '../src/logic';
function assert(ok:unknown,message:string){if(!ok)throw new Error(message)}
assert(byId.size===allRecords.length,'Duplicate IDs');
for(const r of allRecords)for(const id of r.related)assert(byId.has(id),`${r.id}: dangling ${id}`);
for(const b of builds){assert(b.discPlan?.reduce((n,p)=>n+p.pieces,0)===6,`${b.id}: Disc plan`);for(const id of b.engineIds)assert(engines.find(e=>e.id===id)?.specialty===agents.find(a=>a.id===b.agentId)?.specialty,`${b.id}: wrong specialty`);for(const id of b.teamIds)assert(teams.find(t=>t.id===id)?.agentIds.includes(b.agentId),`${b.id}: wrong team`)}
const get=(id:string)=>agents.find(a=>a.id===id)!;
assert(abilityState(get('anby'),[get('anby')]).state==='Inactive','Self must not activate');
assert(abilityState(get('lucy'),['jane','seth','lucy'].map(get)).state==='Inactive','Lucy condition');
assert(abilityState(get('promeia'),[get('promeia')]).state==='Unknown','Unverified rule');
assert(bangbooState(bangboos.find(b=>b.id==='sharkboo')!,['miyabi','soukaku'].map(get)).active,'Frost counts as Ice');
assert(readIds('{bad',['ellen']).length===0,'Malformed storage');
assert(readIds('["ellen","ellen","unknown"]',['ellen']).length===1,'Validate stored IDs');
for(const a of agents){const page=buildArticles.find(g=>g.agentId===a.id);assert(page&&byId.has(page.buildId),a.id+': missing page');if(!page.content){assert(page.sections.length===0,a.id+': reference generated prose');assert(page.readiness==='reference'&&!page.verifiedAt,a.id+': reference claims a review');}}
const prose=new Map<string,string>();
for(const g of authoredGuides){
 assert(guideReadiness(g,'99.0')==='needs-review',g.agentId+': patch change must invalidate review');
 const ids=new Set(g.sources.map(s=>s.id));assert(ids.size===g.sources.length,g.agentId+': duplicate source IDs');
 const sectionIds=new Set(g.sections.map(s=>s.id));assert(sectionIds.size===g.sections.length,g.agentId+': duplicate sections');
 for(const required of ['direction','equipment','rotation','teams','shiyu-defense','deadly-assault','hollow-zero','mistakes'])assert(sectionIds.has(required as never),g.agentId+': missing '+required);
 for(const id of guideDependencies(g))assert(byId.has(id),g.agentId+': missing dependency '+id);
 for(const source of g.sources){assert(new URL(source.url).protocol==='https:',g.agentId+': non-HTTPS source');assert(/^\d{4}-\d{2}-\d{2}$/.test(source.checkedAt),g.agentId+': source date');assert(source.scope&&source.revisionNote,g.agentId+': source scope');}
 for(const s of g.sections){
  if(s.squadIds){assert(new Set(s.squadIds).size===3,g.agentId+': repeated squad Agent');const squad=s.squadIds.map(get);assert(squad.every(Boolean),g.agentId+': unknown squad Agent');assert(squad.some(a=>a.id===g.agentId),g.agentId+': Agent absent from example');for(const a of squad)assert(abilityState(a,squad).state==='Active',g.agentId+': example condition inactive for '+a.id);}
  assert(s.editorial||s.sourceIds.length,g.agentId+': factual section without evidence '+s.id);
  for(const id of s.sourceIds)assert(ids.has(id),g.agentId+': missing source '+id);
  for(const id of s.relatedIds??[])assert(byId.has(id),g.agentId+': missing section link '+id);
  const normalized=s.text.toLowerCase().replace(/[^a-z0-9]/g,'');
  assert(!prose.has(normalized),g.agentId+': repeated prose from '+prose.get(normalized));prose.set(normalized,g.agentId);
 }
 assert(g.sections.find(s=>s.id==='rotation')?.steps?.length,g.agentId+': no actionable rotation');
 for(const c of g.choices){assert(byId.has(c.recordId),g.agentId+': missing choice '+c.recordId);assert(c.when&&c.sourceIds.length,g.agentId+': unexplained choice');for(const id of c.sourceIds)assert(ids.has(id),g.agentId+': unknown choice source');}
 assert(g.baseline.discPlan.reduce((n,d)=>n+d.pieces,0)===6,g.agentId+': authored disc plan');
 assert(g.rotationTestedAt===null&&g.modesTestedAt===null,g.agentId+': no test evidence has been supplied for this release');
 for(const b of builds.filter(b=>b.agentId===g.agentId)){assert(JSON.stringify(b.discPlan)===JSON.stringify(g.baseline.discPlan),b.id+': baseline drift');assert(JSON.stringify(b.mainStats)===JSON.stringify(g.baseline.mainStats),b.id+': stats drift');}
}
assert(guideReadiness(undefined,'3.2')==='reference','Missing prose must remain reference-only');
console.log(JSON.stringify({records:allRecords.length,agents:agents.length,teams:teams.length,builds:builds.length,checks:'passed'}));

