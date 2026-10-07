import type {Disc,Engine} from '../domain';
export const editorialEngines:Engine[]=[{
 id:'tusks-of-fury',kind:'engine',name:'Tusks of Fury',specialty:'Defense',rank:'S',access:'Limited',
 summary:'Caesar’s signature candidate: Impact, shielding and conditional squad bonuses.',
 patch:'3.2',status:'verified',verifiedAt:'2026-10-05',introducedIn:'1.2',tags:['Defense','S-Rank','Limited'],related:['caesar'],
 source:'https://www.icy-veins.com/zenless-zone-zero/caesar-king-guide-best-builds',
 details:['Check the passive trigger and refinement on the equipped copy. The guide does not require ownership of this engine.'],
}];
export const editorialDiscs:Disc[]=[{
 id:'proto-punk',kind:'disc',name:'Proto Punk',focus:'Shield / assist support',twoPiece:'Shield effect +15%',fourPiece:'Assist-triggered squad damage buff',
 summary:'A shield-support set for squads that repeatedly trigger Perfect Assists.',patch:'3.2',status:'verified',verifiedAt:'2026-10-05',introducedIn:'1.2',tags:['Shield','Support'],related:['caesar'],
 source:'https://www.prydwen.gg/zenless/characters/caesar/',
 details:['Use four pieces only when the squad can sustain the assist trigger. The same-named squad effect does not stack.'],
}];
