import type {RecordNode} from '../domain';
const entries:[string,string,string,string[]][]=[
 ['sixth-street','Sixth Street','A street-level view of New Eridu. Explore the district behind the archive’s urban setting.',['cunning-hares','routine-cleanup']],
 ['lumina-square','Lumina Square','A city district with broad streets, storefronts and pedestrian spaces.',['neps','sixth-street']],
 ['scott-outpost','Scott Outpost','The outpost connects the city to Hollow-related operations and combat activities.',['hollow-zero','shiyu-defense','notorious-hunt','deadly-assault']],
 ['ballet-twins-road','Ballet Twins Road','The Ballet Twins district, shown in its urban environment.',['victoria-housekeeping','lumina-square']],
 ['brant-street','Brant Street Construction Site','An industrial construction site in New Eridu.',['belobog','sixth-street']],
 ['blazewood','Blazewood','A settlement in the Outer Ring, away from New Eridu’s dense city streets.',['sons-of-calydon','caesar','burnice']],
];
export const locations:RecordNode[]=entries.map(([id,name,summary,related])=>({id,kind:'location',name,summary,related,patch:'3.2',status:'editorial',tags:['Location','Visual reference'],source:`https://zenless-zone-zero.fandom.com/wiki/${encodeURIComponent(name.replaceAll(' ','_'))}`,details:['This visual reference identifies the setting. It is not a collectible map, a farming route or evidence of a tested build.','Linked factions and activities provide thematic context; they do not describe permanent Agent positions.']}));
