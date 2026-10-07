import { CURRENT_PATCH, VERIFIED_AT, profileSource, sourceUrls } from './domain';
import type { Agent, ActivationRule, Bangboo, Disc, Engine, RecordNode } from './domain';
const base=(id:string,kind:RecordNode['kind'],name:string,summary:string,source:string,tags:string[]=[],introducedIn?:string):RecordNode=>({id,kind,name,summary,source,tags,patch:CURRENT_PATCH,related:[],status:'verified',verifiedAt:VERIFIED_AT,introducedIn});
const match:ActivationRule={sameAttribute:true,sameFaction:true};
type AgentRow=[string,string,string,string,string,'A'|'S',Agent['fieldRole'],ActivationRule|undefined,Agent['assist'],string,string,string?];
const agentRows:AgentRow[]=[
  ['anby','Anby Demara','Electric','Stun','cunning-hares','A','Stun',match,'Defensive','Use the third Basic hit and its follow-up to build Daze.','Do not confuse this Agent with Soldier 0 - Anby.','1.0'],
  ['nicole','Nicole Demara','Ether','Support','cunning-hares','A','Support',match,'Evasive','Group targets and refresh her short debuff before the carry attacks.','A debuff applied too early may expire before the damage window.','1.0'],
  ['billy','Billy Kid','Physical','Attack','cunning-hares','A','Carry',match,'Evasive','Maintain safe ranged uptime and use Chain opportunities.','Avoid spending the entire fight repositioning.','1.0'],
  ['nekomata','Nekomata','Physical','Attack','cunning-hares','S','Carry',{...match,specialties:['Support']},'Defensive','A mobile Physical carry; exploit assist and dodge opportunities.','Account for current Potential changes before copying older rotations.','1.0'],
  ['ellen','Ellen Joe','Ice','Attack','victoria-housekeeping','S','Carry',{...match,specialties:['Stun']},'Defensive','Manage Flash Freeze charges and keep her enhanced attacks flowing.','Current Potential mechanics differ from release-era guides.','1.0'],
  ['lycaon','Von Lycaon','Ice','Stun','victoria-housekeeping','S','Stun',{...match,specialties:['Anomaly']},'Defensive','Use assist follow-ups to establish control and Daze.','His current kit includes Potential changes; check the source revision.','1.0'],
  ['rina','Alexandrina Sebastiane','Electric','Support','victoria-housekeeping','S','Support',match,'Evasive','Refresh squad support without consuming the carry’s whole field window.','PEN-based choices depend on the full squad and enemy.','1.0'],
  ['corin','Corin Wickes','Physical','Attack','victoria-housekeeping','A','Carry',match,'Defensive','Set up a stun window before committing to long attacks.','Long animations need a safe opening.','1.0'],
  ['koleda','Koleda Belobog','Fire','Stun','belobog','S','Stun',{...match,specialties:['Rupture','Armorer']},'Defensive','Prepare enhanced attacks and hand a stun window to the carry.','Her activation condition was broadened; old team checks can be stale.','1.0'],
  ['ben','Ben Bigger','Fire','Defense','belobog','A','Defense',match,'Defensive','Use timed blocks and squad shielding to keep attacks stable.','Defense utility is not a substitute for a clear damage plan.','1.0'],
  ['anton','Anton Ivanov','Electric','Attack','belobog','A','Carry',match,'Defensive','Keep Burst Mode resources available for the damage window.','Electric teammates can help establish Shock context.','1.0'],
  ['grace','Grace Howard','Electric','Anomaly','belobog','S','Carry',match,'Evasive','Build Zap and use it to accelerate Electric Anomaly.','Coordinate field time when pairing two active Anomaly Agents.','1.0'],
  ['soukaku','Soukaku','Ice','Support','section-6','A','Support',match,'Defensive','Pass her support buff to the intended carry through an assist.','Squad order affects which Agent receives the hand-off.','1.0'],
  ['miyabi','Hoshimi Miyabi','Frost','Anomaly','section-6','S','Carry',{sameFaction:true,specialties:['Support']},'Defensive','Build Fallen Frost and spend it deliberately.','Frost counts as Ice for squad attribute conditions; its anomaly meter is independent.','1.4'],
  ['yanagi','Tsukishiro Yanagi','Electric','Anomaly','section-6','S','Carry',{sameAttribute:true,specialties:['Anomaly']},'Defensive','Manage stance changes and Anomaly timing.','Double Anomaly needs planned field-time sharing.','1.3'],
  ['harumasa','Asaba Harumasa','Electric','Attack','section-6','S','Carry',{specialties:['Stun','Anomaly']},'Defensive','Use a Stun or Anomaly partner to establish his damage context.','Prepare resources before entering the burst window.','1.4'],
  ['zhu-yuan','Zhu Yuan','Ether','Attack','neps','S','Carry',{sameFaction:true,specialties:['Support']},'Evasive','Store enhanced shots for a prepared burst window.','Allow for in-combat CRIT buffs before choosing slot IV.','1.0'],
  ['qingyi','Qingyi','Electric','Stun','neps','S','Stun',{sameFaction:true,specialties:['Attack']},'Defensive','Prepare her stun multiplier before handing off to an Attack carry.','A full condition match does not remove field-time competition.','1.1'],
  ['jane','Jane Doe','Physical','Anomaly','neps','S','Carry',{sameFaction:true,specialties:['Anomaly']},'Defensive','Maintain Passion and apply repeated Physical Anomaly.','Her Assault mechanics do not imply generic CRIT equipment priorities.','1.1'],
  ['seth','Seth Lowell','Electric','Defense','neps','A','Defense',match,'Defensive','Shield and assist into the Agent placed before him.','Slot order matters: place the intended recipient immediately before Seth.','1.1'],
  ['lucy','Lucy','Fire','Support','sons-of-calydon','A','Support',{...match,specialties:['Rupture']},'Defensive','Refresh Cheer On and return field time to the carry.','Her core support can be useful even when the additional condition is inactive.','1.0'],
  ['piper','Piper Wheel','Physical','Anomaly','sons-of-calydon','A','Carry',match,'Defensive','Use sustained EX pressure to build Physical Anomaly.','Do not commit to a long spin without checking incoming attacks.','1.0'],
  ['caesar','Caesar King','Physical','Defense','sons-of-calydon','S','Defense',{sameFaction:true,defensiveAssist:true},'Defensive','Use blocks and shielding to make the carry’s field time safer.','Check the partner’s actual assist type; not every Agent uses Defensive Assist.','1.2'],
  ['burnice','Burnice White','Fire','Anomaly','sons-of-calydon','S','Off-field',{sameFaction:true,specialties:['Anomaly']},'Defensive','Keep her off-field Fire application ready while another carry attacks.','Schedule refreshes before Heat runs out.','1.2'],
  ['lighter','Lighter','Fire','Stun','sons-of-calydon','S','Stun',{sameFaction:true,specialties:['Attack']},'Defensive','Build Morale and create useful Fire or Ice damage windows.','His buffs are not equally valuable to every attribute.','1.3'],
  ['soldier-11','Soldier 11','Fire','Attack','obol-squad','S','Carry',match,'Defensive','Align Fire attacks with a prepared stun and support window.','Review Potential changes before using launch-era strings.','1.0'],
  ['astra-yao','Astra Yao','Ether','Support','stars-of-lyra','S','Support',{specialties:['Attack','Anomaly','Rupture']},'Evasive','Use her assist-driven support to cycle teammates efficiently.','Support uptime still depends on Energy and squad order.','1.5'],
  ['yixuan','Yixuan','Auric Ink','Rupture','yunkui-summit','S','Carry',{specialties:['Stun','Support','Defense']},'Defensive','Manage Adrenaline and Technique resources for Sheer damage.','Do not apply a generic ATK damage model to Rupture.','2.0'],
  ['claret','Claret Flint','Electric','Armorer','flint-workshop','S','Carry',{sameAttribute:true,specialties:['Stun','Armorer']},'Defensive','New Armorer Agent in the 3.2 snapshot.','Sharp damage scales with DEF; CRIT conversion differs from ordinary Attack builds.','3.2'],
  ['roxy','Roxy Ifrita Pryce','Wind','Stun','flint-workshop','S','Stun',{specialties:['Attack','Rupture','Armorer']},'Unknown','New Wind Stun Agent featured in 3.2 Phase II.','Choose a support set that matches the carry: CRIT DMG bonuses do not replace Laceration.','3.2'],
  ['promeia','Promeia','Ice','Anomaly','krampus','S','Carry',undefined,'Unknown','Ice Anomaly Agent featured in 3.2 Phase II.','Only the public channel profile is verified here.'],
  ['remielle','Remielle','Lumiflux','Anomaly','covenant-dayat','S','Carry',{sameFaction:true,specialties:['Anomaly']},'Unknown','Lumiflux Anomaly Agent introduced in 3.1.','Read the build guide for resources, equipment and mode adjustments.','3.1'],
  ['sigrid','Sigrid','Ice','Attack','airspace-patrol','S','Carry',{specialties:['Support','Stun']},'Unknown','Ice Attack Agent introduced in 3.1.','Read the build guide for resources, equipment and mode adjustments.','3.1'],
];
export const agents:Agent[]=agentRows.map(([id,name,attribute,specialty,factionId,rank,fieldRole,activation,assist,playstyle,caution,introducedIn])=>({
  ...base(id,'agent',name,`${attribute} / ${specialty}. ${playstyle}`,['claret','roxy'].includes(id)?sourceUrls.patch32:id==='promeia'?sourceUrls.channels:['remielle','sigrid'].includes(id)?sourceUrls.patch31:profileSource(id),[attribute,specialty,rank+'-Rank'],introducedIn),
  kind:'agent',attribute,specialty,factionId,rank,fieldRole,activation,assist,playstyle,caution,
  related:[factionId],details:[playstyle,caution],
}));
const factionNames:Record<string,string>={
  'cunning-hares':'Cunning Hares','victoria-housekeeping':'Victoria Housekeeping Co.',belobog:'Belobog Heavy Industries','section-6':'Section 6',neps:'Criminal Investigation Special Response Team','sons-of-calydon':'Sons of Calydon','obol-squad':'Obol Squad','stars-of-lyra':'Stars of Lyra','yunkui-summit':'Yunkui Summit','flint-workshop':'Flint Workshop',krampus:'Krampus Compliance Authority','covenant-dayat':'Covenant of Dayat','airspace-patrol':'Airspace Patrol Department',
};
export const factions:RecordNode[]=Object.entries(factionNames).map(([id,name])=>({...base(id,'faction',name,'Members, team conditions and connected records.',sourceUrls.factions,['Organization']),related:agents.filter(a=>a.factionId===id).map(a=>a.id),details:['Faction matching is evaluated separately from attribute and specialty matching.']}));
type EngineRow=[string,string,string,'S'|'A'|'B',Engine['access'],string,string?];
const engineRows:EngineRow[]=[
  ['deep-sea-visitor','Deep Sea Visitor','Attack','S','Limited','Ice Attack option associated with Ellen.',profileSource('ellen')],
  ['riot-suppressor','Riot Suppressor Mark VI','Attack','S','Limited','Ether Basic Attack option associated with Zhu Yuan.',profileSource('zhu-yuan')],
  ['sharpened-stinger','Sharpened Stinger','Anomaly','S','Limited','Physical Anomaly option associated with Jane.',profileSource('jane')],
  ['hailstorm-shrine','Hailstorm Shrine','Anomaly','S','Limited','CRIT-oriented Anomaly option associated with Miyabi.',profileSource('miyabi')],
  ['starlight-engine','Starlight Engine','Attack','A','Gadget Store','Attack option triggered through assists or counters.'],
  ['weeping-gemini','Weeping Gemini','Anomaly','A','Gadget Store','Anomaly option for non-limited equipment plans.'],
  ['rainforest-gourmet','Rainforest Gourmet','Anomaly','A','Gadget Store','Energy-spending Anomaly option.'],
  ['steam-oven','Steam Oven','Stun','A','Gadget Store','Energy-based Stun equipment option.'],
  ['demara-battery','Demara Battery Mark II','Stun','A','Standard','Stun equipment associated with Anby.'],
  ['restrained','The Restrained','Stun','S','Standard','Standard S-Rank Stun equipment.'],
  ['swing-cannon','Kaboom the Cannon','Support','A','Standard','Support equipment associated with Lucy.'],
  ['vault','The Vault','Support','A','Standard','Support equipment associated with Nicole.'],
  ['bashful-demon','Bashful Demon','Support','A','Standard','Support equipment associated with Soukaku.'],
  ['original-transmorpher','Original Transmorpher','Defense','A','Gadget Store','Accessible Defense equipment option.'],
  ['crimson-thirst','Crimson Thirst','Armorer','S','Limited','New Armorer equipment in Version 3.2.',sourceUrls.patch32],
  ['crimson-moon-casket','Crimson Moon Casket','Stun','S','Limited','Featured Stun equipment in 3.2 Phase II.',sourceUrls.channels],
  ['bloodmarrow-coffer','Bloodmarrow Coffer','Armorer','A','City Fund','New City Fund Armorer selection.',sourceUrls.patch32],
];
export const engines:Engine[]=engineRows.map(([id,name,specialty,rank,access,summary,source])=>({...base(id,'engine',name,summary,source??sourceUrls.engines,[specialty,rank+'-Rank',access],id.startsWith('crimson')||id==='bloodmarrow-coffer'?'3.2':undefined),kind:'engine',specialty,rank,access,details:['Passive compatibility requires the matching specialty. Candidate listings are not a measured damage ranking.']}));
type DiscRow=[string,string,string,string,string];
const discRows:DiscRow[]=[
  ['woodpecker-electro','Woodpecker Electro','CRIT','CRIT Rate','Combat ATK stacks from critical attacks.'],
  ['puffer-electro','Puffer Electro','PEN / Ultimate','PEN Ratio','Ultimate-focused damage and temporary ATK.'],
  ['polar-metal','Polar Metal','Ice','Ice damage','Basic and Dash Attack bonuses.'],
  ['chaotic-metal','Chaotic Metal','Ether','Ether damage','CRIT damage linked to Corruption.'],
  ['fanged-metal','Fanged Metal','Physical','Physical damage','Damage window after Assault.'],
  ['thunder-metal','Thunder Metal','Electric','Electric damage','ATK while a Shocked target is present.'],
  ['inferno-metal','Inferno Metal','Fire','Fire damage','CRIT Rate against Burning targets.'],
  ['shockstar-disco','Shockstar Disco','Stun','Impact','Daze from Basic, Dash and Dodge Counter.'],
  ['swing-jazz','Swing Jazz','Support','Energy regeneration','Squad damage after Chain or Ultimate.'],
  ['freedom-blues','Freedom Blues','Anomaly','Anomaly Proficiency','Attribute buildup resistance reduction after EX.'],
  ['chaos-jazz','Chaos Jazz','Off-field','Anomaly Proficiency','Fire/Electric and off-field EX/Assist bonuses.'],
  ['branch-blade','Branch & Blade Song','Frost / CRIT','CRIT DMG','Ice/Shatter and CRIT-threshold bonuses.'],
];
export const discs:Disc[]=discRows.map(([id,name,focus,twoPiece,fourPiece])=>({...base(id,'disc',name,`${focus} equipment set.`,sourceUrls.discs,[focus]),kind:'disc',focus,twoPiece,fourPiece,details:[`2 pieces: ${twoPiece}.`,`4 pieces: ${fourPiece}`,'Read the linked source for exact values and activation text.']}));
type BooRow=[string,string,string,string|undefined,string|undefined,number];
const booRows:BooRow[]=[
  ['sharkboo','Sharkboo','Ice squad companion.','Ice',undefined,2],
  ['penguinboo','Penguinboo','Ice squad companion.','Ice',undefined,2],
  ['plugboo','Plugboo','Electric squad companion.','Electric',undefined,2],
  ['electroboo','Electroboo','Electric squad companion.','Electric',undefined,2],
  ['resonaboo','Resonaboo','Ether squad companion.','Ether',undefined,2],
  ['devilboo','Devilboo','Ether squad companion.','Ether',undefined,2],
  ['rocketboo','Rocketboo','Fire squad companion.','Fire',undefined,2],
  ['amillion','Amillion','Cunning Hares squad companion.',undefined,'cunning-hares',2],
  ['butler','Butler','Victoria Housekeeping squad companion.',undefined,'victoria-housekeeping',2],
  ['safety','Safety','Belobog squad companion.',undefined,'belobog',2],
];
export const bangboos:Bangboo[]=booRows.map(([id,name,summary,attribute,factionId,count])=>({...base(id,'bangboo',name,summary,`https://www.icy-veins.com/zenless-zone-zero/${id}-bangboo`,[attribute??factionNames[factionId!]!]),kind:'bangboo',activation:{attribute,factionId,count},related:factionId?[factionId]:[],details:[`Additional squad condition: at least ${count} ${attribute??factionNames[factionId!]} Agents.`,`This checks the additional ability condition, not a universal damage ranking.`]}));
export const contextRecords:RecordNode[]=[
  {...base('shiyu-defense','mode','Shiyu Defense','Two-team planning for rotating combat nodes.',sourceUrls.patch32,['Timed','Two squads']),details:['Keep team members distinct across sides. Match each node’s actual enemy roster and buffs before choosing a carry.'],related:['critical-node','guide-squads']},
  {...base('deadly-assault','mode','Deadly Assault','Boss-focused scoring with separate teams.',sourceUrls.patch32,['Boss','Three squads']),details:['Plan independent squads before spending upgrades on one encounter. The current phase roster belongs to its patch snapshot.'],related:['kusarikku','deadly-trial-32','guide-rotation']},
  {...base('hollow-zero','mode','Hollow Zero','Exploration with mode-specific programs and upgrades.',sourceUrls.patch32,['Exploration','Programs']),details:['Separate temporary exploration upgrades from the Agent’s normal build. Tactical Prism programs can change the rotation.'],related:['claret','roxy','guide-investment']},
  {...base('notorious-hunt','mode','Notorious Hunt','Core-skill material challenges.',sourceUrls.patch32,['Materials','Boss']),related:['kusarikku-hunt'],details:['Choose the material you need before selecting the challenge.']},
  {...base('expert-challenge','mode','Expert Challenge','Targeted core-skill material farming.',sourceUrls.patch32,['Materials']),related:['conqueror-stage']},
  {...base('routine-cleanup','mode','Routine Cleanup','Drive Disc farming and equipment progression.',sourceUrls.discs,['Equipment']),details:['Select a stage for useful sets across the squad rather than optimizing one unfinished Agent in isolation.'],related:['guide-discs']},
  {...base('critical-node','stage','Critical Node · 3.2','A patch snapshot of Shiyu Defense’s changing buffs.',sourceUrls.patch32,['Shiyu Defense']),related:['shiyu-defense','patch-3-2']},
  {...base('deadly-trial-32','stage','Deadly Assault · 3.2 Trial','Phase-dependent Trial encounters.',sourceUrls.patch32,['Deadly Assault']),related:['deadly-assault','kusarikku','ye-shiyuan','infernal-revenant']},
  {...base('kusarikku-hunt','stage','Kusarikku · Notorious Hunt','Challenge dropping Counterfeit Nucleus.',sourceUrls.patch32,['Materials']),related:['notorious-hunt','kusarikku'],introducedIn:'3.2'},
  {...base('conqueror-stage','stage','Conqueror · Expert Challenge','Challenge dropping Imitation Core.',sourceUrls.patch32,['Materials']),related:['expert-challenge','conqueror'],introducedIn:'3.2'},
  ...[['kusarikku','Kusarikku'],['conqueror','Autonomous Tactical Unit - Conqueror'],['ye-shiyuan','Ye Shiyuan the Thrall'],['infernal-revenant','Infernal Revenant'],['miasmic-fiend','Miasmic Fiend - Unfathomable'],['girtablullu','Girtablullu - Stagnant Aberrant']].map(([id,name])=>({...base(id,'enemy',name,'Encounter target recorded in the Version 3.2 notice.',sourceUrls.patch32,['Encounter']),related:id==='conqueror'?['conqueror-stage']:['deadly-assault'],details:['Check the actual stage modifiers before inferring a weakness or preferred team. Enemy resistance values are not yet included.']})),
  {...base('patch-3-1','patch','Version 3.1 · The Long Goodbye','Historical release snapshot.',sourceUrls.patch31,['History']),patch:'3.1',introducedIn:'3.1',related:['remielle','sigrid'],validFrom:'2026-07-29T06:00:00+08:00',validUntil:'2026-09-09T06:00:00+08:00'},
  {...base('patch-3-2','patch','Version 3.2 · Their Secret Histories','Current indexed release: 9 September–21 October 2026 (UTC+8).',sourceUrls.patch32,['Current']),introducedIn:'3.2',related:['claret','roxy','patch-3-1','phase-ii-channels'],validFrom:'2026-09-09T06:00:00+08:00',validUntil:'2026-10-21T06:00:00+08:00'},
  {...base('angels-support','event','Angels Support Operation','Outfit event continuing beyond the patch boundary.',sourceUrls.patch32,['Outfits']),related:['patch-3-2'],details:['Official end: 2026-11-30 03:59 server time. Server region must be known before converting this to a user countdown.']},
  {...base('phase-ii-channels','event','Version 3.2 Phase II channels','Roxy and Promeia featured channels.',sourceUrls.channels,['Signal Search']),related:['roxy','promeia','crimson-moon-casket','patch-3-2'],details:['Official window: 2026-09-30 12:00 through 2026-10-20 14:59 server time.','Server-time events are displayed without a guessed timezone.']},
  {...base('orbie-parent','event','Diary of an Orbie Parent','Version 3.2 activity.',sourceUrls.patch32,['Event']),related:['patch-3-2'],details:['Official window: 2026-09-30 10:00 through 2026-10-19 03:59 server time.']},
];



