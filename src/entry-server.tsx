import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { allRecords, kinds, recordPath } from './data';
import {buildArticles,authoredByAgent} from './articles';
import type {BuildVariant} from './domain';
export const referenceRoutes=buildArticles.filter(g=>!g.content).map(recordPath);
export const contextRoutes=allRecords.filter(r=>r.kind==='build'&&authoredByAgent.has((r as BuildVariant).agentId)).map(recordPath);
export const privateRoutes=['/search','/planner','/roster','/compare','/privacy',...referenceRoutes,...contextRoutes];
export const publicRoutes=[...new Set(['/', '/builds','/guides','/sources','/graph',...kinds.map(k=>`/explore/${k.id}`),...allRecords.map(recordPath)])].filter(route=>!privateRoutes.includes(route));
export function render(url:string){return renderToString(<StaticRouter location={url}><App/></StaticRouter>)}
