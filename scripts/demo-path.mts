// Replays the demo's locked path through the real model and plan engine, exactly as Today does it (app/(tabs)/today.tsx `save`), and
// prints each morning's plan, score, range and drivers. Run: node scripts/demo-path.mts [mondayRating] [tuesdayRating]
// Use it to refresh docs/demo/DEMO.md whenever the model, the fixtures or the plan rules change: the demo's numbers come from here.
import { readFileSync } from 'node:fs';

import type { MartaCalendar, MartaWeek } from '../fixtures/index.ts';
import { forecast } from '../packages/model/forecast.ts';
import { buildLog } from '../packages/planner/dailyLog.ts';
import { planForDay } from '../packages/planner/plan.ts';
import { applyMove, buildWeek, suggestMove } from '../packages/planner/week.ts';
import { addDays } from '../packages/planner/dates.ts';

// JSON is read directly: Node needs an import attribute the app's bundler does not use.
const json = (path: string) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const martaWeek: MartaWeek = json('../fixtures/marta-week.json');
const martaCalendar: MartaCalendar = json('../fixtures/marta-calendar.json');
const model = json('../packages/model/model.json');

const [mon = 7, tue = 9] = process.argv.slice(2).map(Number);
const evening = { effort: 'moderate', alcohol: 'no', unusual: 'no', fit: 'yes' } as const;

const start = martaWeek.meta.demoToday;
const events = martaCalendar.events;
const before = buildWeek(events, martaCalendar.meta.weekStart);
const move = suggestMove(before);
const after = move ? buildWeek(applyMove(events, move), martaCalendar.meta.weekStart) : before;
const dayOf = (week: typeof before, date: string) => week.find((d) => d.date === date)!;

const history = martaWeek.days.map((d) => d.log);
const show = (label: string, date: string, week: typeof before, result: {
    score: number;
    range: [number, number];
    confidence: { used: number; total: number };
    drivers: { label: string; direction: string; magnitude: number }[];
  },
) => {
  const day = dayOf(week, date);
  const plan = planForDay(result.score, day.tags, day.sessions);
  const drivers = result.drivers.map((d) => `${d.label} ${d.direction === 'up' ? '+' : '−'}${Math.round(d.magnitude)}`).join(', ');
  console.log(`${label} ${date}: ${plan}, ${result.score}, Likely ${result.range[0]}–${result.range[1]} | inputs ${result.confidence.used} of ${result.confidence.total} | tags ${day.tags.join('+')} | ${drivers}`);
};

// Monday morning: the scripted forecast. Rating `mon`, then the evening log (the move is not accepted yet).
const monday = martaWeek.days.find((d) => d.forecastFor === start)!.result;
show('Mon morning', start, before, monday);
const tueDate = addDays(start, 1);
const monLog = buildLog({ today: dayOf(before, start), tomorrow: dayOf(before, tueDate), answers: evening, readiness10: mon });
const tuesday = forecast(model, history, monLog);
history.push(monLog);
show('Tue morning', tueDate, before, tuesday);

// Tuesday morning: accept the move on Week, rate `tue`, then the evening log against the moved week.
console.log(`  move: ${move?.session} ${move?.fromDate} -> ${move?.toDate}`);
const wedDate = addDays(start, 2);
const tueLog = buildLog({ today: dayOf(after, tueDate), tomorrow: dayOf(after, wedDate), answers: evening, readiness10: tue });
const wednesday = forecast(model, history, tueLog);
show('Wed morning', wedDate, after, wednesday);
