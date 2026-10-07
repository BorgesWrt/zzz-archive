import {useState} from 'react';
import {Link} from 'react-router-dom';
import {ArchiveMark,EntityIcon} from './Brand';
import {CURRENT_PATCH} from './data';

export function SignalMap(){
 const [paused,setPaused]=useState(false);
 return <div className={`signal-map ${paused?'is-paused':''}`}>
  <div className="signal-caption"><span>YOUR NEXT BUILD STARTS HERE</span><button className="motion-toggle" aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?'Resume motion':'Pause motion'}</button></div>
  <div className="signal-canvas">
   <svg className="signal-lines" viewBox="0 0 480 380" aria-hidden="true"><ellipse cx="240" cy="190" rx="180" ry="130"/><ellipse cx="240" cy="190" rx="125" ry="85"/><path d="M105 86 240 190 378 110M240 190 110 297M240 190 377 293"/><circle className="signal-traveller" cx="240" cy="60" r="4"/></svg>
   <div className="signal-core"><ArchiveMark/><strong>HDD</strong><span>CONNECTED INDEX</span></div>
   <Link className="signal-node signal-agent" to="/explore/agent"><EntityIcon kind="agent"/><span><small>01 / START WITH</small><strong>Your Agent</strong></span><span aria-hidden="true">↗</span></Link>
   <Link className="signal-node signal-build" to="/guides"><EntityIcon kind="build"/><span><small>02 / FIND A</small><strong>Build guide</strong></span><span aria-hidden="true">↗</span></Link>
   <Link className="signal-node signal-mode" to="/explore/mode"><EntityIcon kind="mode"/><span><small>03 / ADAPT TO</small><strong>Your mode</strong></span><span aria-hidden="true">↗</span></Link>
   <Link className="signal-node signal-team" to="/planner"><EntityIcon kind="team"/><span><small>04 / CONNECT</small><strong>Your squad</strong></span><span aria-hidden="true">↗</span></Link>
  </div>
  <div className="signal-bottom"><span><i/> PATCH {CURRENT_PATCH} INDEX</span><Link to="/graph">Explore all connections →</Link></div>
 </div>;
}

