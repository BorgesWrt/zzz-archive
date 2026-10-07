import {miyabiGuide} from './miyabi';
import {zhuYuanGuide} from './zhu-yuan';
import {lycaonGuide} from './lycaon';
import {nicoleGuide} from './nicole';
import {caesarGuide} from './caesar';
export const authoredGuides=[miyabiGuide,zhuYuanGuide,lycaonGuide,nicoleGuide,caesarGuide];
export const authoredByAgent=new Map(authoredGuides.map(g=>[g.agentId,g]));
