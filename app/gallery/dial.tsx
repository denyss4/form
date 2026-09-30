// Layout plan. Job: review the dial in every size and state. Focal element: the app-size dial on its plan field.
// Quiet: widget and watch sizes, the extreme cases. Scores and ranges come from Marta's fixtures (real predict output).
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { copy } from '@copy';
import { martaWeek } from '@fixtures';
import { planIds, radius, space, type PlanId } from '@tokens';
import { DevPicker, GalleryScreen, oneOf, PlanLabel, ScoreDial, Section, Text, useTheme } from '@ui';

type StateKey = 'today' | 'low' | 'high' | 'day1';
const stateKeys: StateKey[] = ['today', 'low', 'high', 'day1'];

const days = martaWeek.days;
const byScore = [...days].sort((a, b) => a.result.score - b.result.score);
const picks = {
  today: days.find((d) => d.forecastFor === martaWeek.meta.demoToday) ?? days[days.length - 1],
  low: byScore[0],
  high: byScore[byScore.length - 1],
};

export default function DialGallery() {
  const { color } = useTheme();
  const params = useLocalSearchParams<{ plan?: string; state?: string }>();
  const [plan, setPlan] = useState<PlanId>(oneOf(params.plan, planIds, 'light'));
  const [state, setState] = useState<StateKey>(oneOf(params.state, stateKeys, 'today'));
  const d = copy.dev.dial;

  const day = state === 'day1' ? null : picks[state];
  const score = day ? day.result.score : null;
  const range = day ? day.result.range : undefined;

  return (
    <GalleryScreen title={copy.dev.hub.dial} note={d.note}>
      <DevPicker
        label={d.plan}
        options={planIds.map((p) => ({ value: p, label: copy.plan[p] }))}
        value={plan}
        onChange={setPlan}
      />
      <DevPicker
        label={d.state}
        options={stateKeys.map((k) => ({ value: k, label: d.states[k] }))}
        value={state}
        onChange={setState}
      />

      <Section title={d.app} note={day ? d.forecastFor(day.forecastFor) : undefined}>
        <View style={[styles.field, { backgroundColor: color.plan[plan].field }]}>
          <ScoreDial score={score} range={range} plan={plan} />
          <Text variant="caption" tone="secondary">
            {range ? copy.range(range[0], range[1]) : copy.dial.empty}
          </Text>
          <PlanLabel plan={plan} />
        </View>
      </Section>

      <Section title={d.small}>
        <View style={styles.row}>
          <ScoreDial score={score} range={range} plan={plan} dial="widget" />
          <ScoreDial score={score} range={range} plan={plan} dial="watch" />
        </View>
      </Section>

      <Section title={d.extremes}>
        <View style={styles.row}>
          <ScoreDial score={0} range={[0, 17]} plan={plan} dial="widget" />
          <ScoreDial score={100} range={[83, 100]} plan={plan} dial="widget" />
          <ScoreDial score={null} plan={plan} dial="widget" />
        </View>
      </Section>
    </GalleryScreen>
  );
}

const styles = StyleSheet.create({
  field: {
    alignItems: 'center',
    gap: space.sm,
    padding: space.lg,
    borderRadius: radius.sheet,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space.lg },
});
