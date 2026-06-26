import type { SceneId } from "@/lib/timeline";
import { TitleSlide } from "@/components/scenes/TitleSlide";
import { RateRamp } from "@/components/scenes/RateRamp";
import { GnnSolution } from "@/components/scenes/GnnSolution";
import { SpeedJourney } from "@/components/scenes/SpeedJourney";
import { InnerLoopHistory } from "@/components/scenes/InnerLoopHistory";
import { QuirksAside } from "@/components/scenes/QuirksAside";
import { LoopsVizMiddle } from "@/components/scenes/LoopsVizMiddle";
import { LoopsVizOuter } from "@/components/scenes/LoopsVizOuter";
import { EasterRelease } from "@/components/scenes/EasterRelease";
import { EasterBug } from "@/components/scenes/EasterBug";
import { RorvigRunPhone } from "@/components/scenes/RorvigRunPhone";
import { EasterSmokingGun } from "@/components/scenes/EasterSmokingGun";
import { EasterCrossEval } from "@/components/scenes/EasterCrossEval";
import { EasterDispatch } from "@/components/scenes/EasterDispatch";
import { EasterArchitecture } from "@/components/scenes/EasterArchitecture";
import { EasterDiscovery } from "@/components/scenes/EasterDiscovery";
import { EasterReveal } from "@/components/scenes/EasterReveal";
import { EasterThesis } from "@/components/scenes/EasterThesis";
import { EasterWhyPossible } from "@/components/scenes/EasterWhyPossible";
import { StatsFeint } from "@/components/scenes/StatsFeint";
import { NbiGraph } from "@/components/scenes/NbiGraph";
import { Matchmaking } from "@/components/scenes/Matchmaking";
import { Faculty2031Teaching } from "@/components/scenes/Faculty2031Teaching";
import { PhDPedagogy } from "@/components/scenes/PhDPedagogy";
import { NBIAINativeCallToAction } from "@/components/scenes/NBIAINativeCallToAction";
import { ClaudeFinalSlide } from "@/components/scenes/ClaudeFinalSlide";
import { CalendarFlip2028, CalendarFlip2031, CalendarFlip2026Back } from "@/components/scenes/CalendarFlip";
import { Platform2028 } from "@/components/scenes/Platform2028";
import { ColliderLabLaunch } from "@/components/scenes/ColliderLabLaunch";
import { Deliverables2026 } from "@/components/scenes/Deliverables2026";
import { LoopsViz } from "@/components/scenes/LoopsViz";

export type SceneComponent = (props: {
  step: number;
  onAdvance?: () => void;
}) => React.ReactElement;

// Single source of truth for SceneId → component. Consumed by both the live
// deck (Stage) and the chrome-less /embed route used by the reading article.
export const SCENE_COMPONENTS: Partial<Record<SceneId, SceneComponent>> = {
  title: TitleSlide,
  rateRamp: RateRamp,
  gnnSolution: GnnSolution,
  speedJourney: SpeedJourney,
  loopsViz: LoopsViz as unknown as SceneComponent,
  quirksAside: QuirksAside as unknown as SceneComponent,
  innerLoopHistory: InnerLoopHistory as unknown as SceneComponent,
  loopsVizMiddle: LoopsVizMiddle as unknown as SceneComponent,
  loopsVizOuter: LoopsVizOuter as unknown as SceneComponent,
  easter1Release: EasterRelease as unknown as SceneComponent,
  easter2Bug: EasterBug as unknown as SceneComponent,
  rorvigRunPhone: RorvigRunPhone as unknown as SceneComponent,
  easter3SmokingGun: EasterSmokingGun as unknown as SceneComponent,
  easter4CrossEval: EasterCrossEval as unknown as SceneComponent,
  easter5Dispatch: EasterDispatch as unknown as SceneComponent,
  easter6Architecture: EasterArchitecture as unknown as SceneComponent,
  easter7Discovery: EasterDiscovery as unknown as SceneComponent,
  easter8Reveal: EasterReveal as unknown as SceneComponent,
  easter9Thesis: EasterThesis as unknown as SceneComponent,
  easter10WhyPossible: EasterWhyPossible as unknown as SceneComponent,
  statsFeint: StatsFeint as unknown as SceneComponent,
  calendarFlip2028: CalendarFlip2028 as unknown as SceneComponent,
  platform2028: Platform2028 as unknown as SceneComponent,
  nbiGraph: NbiGraph as unknown as SceneComponent,
  matchmaking: Matchmaking as unknown as SceneComponent,
  faculty2031Teaching: Faculty2031Teaching as unknown as SceneComponent,
  phdPedagogy: PhDPedagogy as unknown as SceneComponent,
  calendarFlip2031: CalendarFlip2031 as unknown as SceneComponent,
  colliderLabLaunch: ColliderLabLaunch as unknown as SceneComponent,
  calendarFlip2026back: CalendarFlip2026Back as unknown as SceneComponent,
  deliverables2026: Deliverables2026 as unknown as SceneComponent,
  nbiAINativeCallToAction: NBIAINativeCallToAction as unknown as SceneComponent,
  claudeFinalSlide: ClaudeFinalSlide as unknown as SceneComponent,
};
