import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import assetsJson from './media-assets.json';
import type {RecordNode,BuildVariant,Team} from './domain';
export type MediaAsset={label:string;kind:string;src:string;thumb:string;width:number;height:number;alt:string;source:string;credit:string;sha256:string};
export const mediaAssets:Record<string,MediaAsset>=assetsJson;
export function mediaIdsFor(record:RecordNode):string[]{
 if(record.kind==='build')return [(record as BuildVariant).agentId];
 if(record.kind==='team')return (record as Team).agentIds;
 if(record.id.endsWith('-build-guide'))return [record.id.replace('-build-guide','')];
 if(record.kind==='faction')return record.related.filter(id=>mediaAssets[id]?.kind==='agent').slice(0,6);
 const direct=mediaAssets[record.id]?[record.id]:[];
 const context:Record<string,string[]>={
  'ye-shiyuan':['ye-shiyuan-gameplay'],'miasmic-fiend':['miasmic-fiend-gameplay'],
  'kusarikku-hunt':['kusarikku'],'conqueror-stage':['conqueror'],
  'critical-node':['shiyu-defense'],'deadly-trial-32':['kusarikku','ye-shiyuan','infernal-revenant'],
  'notorious-hunt':['scott-outpost'],'hollow-zero':['scott-outpost'],'deadly-assault':['scott-outpost'],
 };
 return [...direct,...(context[record.id]??[])];
}
function Picture({asset,small=false,eager=false}:{asset:MediaAsset;small?:boolean;eager?:boolean}){
 const [failed,setFailed]=useState(false);
 return failed?<span className="media-unavailable">Image unavailable · {asset.label}</span>:<img src={small?asset.thumb:asset.src} width={asset.width} height={asset.height} alt={asset.alt} loading={eager?'eager':'lazy'} decoding="async" onError={()=>setFailed(true)}/>;
}
// Non-interactive: safe inside a link, without nested buttons or duplicate tab stops.
export function MediaThumb({id}:{id:string}){const asset=mediaAssets[id];return asset?<span className={`media-thumb media-${asset.kind}`}><Picture key={asset.src} asset={asset} small/></span>:null;}
export function MediaGallery({ids,eager=false}:{ids:string[];eager?:boolean}){
 const items=[...new Set(ids)].map(id=>mediaAssets[id]).filter(Boolean);
 const [opened,setOpened]=useState<MediaAsset|null>(null);
 const dialog=useRef<HTMLDialogElement>(null);
 const trigger=useRef<HTMLButtonElement|null>(null);
 useEffect(()=>{
  if(!opened||!dialog.current)return;
  const previous=document.body.style.overflow;document.body.style.overflow='hidden';
  dialog.current.showModal();
  return ()=>{document.body.style.overflow=previous;trigger.current?.focus();};
 },[opened]);
 if(!items.length)return null;
 return <><div className={`media-gallery ${items.length===1?'media-single':''}`}>
  {items.map((asset,index)=><figure className={`media-figure media-${asset.kind}`} key={asset.src}>
   <button className="media-open" type="button" aria-label={`Enlarge ${asset.label}`} onClick={event=>{trigger.current=event.currentTarget;setOpened(asset);}}><Picture asset={asset} eager={eager&&index===0}/><span className="media-enlarge" aria-hidden="true">View image ↗</span></button>
   <figcaption><span>{asset.label}</span><a href={asset.source} target="_blank" rel="noreferrer">{asset.credit} ↗</a></figcaption>
  </figure>)}
 </div>{opened&&createPortal(<dialog ref={dialog} className="media-dialog" aria-label={opened.label} onCancel={()=>setOpened(null)} onClose={()=>setOpened(null)} onClick={e=>{if(e.target===e.currentTarget)setOpened(null);}}>
  <div className="media-dialog-content"><button className="button media-close" autoFocus type="button" onClick={()=>setOpened(null)} aria-label="Close image">Close ×</button><Picture asset={opened} eager/><div className="media-dialog-caption"><strong>{opened.label}</strong><a href={opened.source} target="_blank" rel="noreferrer">Image source · {opened.credit} ↗</a></div></div>
 </dialog>,document.body)}</>;
}
