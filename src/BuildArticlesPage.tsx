import {Link,useParams,useSearchParams} from 'react-router-dom';
import {buildArticles} from './articles';
import {allRecords,byId,recordPath,agents,CURRENT_PATCH} from './data';
import type {BuildVariant} from './domain';
import type {AuthoredGuide} from './content/guide-schema';
import {readinessLabel} from './content/guide-schema';
import {EntityIcon} from './Brand';

function RecordLink({id}:{id:string}){const r=byId.get(id);return r?<Link to={recordPath(r)}>{r.name}</Link>:<span>{id}</span>}
function Citations({ids,guide}:{ids:string[];guide:AuthoredGuide}){return <div className="guide-citations">{ids.map(id=>{const source=guide.sources.find(s=>s.id===id)!;return <a href={`#source-${id}`} key={id}>Source: {source.title}</a>})}</div>}

export function BuildLibrary(){
 const [p,setP]=useSearchParams();const q=p.get('q')??'';const specialty=p.get('specialty')??'';
 const requested=p.get('status');const status=['all','guides','reference','needs-review'].includes(requested??'')?requested!:'guides';
 const guideCount=buildArticles.filter(g=>g.content).length;
 const found=buildArticles.filter(g=>(!q||g.name.toLowerCase().includes(q.toLowerCase()))&&(!specialty||g.tags.includes(specialty))&&(status==='all'||status==='guides'&&!!g.content||g.readiness===status)).sort((a,b)=>Number(!!b.content)-Number(!!a.content)||a.name.localeCompare(b.name));
 function update(key:string,value:string){const next=new URLSearchParams(p);value?next.set(key,value):next.delete(key);setP(next,{replace:true})}
 return <><title>Individual Agent Guides & Reference Profiles · ZZZ Archive</title><meta name="description" content="Individual ZZZ guides with equipment decisions, rotations, source checks and clear review status. Browse separate reference profiles for remaining Agents."/>
  <div className="page-intro"><span className="eyebrow">AGENT FIELD MANUALS</span><h1>Find your next build.</h1><p>{guideCount} individual guides and {buildArticles.length-guideCount} reference profiles. Each guide explains its equipment choices, resource loop and limits.</p><p className="guide-legend">Source checks and gameplay tests are shown separately. Reference profiles do not yet include a reviewed individual guide.</p></div>
  <div className="filter-bar panel"><input aria-label="Search agent guides" placeholder="Find your Agent" value={q} onChange={e=>update('q',e.target.value)}/><select aria-label="Specialty" value={specialty} onChange={e=>update('specialty',e.target.value)}><option value="">All specialties</option>{[...new Set(agents.map(a=>a.specialty))].map(s=><option key={s}>{s}</option>)}</select><select aria-label="Guide coverage" value={status} onChange={e=>update('status',e.target.value)}><option value="guides">Individual guides ({guideCount})</option><option value="reference">Reference profiles ({buildArticles.length-guideCount})</option><option value="needs-review">Patch review needed</option><option value="all">All Agents ({buildArticles.length})</option></select></div>
  <div className="result-count" role="status">{found.length} result{found.length===1?'':'s'} {(q||specialty||status!=='guides')&&<button className="button" onClick={()=>setP({},{replace:true})}>Reset filters</button>}</div>
  <div className="guide-grid">{found.map(g=><Link className="guide-card panel" to={`/guides/${g.agentId}`} key={g.id}><EntityIcon kind="build"/><span className={`coverage-badge ${g.readiness}`}>{readinessLabel[g.readiness]}</span><span className="micro">{g.tags.slice(0,2).join(' / ')}</span><h2>{g.name}</h2><p>{g.summary}</p><small>{g.content?`${g.readingMinutes} MIN READ · SOURCE CHECK ${g.content.factsCheckedAt}`:'INDIVIDUAL GUIDE PENDING'}</small></Link>)}</div>
  {!found.length&&<div className="empty panel"><p>No matches in this coverage group.</p><button className="button" onClick={()=>update('status','all')}>Search all Agents</button></div>}
 </>;
}

export function AgentArticle(){
 const {agentId}=useParams();const article=buildArticles.find(g=>g.agentId===agentId);
 if(!article)return <div className="page-intro"><h1>Guide not found.</h1><Link to="/guides">Browse all guides</Link></div>;
 const agent=agents.find(a=>a.id===article.agentId)!;
 const guide=article.content;
 const variants=allRecords.filter(r=>r.kind==='build'&&(r as BuildVariant).agentId===agent.id);
 if(!guide)return <><title>{article.name+' · ZZZ Archive'}</title><meta name="description" content={article.summary}/><meta name="robots" content="noindex,follow"/>
  <div className="detail-breadcrumb"><Link to="/guides?status=all">AGENT LIBRARY</Link><span>/</span><span>{agent.name}</span></div>
  <div className="page-intro"><span className="coverage-badge reference">Reference profile</span><h1>{agent.name}.</h1><p>{agent.attribute} / {agent.specialty}. An individual guide has not been reviewed yet.</p></div>
  <section className="panel content-panel reference-notice"><h2>What is available</h2><p>The catalog contains a character record and equipment starting points. This page does not claim a verified rotation, tested team or current-mode recommendation.</p><div className="hero-buttons"><Link className="button primary" to={recordPath(agent)}>Open Agent record</Link><Link className="button" to={`/planner?squad=${agent.id}`}>Check squad conditions</Link></div><h3>Existing catalog variants</h3>{variants.map(v=><p key={v.id}><Link to={recordPath(v)}>{v.name}</Link></p>)}<h3>Still to review</h3><ul><li>Equipment alternatives and their activation conditions.</li><li>A specific resource loop and team hand-off.</li><li>Mode decisions and source revisions.</li></ul><Link className="text-link" to="/guides">Read the individual guides →</Link></section>
 </>;
 return <><title>{article.name+' · ZZZ Archive'}</title><meta name="description" content={article.summary}/>
  <div className="detail-breadcrumb"><Link to="/guides">BUILD GUIDES</Link><span>/</span><span>{agent.name}</span></div>
  <div className="page-intro"><span className={`coverage-badge ${article.readiness}`}>{readinessLabel[article.readiness]}</span><span className="eyebrow guide-role">{agent.attribute} / {agent.specialty} / {article.readingMinutes} MIN READ</span><h1>{article.name}.</h1><p>{article.summary}</p></div>
  {article.readiness==='needs-review'&&<div className="review-alert" role="status">This guide was scoped to catalog patch {guide.catalogPatch}. Patch {CURRENT_PATCH} needs a new editorial review; its dates have not been advanced.</div>}
  <section className="guide-review panel" aria-label="Review status"><div><span>Facts checked</span><strong>{guide.factsCheckedAt}</strong></div><div><span>Equipment checked</span><strong>{guide.equipmentCheckedAt}</strong></div><div><span>Rotation test</span><strong>{guide.rotationTestedAt??'Not performed'}</strong></div><div><span>Mode tests</span><strong>{guide.modesTestedAt??'Not performed'}</strong></div></section>
  <div className="article-layout"><article className="panel content-panel article-content">
   <section id="quick-build"><h2>Build at a glance</h2><p>{guide.assumptions}</p><div className="tag-row">{guide.baseline.discPlan.map(d=><span className="tag" key={d.id}>{d.pieces} pieces · <RecordLink id={d.id}/></span>)}</div><div className="build-facts">{Object.entries(guide.baseline.mainStats).map(([slot,value])=><div key={slot}><small>{slot.replace('slot','SLOT ')}</small><strong>{value}</strong></div>)}</div><p><strong>Substats:</strong> {guide.baseline.substats.join(' → ')}</p><p><strong>W-Engine candidates:</strong> {guide.baseline.engineIds.map(id=><span className="inline-node" key={id}><RecordLink id={id}/></span>)}</p><a className="text-link" href="#equipment">See when to choose each option ↓</a></section>
   {guide.sections.map(s=><section id={s.id} key={s.id}><h2>{s.title}</h2>{s.editorial&&<span className="coverage-badge reference">Editorial practice · not a tested ranking</span>}<p>{s.text}</p>{s.steps&&<ol className="rotation-steps">{s.steps.map(step=><li key={step}>{step}</li>)}</ol>}
    {s.id==='equipment'&&<div className="equipment-decisions">{guide.choices.map(c=><div key={c.recordId}><h3><RecordLink id={c.recordId}/></h3><p>{c.when}</p><Citations ids={c.sourceIds} guide={guide}/></div>)}</div>}
    <Citations ids={s.sourceIds} guide={guide}/>{s.relatedIds&&<div className="guide-related">{s.relatedIds.map(id=><span key={id}><RecordLink id={id}/></span>)}</div>}
    {s.id==='teams'&&<Link className="button" to={`/planner?squad=${(s.squadIds??[agent.id]).join(',')}`}>Check this example squad</Link>}
   </section>)}
   <section id="open-questions"><h2>What still needs testing</h2><ul>{guide.openQuestions.map(q=><li key={q}>{q}</li>)}</ul><p>Mode notes share the equipment baseline above. Existing mode records are retained as context links; they are not separate tested loadouts.</p>{variants.map(v=><p key={v.id}><Link to={recordPath(v)}>{v.name}</Link></p>)}</section>
   <section id="sources"><h2>Sources and review history</h2><p>Catalog scope: {guide.catalogPatch}. Revision {guide.revision}, updated {guide.updatedAt}. A source check confirms what the linked page says; it does not establish current-patch performance.</p>{guide.sources.map(s=><div className="guide-source" id={`source-${s.id}`} key={s.id}><h3><a href={s.url} target="_blank" rel="noreferrer">{s.title} ↗</a></h3><p>{s.scope}</p><p>Read {s.checkedAt}. {s.revisionNote}</p></div>)}<h3>Changes to this guide</h3><ul>{guide.changelog.map(c=><li key={c.date+c.note}><strong>{c.date}:</strong> {c.note}</li>)}</ul></section>
  </article><aside className="article-toc panel content-panel"><span className="micro">IN THIS GUIDE</span><details><summary>Jump to a section</summary><nav aria-label="Guide contents"><a href="#quick-build">Build at a glance</a>{guide.sections.map(s=><a href={`#${s.id}`} key={s.id}>{s.title}</a>)}<a href="#open-questions">What still needs testing</a><a href="#sources">Sources & changes</a></nav></details><p><RecordLink id={agent.id}/></p><p><Link to="/guides">All individual guides →</Link></p></aside></div>
 </>;
}
