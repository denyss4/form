// Layout plan. Job: review the four plan glyphs and labels. Focal element: glyph plus label. Quiet: the field it sits on.
import { StyleSheet, View } from 'react-native';

import { copy } from '@copy';
import { useWeek } from '@features/useWeek';
import { WeekStrip } from '@features/WeekStrip';
import { planIds, radius, space } from '@tokens';
import { GalleryScreen, PlanGlyph, PlanLabel, Section, Text, useTheme } from '@ui';

export default function PlanGallery() {
  const { color } = useTheme();
  const p = copy.dev.plan;
  // A thin calendar (Monday only), with today set to the estimated Tuesday and selected: the one combination the demo data never shows.
  const { week } = useWeek('lowconf');
  const tuesday = week[1]?.date ?? '';

  return (
    <GalleryScreen title={copy.dev.hub.plan} note={p.note}>
      <Section title={p.onCanvas}>
        {planIds.map((plan) => (
          <PlanLabel key={plan} plan={plan} />
        ))}
      </Section>

      <Section title={p.onField}>
        {planIds.map((plan) => (
          <View key={plan} style={[styles.field, { backgroundColor: color.plan[plan].field }]}>
            <PlanLabel plan={plan} />
          </View>
        ))}
      </Section>

      <Section title={p.estimated}>
        {planIds.map((plan) => (
          <PlanLabel key={plan} plan={plan} estimated />
        ))}
      </Section>

      <Section title={p.stripCombo}>
        <WeekStrip week={week} today={tuesday} selected={tuesday} outlined={[]} move={null} onSelect={() => {}} />
      </Section>

      <Section title={p.glyphs}>
        {planIds.map((plan) => (
          <View key={plan} style={styles.row}>
            <PlanGlyph plan={plan} />
            <PlanGlyph plan={plan} small />
            <Text variant="caption" tone="secondary">
              {copy.plan[plan]}
            </Text>
          </View>
        ))}
      </Section>
    </GalleryScreen>
  );
}

const styles = StyleSheet.create({
  field: { padding: space.md, borderRadius: radius.sheet },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md },
});
