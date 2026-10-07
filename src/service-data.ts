import { CURRENT_PATCH, VERIFIED_AT, profileSource } from './domain';
import type { Team, BuildVariant, Guide } from './domain';
import { agents } from './catalog';
const rows: [string,string,string,string,string,string][] = [
 ['ellen-core','ellen','lycaon','soukaku','sharkboo','Ice stun window'],
 ['zhu-premium','zhu-yuan','qingyi','nicole','resonaboo','Ether burst'],
 ['zhu-accessible','zhu-yuan','anby','nicole','resonaboo','Ether burst'],
 ['jane-shield','jane','seth','lucy','electroboo','Assault with protection'],
 ['jane-disorder','jane','burnice','lucy','rocketboo','Assault and Burn Disorder'],
 ['miyabi-disorder','miyabi','yanagi','soukaku','sharkboo','Frost and Shock Disorder'],
 ['miyabi-ice','miyabi','lycaon','soukaku','sharkboo','Frost stun window'],
 ['piper-disorder','piper','burnice','lucy','rocketboo','Physical and Fire Disorder'],
 ['soldier-fire','soldier-11','koleda','lucy','rocketboo','Fire stun window'],
 ['harumasa-electric','harumasa','qingyi','rina','plugboo','Electric burst'],
 ['anton-electric','anton','grace','rina','plugboo','Shock follow-up'],
 ['corin-victoria','corin','lycaon','rina','butler','Physical stun window'],
 ['billy-hares','billy','anby','nicole','amillion','Accessible burst'],
 ['nekomata-assault','nekomata','piper','lucy','amillion','Assault follow-up'],
 ['yixuan-core','yixuan','lighter','lucy','rocketboo','Rupture support'],
];
export const teams:Team[]=rows.map(([id,a,b,c,boo,archetype])=>({id,kind:'team',name:`${agents.find(x=>x.id===a)!.name} / ${agents.find(x=>x.id===b)!.name} / ${agents.find(x=>x.id===c)!.name}`,summary:archetype,patch:CURRENT_PATCH,status:'editorial',tags:[archetype],related:[a,b,c,boo,'shiyu-defense','deadly-assault'],agentIds:[a,b,c],bangbooIds:[boo],modeIds:['shiyu-defense','deadly-assault','hollow-zero'],archetype,sequence:['Establish support buffs and debuffs.','Use the stun or anomaly enabler without unnecessarily extending field time.','Spend the carry’s resources while buffs and the target window overlap.'],tradeoffs:[id==='jane-shield'?'Lucy’s additional ability is inactive here; her core team ATK buff remains usable.':'Check every additional ability in the planner before investing.', 'This is an editorial composition, not a measured ranking. Match the stage resistance and modifiers.'],source:profileSource(a),verifiedAt:VERIFIED_AT}));
type Profile=[string,string,string,string,string,string,string,string,string[]];
const profiles:Profile[]=[
 ['ellen','deep-sea-visitor','starlight-engine','puffer-electro','woodpecker-electro','CRIT DMG / CRIT Rate','PEN / Ice DMG','ATK',['CRIT DMG','CRIT Rate','ATK']],
 ['zhu-yuan','riot-suppressor','starlight-engine','chaotic-metal','woodpecker-electro','CRIT Rate / CRIT DMG','ATK / Ether DMG','ATK',['CRIT Rate','CRIT DMG','ATK']],
 ['jane','sharpened-stinger','weeping-gemini','fanged-metal','puffer-electro','Anomaly Proficiency','PEN / Physical DMG / ATK','Anomaly Mastery',['Anomaly Proficiency','ATK']],
 ['miyabi','hailstorm-shrine','rainforest-gourmet','branch-blade','polar-metal','CRIT Rate / ATK','Ice DMG / ATK','ATK',['CRIT Rate toward kit threshold','CRIT DMG','ATK']],
 ['piper','weeping-gemini','rainforest-gourmet','fanged-metal','freedom-blues','Anomaly Proficiency','Physical DMG / ATK / PEN','Anomaly Mastery',['Anomaly Proficiency','ATK']],
 ['harumasa','starlight-engine','starlight-engine','thunder-metal','branch-blade','ATK / CRIT DMG / CRIT Rate','ATK / Electric DMG','ATK',['CRIT Rate toward kit threshold','ATK','CRIT DMG']],
 ['soldier-11','starlight-engine','starlight-engine','puffer-electro','woodpecker-electro','CRIT Rate / ATK / CRIT DMG','PEN / ATK / Fire DMG','ATK',['CRIT Rate','CRIT DMG','ATK']],
 ['billy','starlight-engine','starlight-engine','woodpecker-electro','branch-blade','CRIT Rate / CRIT DMG','PEN / ATK / Physical DMG','ATK',['CRIT Rate','CRIT DMG','ATK']],
];
const modes=[['shiyu-defense','Clear both sides','Group waves, minimize travel and preserve resources for the next spawn.'],['deadly-assault','Sustained score','Use repeatable buff cycles; a single stun burst is not the whole scoring plan.'],['hollow-zero','Exploration consistency','Adapt to acquired programs. Temporary mode buffs can change equipment priorities.']];
export const builds:BuildVariant[]=profiles.flatMap(([agentId,e1,e2,d1,d2,s4,s5,s6,substats])=>modes.map(([modeId,goal,note])=>({id:`${agentId}-${modeId}`,kind:'build' as const,name:`${agents.find(a=>a.id===agentId)!.name} · ${modeId.replaceAll('-',' ')}`,summary:`${goal}. Concrete equipment candidates with a mode-specific execution plan.`,patch:CURRENT_PATCH,status:'editorial' as const,tags:[goal,agents.find(a=>a.id===agentId)!.attribute],related:[agentId,modeId,e1,e2,d1,d2],agentId,modeId,goal,engineIds:[...new Set([e1,e2])],discIds:[d1,d2],discPlan:[{id:d1,pieces:4 as const},{id:d2,pieces:2 as const}],teamIds:teams.filter(t=>t.agentIds.includes(agentId)).map(t=>t.id),priorities:['Level the carry and matching W-Engine before chasing perfect substats.','Secure the main stats and full set activation.','Upgrade the skills used by the actual rotation.'],rotation:agents.find(a=>a.id===agentId)!.playstyle,mainStats:{slot4:s4,slot5:s5,slot6:s6},substats,modeNotes:[note],investment:'Baseline: no duplicate Agent upgrades or limited-engine refinements assumed.',caveat:'Equipment candidates summarize community guidance; mode tactics are original editorial advice. Alternatives require team-specific comparison. No DPS ranking or current-patch performance test is claimed.',source:profileSource(agentId),sourceReviewedIn:agentId==='miyabi'?'2.1':agentId==='piper'?'2.4':agentId==='ellen'||agentId==='zhu-yuan'?'2.5':undefined,verifiedAt:VERIFIED_AT})));
const guideRows=[
 ['guide-investment','Spend resources where they change the rotation','Progression','First finish a usable three-Agent squad. Carry levels, weapon levels and relevant core skills usually matter before perfect Disc substats. Support investment should target the buff or utility actually used.'],
 ['guide-discs','Read a six-slot Disc plan','Equipment','A 4+2 plan activates one four-piece set and one two-piece set. Slots 4–6 carry selectable main stats. Choose the correct main stats before replacing a usable piece for a marginal substat upgrade.'],
 ['guide-squads','Allocate two or three independent squads','Endgame','Shiyu Defense needs two sides; Deadly Assault needs three teams. Avoid assigning the same Agent twice. Start from available carries and distribute limited supports before committing farming resources.'],
 ['guide-activation','Additional abilities and actual synergy','Teams','An activation check evaluates a written kit condition. Passing it does not guarantee a strong team. A useful core buff can remain available when the additional ability is inactive. Check field-time competition and buff duration separately.'],
 ['guide-rotation','Build a repeatable damage window','Combat','Apply buffs close enough to the damage window to keep them active. Distinguish setup, stun, carry damage and recovery. Record actual timings when testing instead of estimating a damage score from equipment names.'],
 ['guide-patches','Read patch context without inventing history','Sources','Introduction patch, current catalog snapshot and source review patch are different fields. An older equipment guide may still help, but changed kits and stage buffs require a new review. This catalog does not reconstruct historical balance values.'],
 ['guide-frost','Frost, Ice and anomaly meters','Attributes','Miyabi’s Frost counts as Ice for attribute-based squad requirements. Its anomaly buildup is independent, allowing distinct anomaly interactions. The planner groups Frost with Ice for matching, without merging their anomaly damage mechanics.'],
];
export const guides:Guide[]=guideRows.map(([id,name,tag,text])=>({id,kind:'guide',name,summary:text,patch:CURRENT_PATCH,status:'editorial',tags:[tag],related:[],sections:[{title:tag,text}],details:[text]}));
