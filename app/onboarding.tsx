// Layout plan. Job: say what Form is and let the person start, with or without an account. Focal element: the wordmark, alone in the
// upper field (REDESIGN-PROMPT §2.3 isolation). Quiet: the tagline, the horizon and its glyphs, the info icon.
// Concept A, "Dawn over the week" (§4.1, Q5). The actions sit together under the horizon, space as the connector, and the info icon moves
// to the top right so the bottom is not heavy (white-space audit E, 1 Oct). Left-aligned text (CLAUDE.md: centre only the dial and art).
// The sequence plays once per launch (GAP G52), ≤ 1.2 s, tap to skip; Reduce Motion shows the end state. The horizon glyphs are the
// demo week's real plans from the fixtures' calendar, never invented.
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Info from "lucide-react-native/icons/info";

import { copy } from "@copy";
import { LegalSheet } from "@features/LegalSheet";
import { useWeek } from "@features/useWeek";
import { WelcomeHorizon } from "@features/WelcomeHorizon";
import { useAppState } from "@state";
import { motion, scoreMaxFontScale, space } from "@tokens";
import { Button, IconButton, Text } from "@ui";

const LETTER_STAGGER = 0.12; // of the sequence, between one letter and the next
const LETTER_WINDOW = 0.3; // of the sequence, for one letter to appear

function Letter({
  char,
  index,
  progress,
}: {
  char: string;
  index: number;
  progress: SharedValue<number>;
}) {
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [index * LETTER_STAGGER, index * LETTER_STAGGER + LETTER_WINDOW],
      [0, 1],
      "clamp",
    ),
  }));
  return (
    <Animated.View style={style}>
      <Text variant="score" maxFontSizeMultiplier={scoreMaxFontScale}>
        {char}
      </Text>
    </Animated.View>
  );
}

export default function Welcome() {
  const router = useRouter();
  const app = useAppState();
  const reduceMotion = useReducedMotion();
  const { week } = useWeek();
  const params = useLocalSearchParams<{ at?: string; legal?: string }>();
  const [legal, setLegal] = useState(params.legal === "1");

  // Review only: ?at=0.4 holds the sequence at 40%.
  const held =
    params.at === undefined || Number.isNaN(Number(params.at))
      ? undefined
      : Math.min(Math.max(Number(params.at), 0), 1);
  // Decided once, on arrival: coming back to Welcome later in the launch shows the end state.
  const [play] = useState(
    () => held === undefined && !app.welcomePlayed && !reduceMotion,
  );
  const progress = useSharedValue(held ?? (play ? 0 : 1));
  const [playing, setPlaying] = useState(play);

  useEffect(() => {
    if (!play) return;
    app.markWelcomePlayed();
    progress.set(
      withTiming(1, {
        duration: motion.welcome.duration,
        easing: Easing.bezier(...motion.welcome.easing),
      }),
    );
    const done = setTimeout(() => setPlaying(false), motion.welcome.duration);
    return () => clearTimeout(done);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skip = () => {
    cancelAnimation(progress);
    progress.set(1);
    setPlaying(false);
  };

  const tagline = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.45, 0.8], [0, 1], "clamp"),
  }));
  const actions = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.7, 1], [0, 1], "clamp"),
  }));

  const startAccount = (mode: "signup" | "signin") => {
    app.setOnboardingPath("account");
    router.push(`/account?mode=${mode}`);
  };
  const startGuest = () => {
    app.setOnboardingPath("guest");
    router.push("/intro");
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Scrolls only when large text needs it; otherwise the stage fills the screen. */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.top}>
          <IconButton
            icon={Info}
            label={copy.welcome.legal}
            onPress={() => setLegal(true)}
          />
        </View>

        {/* Tap anywhere above the actions to skip the sequence. Not a control for screen readers: the sequence is short and silent. */}
        <Pressable
          style={styles.stage}
          onPress={skip}
          disabled={!playing}
          accessible={false}
        >
          <View style={styles.upper}>
            <View
              accessible
              accessibilityRole="header"
              accessibilityLabel={copy.welcome.wordmark}
              style={styles.wordmark}
            >
              {copy.welcome.wordmark.split("").map((char, i) => (
                <Letter
                  key={`${i}-${char}`}
                  char={char}
                  index={i}
                  progress={progress}
                />
              ))}
            </View>
            <Animated.View style={tagline}>
              <Text variant="body" tone="secondary">
                {copy.welcome.tagline}
              </Text>
            </Animated.View>
          </View>
          <WelcomeHorizon plans={week.map((d) => d.plan)} progress={progress} />
        </Pressable>

        <Animated.View
          style={[styles.actions, actions]}
          pointerEvents={playing ? "none" : "auto"}
        >
          {/* The one sage action. Liquid metal (a one-time sheen that settles) arrives in D3. */}
          <Button
            label={copy.welcome.createAccount}
            fullWidth
            onPress={() => startAccount("signup")}
          />
          <Button
            variant="text"
            label={copy.welcome.signIn}
            fullWidth
            onPress={() => startAccount("signin")}
          />
          <Button
            variant="text"
            label={copy.welcome.guest}
            fullWidth
            onPress={startGuest}
          />
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
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: space.margin - space.sm,
  },
  stage: { flex: 1, paddingHorizontal: space.margin, paddingBottom: space.xl },
  upper: {
    flex: 1,
    justifyContent: "center",
    gap: space.sm,
    paddingBottom: space.xl,
  },
  wordmark: { flexDirection: "row" },
  actions: {
    paddingHorizontal: space.margin,
    paddingBottom: space.md,
    gap: space.xxs,
  },
});
