// Layout plan. Job: show what Form gives in three slides, slide 1 carrying the whole value alone (REDESIGN-PROMPT §4.2). Focal element:
// each slide's real Form object (a result, the week strip, the log). Quiet: Skip, the page dots.
// A plain canvas behind every slide: no dimmed chips or glyphs, which competed with the focal object (white-space audit E, 1 Oct, against
// §4.2's "dimmed" background). Skip is always visible. Screen readers hear "Page 1 of 3" on each change.
// Every value shown is the demo's first morning from the fixtures (Train light, 51, Likely 34–68), never an invented number.
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Check from 'lucide-react-native/icons/check';

import { copy } from '@copy';
import { martaWeek } from '@fixtures';
import { useWeek } from '@features/useWeek';
import { WeekStrip } from '@features/WeekStrip';
import { radius, size, space, titleMaxFontScale } from '@tokens';
import { announce, Button, PlanLabel, Text, useIconSize, useTheme } from '@ui';

const slides = copy.intro.slides;
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

function WeekSample() {
  const { week } = useWeek();
  return (
    <View accessible accessibilityLabel={copy.intro.weekA11y} pointerEvents="none">
      <View importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
        <WeekStrip week={week} today={today} selected={today} outlined={[]} move={null} onSelect={() => {}} />
      </View>
    </View>
  );
}

function LogSample() {
  const { color } = useTheme();
  const iconPx = useIconSize(size.iconSm);
  return (
    <View accessible accessibilityLabel={copy.intro.logA11y} style={[styles.surface, { backgroundColor: color.bg.raised }]}>
      {copy.intro.logRows.map((row) => (
        <View key={row} style={styles.logRow}>
          <Check color={color.text.primary} size={iconPx} strokeWidth={size.outline} />
          <Text variant="body">{row}</Text>
        </View>
      ))}
    </View>
  );
}

const illustrations = [ResultChip, WeekSample, LogSample];

export default function Intro() {
  const { color } = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{ page?: string }>();
  const scroller = useRef<ScrollView>(null);
  const initial = Math.min(Math.max(Number(params.page ?? 1) - 1 || 0, 0), slides.length - 1);
  const [page, setPage] = useState(initial);
  const last = page === slides.length - 1;

  const toConsent = () => router.push('/consent');

  const settle = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / Math.max(width, 1));
    if (next !== page) {
      setPage(next);
      announce(copy.intro.page(next + 1, slides.length));
    }
  };

  const next = () => {
    if (last) return toConsent();
    scroller.current?.scrollTo({ x: (page + 1) * width, animated: true });
    setPage(page + 1);
    announce(copy.intro.page(page + 2, slides.length));
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <View style={styles.top}>
        <Button variant="text" label={copy.intro.skip} onPress={toConsent} />
      </View>

      <ScrollView
        ref={scroller}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        // Review only (?page=2): open on that slide. contentOffset is ignored on the web, so scroll once the pager has a size.
        onLayout={() => {
          if (initial > 0) scroller.current?.scrollTo({ x: initial * width, animated: false });
        }}
        onMomentumScrollEnd={settle}
        style={styles.pager}
      >
        {slides.map((slide, i) => {
          const Illustration = illustrations[i];
          return (
            <ScrollView
              key={slide.title}
              style={{ width }}
              contentContainerStyle={styles.slide}
              accessibilityLabel={copy.intro.page(i + 1, slides.length)}
            >
              <View style={styles.illustration}>{Illustration ? <Illustration /> : null}</View>
              <View style={styles.text}>
                <Text variant="title" accessibilityRole="header" maxFontSizeMultiplier={titleMaxFontScale}>
                  {slide.title}
                </Text>
                <Text variant="body" tone="secondary">
                  {slide.body}
                </Text>
              </View>
            </ScrollView>
          );
        })}
      </ScrollView>

      <View style={styles.bottom}>
        <View style={styles.dots} accessible accessibilityLabel={copy.intro.page(page + 1, slides.length)}>
          {slides.map((slide, i) => (
            <View
              key={slide.title}
              style={[
                styles.dot,
                i === page
                  ? { backgroundColor: color.text.primary, borderColor: color.text.primary }
                  : { borderColor: color.stroke.control },
              ]}
            />
          ))}
        </View>
        <Button label={last ? copy.intro.done : copy.intro.next} fullWidth onPress={next} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  top: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: space.margin - space.sm },
  pager: { flex: 1 },
  slide: { flexGrow: 1, paddingHorizontal: space.margin, paddingVertical: space.lg, justifyContent: 'center', gap: space.xl },
  illustration: { minHeight: space.xxxl * 3, justifyContent: 'center' },
  text: { gap: space.sm },
  surface: { borderRadius: radius.surface, padding: space.md, gap: space.sm },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', gap: space.sm, flexWrap: 'wrap' },
  logRow: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  bottom: { paddingHorizontal: space.margin, paddingBottom: space.md, gap: space.lg },
  dots: { flexDirection: 'row', gap: space.xs },
  dot: { width: space.xs, height: space.xs, borderRadius: radius.full, borderWidth: size.hairline },
});
