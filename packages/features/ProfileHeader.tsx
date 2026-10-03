// Layout plan. Job: say whose Form this is (REDESIGN-PROMPT §5 header; design from the Any Distance references, not their content).
// Focal element: the capsule avatar, with nothing else within 32 pt (gallery isolation). Quiet: the dimmed backdrop, the email.
// - Backdrop: the Welcome horizon, static, at 30% and without its glow (no glow on Profile, white-space audit E), fading into the canvas
//   by the middle of the avatar. No people, no photos.
// - Name: on a gentle arc above the avatar, Manrope 600, letter-spaced, in capitals: the one display exception to sentence case
//   (DECISIONS, D2). Screen readers hear the name once, as plain text, with the email.
// - Avatar: a capsule (112 × 168) that echoes the pills and the week-strip columns: the photo, or initials on a hollow fill.
// The header is centred as one composition, like the dial (CLAUDE.md centres the dial and art only); everything below it is left-aligned.
import { Image, StyleSheet, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Path, Rect, Stop, Text as SvgText, TextPath } from 'react-native-svg';

import { copy } from '@copy';
import { useWeek } from '@features/useWeek';
import { WelcomeHorizon } from '@features/WelcomeHorizon';
import { initials } from '@state/profile';
import { font, opacity, radius, size, space, titleMaxFontScale, type } from '@tokens';
import { Text, useTheme } from '@ui';

const ARC_HEIGHT = space.xxl; // room for the name above the capsule
const ARC_WIDTH = size.avatar.capsuleWidth * 2; // the arc spans twice the capsule, so the name curves gently
const NAME_TRACKING = space.xxs; // letter-spacing for the capitals
const BACKDROP_HEIGHT = ARC_HEIGHT + size.avatar.capsuleHeight / 2; // fades out by the middle of the avatar

export function ProfileHeader({ name, email, photo }: { name: string; email: string; photo: string | null }) {
  const { color } = useTheme();
  const { week } = useWeek();
  const settled = useSharedValue(1); // the horizon's end state, static

  // A shallow arc from the left end to the right end, peaking at the top centre.
  const arc = `M 0 ${ARC_HEIGHT} Q ${ARC_WIDTH / 2} 0 ${ARC_WIDTH} ${ARC_HEIGHT}`;

  return (
    <View accessible accessibilityLabel={name.trim() ? copy.profile.nameA11y(name, email) : email} style={styles.wrap}>
      <View pointerEvents="none" style={styles.backdrop}>
        <View style={[styles.horizon, { opacity: opacity.horizon }]}>
          <WelcomeHorizon plans={week.map((d) => d.plan)} progress={settled} glow={false} />
        </View>
        <Svg style={StyleSheet.absoluteFill} width="100%" height={BACKDROP_HEIGHT}>
          <Defs>
            <LinearGradient id="profile-fade" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={color.bg.canvas} stopOpacity={0} />
              <Stop offset="0.45" stopColor={color.bg.canvas} stopOpacity={0} />
              <Stop offset="1" stopColor={color.bg.canvas} stopOpacity={1} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height={BACKDROP_HEIGHT} fill="url(#profile-fade)" />
        </Svg>
      </View>

      <Svg width={ARC_WIDTH} height={ARC_HEIGHT}>
        <Defs>
          <Path id="name-arc" d={arc} />
        </Defs>
        <SvgText
          fill={color.text.primary}
          fontFamily={font.display600}
          fontSize={type.plan.fontSize}
          letterSpacing={NAME_TRACKING}
          textAnchor="middle"
        >
          <TextPath href="#name-arc" startOffset="50%">
            {name.toUpperCase()}
          </TextPath>
        </SvgText>
      </Svg>

      <View style={[styles.capsule, { borderColor: color.stroke.control, backgroundColor: color.bg.canvas }]}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} accessibilityIgnoresInvertColors />
        ) : (
          // Manrope 600 at the title size (REDESIGN-PROMPT §5: initials in Manrope 600).
          <Text variant="title" style={styles.initials}>
            {initials(name, email)}
          </Text>
        )}
      </View>

      {/* An email cannot wrap (no spaces), so it stops growing at 2x text, like titles; at 2x it fits 390 pt. */}
      <Text variant="body" tone="secondary" style={styles.email} maxFontSizeMultiplier={titleMaxFontScale}>
        {email}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, height: BACKDROP_HEIGHT, justifyContent: 'center' },
  horizon: { width: '100%' },
  capsule: {
    width: size.avatar.capsuleWidth,
    height: size.avatar.capsuleHeight,
    borderRadius: radius.full,
    borderWidth: size.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photo: { width: size.avatar.capsuleWidth, height: size.avatar.capsuleHeight },
  email: { marginTop: space.sm, textAlign: 'center' },
  initials: { fontFamily: font.display600 },
});
