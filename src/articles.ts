import {agents} from './catalog';
import {builds as modeBuilds,teams} from './service-data';
import {extraBuilds} from './extended-data';
import {CURRENT_PATCH} from './domain';
import type {Guide} from './domain';
import {authoredByAgent,authoredGuides} from './content/guides';
import {guideReadiness,guideDependencies} from './content/guide-schema';
import type {AuthoredGuide,GuideReadiness} from './content/guide-schema';
export {authoredGuides,authoredByAgent,guideReadiness};
export interface BuildArticle extends Guide {agentId:string;buildId:string;readingMinutes:number;readiness:GuideReadiness;content?:AuthoredGuide;}
// Assemble page records only. Missing authored content never generates guide prose.
export const buildArticles:BuildArticle[]=agents.map(agent=>{
 const content=authoredByAgent.get(agent.id);
 const build=modeBuilds.find(b=>b.agentId===agent.id)??extraBuilds.find(b=>b.agentId===agent.id)!;
 const readiness=guideReadiness(content,CURRENT_PATCH);
 const sections=content?.sections??[];
 const words=content?[...sections.map(s=>[s.text,...(s.steps??[])].join(' ')),...content.choices.map(c=>c.when)].join(' ').split(/\s+/).length:0;
 return {
  id:`${agent.id}-build-guide`,kind:'guide',agentId:agent.id,buildId:build.id,
  name:`${agent.name} ${content?'build guide':'reference profile'}`,
  summary:content?.summary??`${agent.name}: catalog profile and existing equipment records. An individual rotation, team and mode guide has not been reviewed yet.`,
  patch:content?.catalogPatch??agent.patch,status:content?'editorial':'editorial-draft',
  tags:[agent.attribute,agent.specialty,content?'Individual guide':'Reference profile'],
  related:[agent.id,build.id,...teams.filter(t=>t.agentIds.includes(agent.id)).map(t=>t.id),...(content?guideDependencies(content):[])].filter((id,i,list)=>list.indexOf(id)===i),
  sections,readingMinutes:content?Math.max(1,Math.ceil(words/200)):0,readiness,content,
 };
});
