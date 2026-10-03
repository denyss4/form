// Layout plan. Job: show what Form gives, on one screen (first-launch plan, 3 Oct, item 4: the carousel keeps slide 1 only). Focal
// element: a real Form result. Quiet: the line under the title. No pager, no dots, no Skip: Continue is the only way on, and does the same.
// A plain canvas, no dimmed chips or glyphs behind the result (white-space audit E, 1 Oct).
// Every value shown is the demo's first morning from the fixtures (Train light, 51, Likely 34–68), never an invented number.
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { martaWeek } from '@fixtures';
import { useWeek } from '@features/useWeek';
import { radius, space, titleMaxFontScale } from '@tokens';
import { Button, PlanLabel, Text, useTheme } from '@ui';

const today = martaWeek.meta.demoToday;
const example = martaWeek.days.find((d) => d.forecastFor === today) ?? martaWeek.days[martaWeek.days.length - 1];

function ResultChip() {
  const { color } = useTheme();
  const { week } = useWeek();
  const plan = week.find((d) => d.date === today)?.plan ?? 'light';
  const { score, range } = example.result;
  return (
    <View
      accessible
      accessibilityLabel={copy.intro.chipA11y(copy.plan[plan], score, range[0], range[1])}
      style={[styles.surface, { backgroundColor: color.bg.raised }]}
    >
      <PlanLabel plan={plan} />
      <View style={styles.scoreRow}>
        <Text variant="title" tabular>
          {score}
        </Text>
        <Text variant="body" tone="secondary" tabular>
          {copy.range(range[0], range[1])}
        </Text>
      </View>
    </View>
  );
}

export default function Intro() {
  const { color } = useTheme();
  const router = useRouter();
  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <ResultChip />
        <View style={styles.text}>
          <Text variant="title" accessibilityRole="header" maxFontSizeMultiplier={titleMaxFontScale}>
            {copy.intro.title}
          </Text>
          <Text variant="body" tone="secondary">
            {copy.intro.body}
          </Text>
        </View>
      </ScrollView>
      <View style={styles.bottom}>
        <Button label={copy.intro.done} fullWidth onPress={() => router.push('/consent')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: space.margin, paddingVertical: space.lg, justifyContent: 'center', gap: space.xxl },
  text: { gap: space.sm },
  surface: { borderRadius: radius.surface, padding: space.md, gap: space.sm },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', gap: space.sm, flexWrap: 'wrap' },
  bottom: { paddingHorizontal: space.margin, paddingBottom: space.md },
});
