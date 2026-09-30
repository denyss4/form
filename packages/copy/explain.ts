// The reason under the plan, in two parts. First why THIS plan: the plan rule, stated plainly (score band x day type). Then why the score
// is what it is: only the drivers the model returned (Brief §8: never present sleep as a top driver unless the model returns it).
// No drivers means no driver sentence.
import type { DayTag, Session } from '../planner/week.ts';
import type { FormDriver } from '../model/adapter.ts';
import type { ScoreBand } from '../planner/plan.ts';
import type { PlanId } from '../tokens/color.ts';
import { copy } from './copy.ts';

const joinList = (items: string[]) =>
  items.length <= 1 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

// "Training load and alcohol": the first label keeps its capital, the rest run on in lower case.
const phrase = (drivers: FormDriver[]) => joinList(drivers.map((d, i) => (i === 0 ? d.label : d.label.toLowerCase())));

export interface PlanContext {
  band: ScoreBand;
  tags: DayTag[];
  sessions: Session[];
}

function whyPlan(plan: PlanId, { band, tags, sessions }: PlanContext): string {
  const session = sessions[0];
  if (session) {
    if (plan === 'hard') return copy.today.why.hard(session.name);
    if (plan === 'recover') return copy.today.why.lowSession(session.name);
    return session.intensity === 'hard' ? copy.today.why.toned(session.name) : copy.today.why.lightSession(session.name);
  }
  if (plan === 'deepwork') return copy.today.why.deepwork;
  if (band === 'low') return copy.today.why.lowDay;
  return tags.includes('travel') ? copy.today.why.travelDay : copy.today.why.restDay;
}

export function explain(plan: PlanId, drivers: FormDriver[], context: PlanContext): string {
  const lead = whyPlan(plan, context);
  const down = drivers.filter((d) => d.direction === 'down');
  const up = drivers.filter((d) => d.direction === 'up');
  if (down.length > 0) return `${lead} ${copy.today.pulling(phrase(down), down.length > 1)}`;
  if (up.length > 0) return `${lead} ${copy.today.helping(phrase(up), up.length > 1)}`;
  return `${lead} ${copy.today.usual}`;
}
