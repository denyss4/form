// Layout plan. Job: review the range bar and the row that uses it, including a day outside the likely range. Focal element: the two markers.
// Quiet: the legend. The forecast and the likely range are Marta's real model output for one morning; only the felt value is moved, to show each state.
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { copy } from '@copy';
import { martaWeek } from '@fixtures';
import { PairRow } from '@features/PairRow';
import { RangeLegend } from '@features/RangeBar';
import type { Pair } from '@planner/progress';
import { DevPicker, GalleryScreen, oneOf, Section } from '@ui';

type Felt = 'inside' | 'below' | 'above' | 'edge';

const day = martaWeek.days.find((d) => d.forecastFor === martaWeek.meta.demoToday) ?? martaWeek.days[martaWeek.days.length - 1];
const [lo, hi] = day.result.range;
const feltFor: Record<Felt, number> = {
  inside: day.result.score,
  below: Math.max(0, lo - 10),
  above: Math.min(100, hi + 10),
  edge: lo,
};

export default function RangeGallery() {
  const params = useLocalSearchParams<{ felt?: string }>();
  const [felt, setFelt] = useState<Felt>(oneOf(params.felt, ['inside', 'below', 'above', 'edge'] as const, 'below'));
  const r = copy.dev.range;
  const pair: Pair = { date: day.forecastFor, forecast: day.result.score, range: day.result.range, felt: feltFor[felt] };

  return (
    <GalleryScreen title={copy.dev.hub.range} note={r.note}>
      <DevPicker
        label={copy.feltVsForecast.legend.felt}
        options={[
          { value: 'inside', label: r.states.inside },
          { value: 'below', label: r.states.below },
          { value: 'above', label: r.states.above },
          { value: 'edge', label: r.states.edge },
        ]}
        value={felt}
        onChange={setFelt}
      />
      <Section title={copy.feltVsForecast.title}>
        <RangeLegend />
        <PairRow pair={pair} divider={false} />
      </Section>
    </GalleryScreen>
  );
}
