import type { Agent, Bangboo } from './domain';
export const attributeFamily=(value:string)=>value==='Frost'?'Ice':value;
export function abilityState(agent:Agent,squad:Agent[]) {
 if(!agent.activation)return {state:'Unknown',reason:'Activation rule is not yet verified.'};
 const rule=agent.activation;const matches=squad.filter(a=>a.id!==agent.id).filter(a=>(rule.sameAttribute&&attributeFamily(a.attribute)===attributeFamily(agent.attribute))||(rule.sameFaction&&a.factionId===agent.factionId)||(rule.specialties?.includes(a.specialty))||(rule.defensiveAssist&&a.assist==='Defensive'));
 return {state:matches.length?'Active':'Inactive',reason:matches.length?`Condition met by ${matches.map(a=>a.name).join(', ')}.`:'No other selected Agent meets the recorded condition.'};
}
export function bangbooState(boo:Bangboo,squad:Agent[]) {const r=boo.activation;const count=squad.filter(a=>r.attribute?attributeFamily(a.attribute)===r.attribute:a.factionId===r.factionId).length;return {active:count>=r.count,count,needed:r.count};}
export function readIds(raw:string|null,allowed:string[]) {try {const value=JSON.parse(raw??'[]');return Array.isArray(value)?[...new Set(value.filter((id):id is string=>typeof id==='string'&&allowed.includes(id)))]:[];}catch{return [];}}
