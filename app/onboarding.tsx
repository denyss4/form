// Layout plan. Job: say what Form does and start. Focal element: the intro mark that becomes the dial. Quiet: the notice.
// One primary action in the thumb zone. No hero copy, no illustration beyond the product's own dial (5.5 #7, #10).
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { copy } from '@copy';
import { martaWeek } from '@fixtures';
import { space } from '@tokens';
import { Button, IntroMark, Text, useTheme } from '@ui';

// The example day is real model output from the fixtures (the demo's first morning), never an invented number.
const example = martaWeek.days.find((d) => d.forecastFor === martaWeek.meta.demoToday) ?? martaWeek.days[martaWeek.days.length - 1];

export default function Onboarding() {
  const { color } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ intro?: string }>();

  // ?intro=0.3 holds the intro at 30% for review.
  const held = params.intro === undefined || Number.isNaN(Number(params.intro))
    ? undefined
    : Math.min(Math.max(Number(params.intro), 0), 1);

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.mark}>
          <IntroMark
            progress={held}
            sample={{ score: example.result.score, range: example.result.range }}
            caption={copy.onboarding.example}
            description={copy.onboarding.exampleA11y(example.result.score, example.result.range[0], example.result.range[1])}
          />
        </View>
        <Text variant="title" accessibilityRole="header">
          {copy.onboarding.title}
        </Text>
        <Text variant="body" tone="secondary">
          {copy.onboarding.intro}
        </Text>
        <View style={styles.points}>
          {copy.onboarding.points.map((point) => (
            <Text key={point} variant="body">
              {point}
            </Text>
          ))}
        </View>
      </ScrollView>
      <View style={styles.actions}>
        <Button label={copy.onboarding.start} fullWidth onPress={() => router.push('/consent')} />
        <Text variant="caption" tone="secondary">
          {copy.onboarding.notice}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingHorizontal: space.margin,
    paddingTop: space.lg,
    paddingBottom: space.lg,
    gap: space.md,
  },
  mark: { alignItems: 'center', marginBottom: space.lg },
  points: { marginTop: space.md, gap: space.sm },
  actions: {
    paddingHorizontal: space.margin,
    paddingBottom: space.md,
    gap: space.sm,
  },
});
