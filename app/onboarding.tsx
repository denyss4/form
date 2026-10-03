// Layout plan. Job: say what Form is and let the person start, with or without an account. Focal element: the wordmark, alone in the
// upper field (REDESIGN-PROMPT §2.3 isolation). Quiet: the tagline, the horizon and its glyphs, the info icon.
// Concept A, "Dawn over the week" (§4.1, Q5). The actions sit together under the horizon, space as the connector, and the info icon moves
// to the top right so the bottom is not heavy (white-space audit E, 1 Oct). The logo and tagline are centred (user, 2 Oct, D5: an exception to CLAUDE.md's left-align rule, like the dial).
// The sequence plays once per launch (GAP G52), ≤ 1.2 s, tap to skip; Reduce Motion shows the end state. The horizon glyphs are the
// demo week's real plans from the fixtures' calendar, never invented.
// The wordmark is the Form logo (D5). It only fades in here: the launch screen has just assembled it stroke by stroke, and assembling
// it twice in two seconds would repeat the moment.
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Info from 'lucide-react-native/icons/info';

import { copy } from '@copy';
import { LegalSheet } from '@features/LegalSheet';
import { useWeek } from '@features/useWeek';
import { WelcomeHorizon } from '@features/WelcomeHorizon';
import { useAppState } from '@state';
import { motion, space } from '@tokens';
import { Button, IconButton, LiquidMetalButton, Logo, Text } from '@ui';

const LOGO_WIDTH = space.xxxl * 3; // 192 pt, the launch screen's size, so the logo reads as the same object

export default function Welcome() {
  const router = useRouter();
  const app = useAppState();
  const reduceMotion = useReducedMotion();
  const { week } = useWeek();
  const params = useLocalSearchParams<{ at?: string; legal?: string }>();
  const [legal, setLegal] = useState(params.legal === '1');

  // Review only: ?at=0.4 holds the sequence at 40%.
  const held = params.at === undefined || Number.isNaN(Number(params.at)) ? undefined : Math.min(Math.max(Number(params.at), 0), 1);
  // Decided once, on arrival: coming back to Welcome later in the launch shows the end state.
  const [play] = useState(() => held === undefined && !app.welcomePlayed && !reduceMotion);
  const progress = useSharedValue(held ?? (play ? 0 : 1));
  const [playing, setPlaying] = useState(play);
  const settle = () => setPlaying(false);

  useEffect(() => {
    if (!play) return;
    app.markWelcomePlayed();
    progress.set(
      withTiming(1, {
        duration: motion.welcome.duration,
        easing: Easing.bezier(...motion.welcome.easing),
      }),
    );
    const done = setTimeout(settle, motion.welcome.duration);
    return () => clearTimeout(done);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skip = () => {
    cancelAnimation(progress);
    progress.set(1);
    settle();
  };

  const logo = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.35], [0, 1], 'clamp'),
  }));
  const tagline = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.45, 0.8], [0, 1], 'clamp'),
  }));
  const actions = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.7, 1], [0, 1], 'clamp'),
  }));

  const startAccount = (mode: 'signup' | 'signin') => {
    app.setOnboardingPath('account');
    router.push(mode === 'signup' ? '/sign-up' : '/sign-in');
  };
  const startGuest = () => {
    app.setOnboardingPath('guest');
    router.push('/intro');
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Scrolls only when large text needs it; otherwise the stage fills the screen. */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.top}>
          <IconButton icon={Info} label={copy.welcome.legal} onPress={() => setLegal(true)} />
        </View>

        {/* Tap anywhere above the actions to skip the sequence. Not a control for screen readers: the sequence is short and silent. */}
        <Pressable style={styles.stage} onPress={skip} disabled={!playing} accessible={false}>
          <View style={styles.upper}>
            <Animated.View style={[styles.wordmark, logo]}>
              <Logo width={LOGO_WIDTH} label={copy.welcome.wordmark} header />
            </Animated.View>
            <Animated.View style={tagline}>
              <Text variant="body" tone="secondary" style={styles.centred}>
                {copy.welcome.tagline}
              </Text>
            </Animated.View>
          </View>
          <WelcomeHorizon plans={week.map((d) => d.plan)} progress={progress} />
        </Pressable>

        <Animated.View style={[styles.actions, actions]} pointerEvents={playing ? 'none' : 'auto'}>
          {/* Liquid metal (D5, the user's picks 4B and 10): the real WebGL shader in the rim of a dark pill; the screen's one action. */}
          <LiquidMetalButton label={copy.welcome.createAccount} onPress={() => startAccount('signup')} />
          <Button variant="text" label={copy.welcome.signIn} fullWidth onPress={() => startAccount('signin')} />
          <Button variant="text" label={copy.welcome.guest} fullWidth onPress={startGuest} />
        </Animated.View>
      </ScrollView>

      <LegalSheet visible={legal} onClose={() => setLegal(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flexGrow: 1 },
  top: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: space.margin - space.sm,
  },
  stage: { flex: 1, paddingHorizontal: space.margin, paddingBottom: space.xl },
  upper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: space.sm,
    paddingBottom: space.xl,
  },
  wordmark: { marginBottom: space.xs },
  centred: { textAlign: 'center' },
  actions: {
    paddingHorizontal: space.margin,
    paddingBottom: space.md,
    gap: space.xxs,
  },
});
