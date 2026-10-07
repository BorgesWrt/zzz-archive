import type { BuildVariant } from '../domain';

export type SectionId = 'direction'|'equipment'|'rotation'|'teams'|'shiyu-defense'|'deadly-assault'|'hollow-zero'|'mistakes';
export interface GuideSection {
  id: SectionId;
  title: string;
  text: string;
  steps?: string[];
  sourceIds: string[];
  editorial?: boolean;
  relatedIds?: string[];
  squadIds?: [string,string,string];
}
export interface GuideSource {
  id: string;
  title: string;
  url: string;
  checkedAt: string;
  scope: string;
  revisionNote: string;
}
export interface AuthoredGuide {
  agentId: string;
  summary: string;
  // Deliberately literal per article. Advancing CURRENT_PATCH must not re-review content.
  catalogPatch: string;
  revision: number;
  updatedAt: string;
  factsCheckedAt: string;
  equipmentCheckedAt: string;
  rotationTestedAt: string | null;
  modesTestedAt: string | null;
  assumptions: string;
  baseline: {
    discPlan: NonNullable<BuildVariant['discPlan']>;
    engineIds: string[];
    mainStats: NonNullable<BuildVariant['mainStats']>;
    substats: string[];
  };
  choices: {recordId: string;when: string;sourceIds: string[]}[];
  sections: GuideSection[];
  sources: GuideSource[];
  dependencies: string[];
  openQuestions: string[];
  changelog: {date: string;note: string}[];
}
export type GuideReadiness = 'reference'|'editorial-guide'|'needs-review';
export function guideReadiness(guide:AuthoredGuide|undefined, patch:string):GuideReadiness {
  return !guide?'reference':guide.catalogPatch===patch?'editorial-guide':'needs-review';
}
export const readinessLabel:Record<GuideReadiness,string>={
  reference:'Reference profile', 'editorial-guide':'Individual guide', 'needs-review':'Patch review needed',
};
export function guideDependencies(guide:AuthoredGuide):string[]{
 return [...new Set([guide.agentId,...guide.dependencies,
  ...guide.baseline.engineIds,...guide.baseline.discPlan.map(d=>d.id),
  ...guide.choices.map(c=>c.recordId),
  ...guide.sections.flatMap(s=>[...(s.relatedIds??[]),...(s.squadIds??[])])])];
}
