export const CURRENT_PATCH = '3.2';
export const VERIFIED_AT = '2026-10-04';
export type Kind = 'location'|'agent'|'engine'|'disc'|'bangboo'|'team'|'faction'|'enemy'|'mode'|'stage'|'patch'|'event'|'build'|'guide';
export type Status = 'verified'|'editorial'|'editorial-draft';
export interface RecordNode {
  id: string; kind: Kind; name: string; summary: string; patch: string;
  tags: string[]; related: string[]; source?: string; details?: string[];
  status: Status; introducedIn?: string; sourceReviewedIn?: string;
  verifiedAt?: string; validFrom?: string; validUntil?: string;
}
export type ActivationRule = { sameAttribute?: boolean; sameFaction?: boolean; specialties?: string[]; defensiveAssist?: boolean };
export interface Agent extends RecordNode {
  kind: 'agent'; attribute: string; specialty: string; factionId: string; rank: 'A'|'S';
  fieldRole: 'Carry'|'Stun'|'Support'|'Off-field'|'Defense';
  activation?: ActivationRule; assist: 'Defensive'|'Evasive'|'Unknown';
  playstyle: string; caution: string;
}
export interface Engine extends RecordNode {kind:'engine'; specialty:string; rank:'A'|'S'|'B'; access: 'Limited'|'Standard'|'Gadget Store'|'City Fund';}
export interface Disc extends RecordNode {kind:'disc'; focus:string; twoPiece:string; fourPiece:string;}
export interface Bangboo extends RecordNode {kind:'bangboo'; activation:{attribute?:string;factionId?:string;count:number};}
export interface Team extends RecordNode {kind:'team'; agentIds:[string,string,string]; bangbooIds:string[];modeIds:string[]; archetype:string;sequence:string[];tradeoffs:string[];}
export interface BuildVariant extends RecordNode {
  kind:'build';agentId:string;modeId:string;stageId?:string;goal:string;
  engineIds:string[];discIds:string[];teamIds:string[];priorities:string[];
  rotation:string;caveat:string;discPlan?:{id:string;pieces:2|4}[];
  mainStats?:{slot4:string;slot5:string;slot6:string};substats?:string[];
  investment?:string;modeNotes?:string[];
}
export interface Guide extends RecordNode {kind:'guide';sections:{title:string;text:string}[];}
export const sourceUrls = {
  patch32:'https://zenless.hoyoverse.com/en-us/news/166000',
  patch31:'https://zenless.hoyoverse.com/en-us/news/165414',
  channels:'https://zenless.hoyoverse.com/en-us/news/166475',
  factions:'https://zenless.hoyoverse.com/en-us/character',
  workshop:'https://zenless.hoyoverse.com/en-us/news/165865',
  discs:'https://www.prydwen.gg/zenless/disk-drives/',
  engines:'https://www.prydwen.gg/zenless/w-engines/',
  bangboo:'https://www.prydwen.gg/zenless/bangboo/',
};
export const profileSource = (id:string) => `https://www.prydwen.gg/zenless/characters/${({'anby':'anby-demara','nicole':'nicole-demara','billy':'billy-kid','grace':'grace-howard','jane':'jane-doe'} as Record<string,string>)[id]??id}/`;
export const versionNumber=(version:string)=>version.split('.').reduce((total,value,index)=>total+Number(value)/Math.pow(100,index),0);
export function availableAt(node:RecordNode,patch:string) {return !node.introducedIn||versionNumber(node.introducedIn)<=versionNumber(patch);}
export function recordState(node:RecordNode,now=new Date()) {
  if(node.validFrom&&now<new Date(node.validFrom))return 'Upcoming';
  if(node.validUntil&&now>=new Date(node.validUntil))return 'Ended';
  return node.validFrom||node.validUntil?'Active':null;
}
