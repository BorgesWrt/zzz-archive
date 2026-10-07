import { buildArticles } from './articles';
import {authoredByAgent} from './content/guides';
import {editorialEngines,editorialDiscs} from './content/equipment';
import { extraDiscs, extraEngines, extraBuilds } from './extended-data';
export * from './domain';
export {agents, factions, bangboos, contextRecords} from './catalog';
export const engines=[...baseEngines,...extraEngines,...editorialEngines];
export const discs=[...baseDiscs,...extraDiscs,...editorialDiscs];
export {teams, guides} from './service-data';
// Existing context URLs consume the same baseline as each individual guide.
export const builds=[...modeBuilds,...extraBuilds].map(build=>{
 const guide=authoredByAgent.get(build.agentId);
 if(!guide)return build;
 const mode=guide.sections.find(s=>s.id===build.modeId);
 const rotation=guide.sections.find(s=>s.id==='rotation')!;
 return {...build,...guide.baseline,discIds:guide.baseline.discPlan.map(d=>d.id),
  related:[...new Set([build.agentId,build.modeId,...guide.baseline.engineIds,...guide.baseline.discPlan.map(d=>d.id)])],
  patch:guide.catalogPatch,verifiedAt:guide.equipmentCheckedAt,sourceReviewedIn:undefined,
  source:guide.sources.find(s=>s.id==='pr')!.url,
  rotation:[rotation.text,...(rotation.steps??[])].join(' '),modeNotes:mode?[mode.text]:[],
  caveat:'Shares the individual guide’s equipment baseline. Source-checked editorial advice; current-stage performance has not been tested.',
 };
});
import { agents, factions, engines as baseEngines, discs as baseDiscs, bangboos, contextRecords } from './catalog';
import { teams, builds as modeBuilds, guides } from './service-data';
import type { Kind, RecordNode } from './domain';
export const records:RecordNode[]=[...agents,...factions,...engines,...discs,...bangboos,...contextRecords,...teams,...guides,...buildArticles];
export const allRecords:RecordNode[]=[...records,...builds];
export const byId=new Map(allRecords.map(r=>[r.id,r]));
export const kinds:{id:Kind;label:string;description:string}[]=Object.entries({agent:'Agents',engine:'W-Engines',disc:'Drive Discs',bangboo:'Bangboo',team:'Teams',faction:'Factions',enemy:'Enemies',mode:'Modes',stage:'Stages',patch:'Patches',event:'Events',build:'Build variants',guide:'Guides'}).map(([id,label])=>({id:id as Kind,label,description:`Browse linked ${label.toLowerCase()}`}));
export const kindLabel=(kind:Kind)=>kinds.find(k=>k.id===kind)?.label??kind;
export const recordPath=(r:RecordNode)=>r.id.endsWith("-build-guide")?`/guides/${r.id.replace("-build-guide","")}`:`/records/${r.kind}/${r.id}`;
export const edges=allRecords.flatMap(r=>[...new Set(r.related)].map(target=>({source:r.id,target,relation:r.kind==='build'?'build context':r.kind==='team'?'squad context':r.kind==='faction'?'member':'references'})));


