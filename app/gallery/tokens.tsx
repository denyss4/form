// Layout plan. Job: review every token and re-verify contrast. Focal element: the contrast table. Quiet: swatches and specimens.
import { StyleSheet, View } from 'react-native';

import { copy } from '@copy';
import { motion, planIds, radius, shadow, size, space } from '@tokens';
import { contrastRatio, GalleryScreen, Section, Text, useTheme } from '@ui';

export default function Tokens() {
  const { color } = useTheme();
  const t = copy.dev.tokens;

  const swatches = [
    { name: 'bg.canvas', value: color.bg.canvas },
    { name: 'bg.raised', value: color.bg.raised },
    { name: 'text.primary', value: color.text.primary },
    { name: 'text.secondary', value: color.text.secondary },
    { name: 'stroke.control', value: color.stroke.control },
    { name: 'stroke.hairline', value: color.stroke.hairline },
    ...planIds.flatMap((plan) => [
      { name: `plan.${plan}.base`, value: color.plan[plan].base },
      { name: `plan.${plan}.field`, value: color.plan[plan].field },
    ]),
  ];

  const text = 4.5;
  const graphic = 3;
  const pairs = [
    { name: 'text.primary on bg.canvas', fg: color.text.primary, bg: color.bg.canvas, min: text },
    { name: 'bg.canvas on text.primary (primary button)', fg: color.bg.canvas, bg: color.text.primary, min: text },
    { name: 'text.secondary on bg.canvas', fg: color.text.secondary, bg: color.bg.canvas, min: text },
    { name: 'text.secondary on bg.raised', fg: color.text.secondary, bg: color.bg.raised, min: text },
    { name: 'stroke.control on bg.canvas', fg: color.stroke.control, bg: color.bg.canvas, min: graphic },
    { name: 'stroke.control on bg.raised', fg: color.stroke.control, bg: color.bg.raised, min: graphic },
    ...planIds.flatMap((plan) => [
      { name: `plan.${plan} on bg.canvas`, fg: color.plan[plan].base, bg: color.bg.canvas, min: text },
      { name: `plan.${plan} on its field`, fg: color.plan[plan].base, bg: color.plan[plan].field, min: text },
      { name: `text.primary on ${plan} field`, fg: color.text.primary, bg: color.plan[plan].field, min: text },
      { name: `text.secondary on ${plan} field`, fg: color.text.secondary, bg: color.plan[plan].field, min: text },
      { name: `stroke.control on ${plan} field`, fg: color.stroke.control, bg: color.plan[plan].field, min: graphic },
    ]),
  ];

  const sizes = [
    ['touch', size.touch],
    ['hairline', size.hairline],
    ['outline', size.outline],
    ['focusOffset', size.focusOffset],
    ['icon', size.icon],
    ['iconSm', size.iconSm],
    ['dial.app', size.dial.app.diameter],
    ['dial.widget', size.dial.widget.diameter],
    ['dial.watch', size.dial.watch.diameter],
  ] as const;

  return (
    <GalleryScreen title={copy.dev.hub.tokens} note={t.note}>
      <Section title={t.colour}>
        {swatches.map((s) => (
          <View key={s.name} style={styles.row}>
            <View
              style={[
                styles.swatch,
                { backgroundColor: s.value, borderColor: color.stroke.control },
              ]}
            />
            <View style={styles.grow}>
              <Text variant="bodyStrong">{s.name}</Text>
              <Text variant="caption" tone="secondary">
                {s.value}
              </Text>
            </View>
          </View>
        ))}
      </Section>

      <Section title={t.contrast} note={t.contrastNote}>
        {pairs.map((p) => {
          const ratio = contrastRatio(p.fg, p.bg);
          const ok = ratio >= p.min;
          return (
            <View key={p.name} style={styles.row}>
              <Text variant="caption" style={styles.grow}>
                {p.name}
              </Text>
              <Text variant="caption" tabular>
                {ratio.toFixed(2)}:1
              </Text>
              <Text variant="caption" tone={ok ? 'secondary' : 'primary'} style={ok ? undefined : styles.fail}>
                {ok ? t.pass : t.fail}
              </Text>
            </View>
          );
        })}
      </Section>

      <Section title={t.spacing}>
        {Object.entries(space).map(([name, value]) => (
          <View key={name} style={styles.row}>
            <Text variant="caption" style={styles.spaceName}>
              {name}
            </Text>
            <View style={{ width: value, height: space.xs, backgroundColor: color.text.primary }} />
            <Text variant="caption" tone="secondary" tabular>
              {value}
            </Text>
          </View>
        ))}
      </Section>

      <Section title={t.radius}>
        <View style={styles.row}>
          {Object.entries(radius).map(([name, value]) => (
            <View key={name} style={styles.radiusItem}>
              <View
                style={{
                  width: size.touch,
                  height: size.touch,
                  borderRadius: value,
                  borderWidth: size.outline,
                  borderColor: color.text.primary,
                }}
              />
              <Text variant="caption">{name}</Text>
              <Text variant="caption" tone="secondary" tabular>
                {value}
              </Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title={t.shadow} note={t.shadowNote}>
        <View
          style={[
            styles.sheet,
            shadow.sheet,
            { backgroundColor: color.bg.raised },
          ]}
        >
          <Text variant="bodyStrong">shadow.sheet</Text>
        </View>
      </Section>

      <Section title={t.motion}>
        <Text variant="caption">
          press {motion.press.duration} ms, scale {motion.press.scale}, opacity {motion.press.opacity}
        </Text>
        <Text variant="caption">quick {motion.quick.duration} ms, ease-out cubic</Text>
        <Text variant="caption">
          standard spring, damping {motion.standard.damping}, stiffness {motion.standard.stiffness}
        </Text>
        <Text variant="caption">reveal {motion.reveal.duration} ms, ease-in-out, once per day</Text>
        <Text variant="caption">reduced motion: fade {motion.reducedFade} ms</Text>
      </Section>

      <Section title={t.sizes}>
        {sizes.map(([name, value]) => (
          <View key={name} style={styles.row}>
            <Text variant="caption" style={styles.grow}>
              {name}
            </Text>
            <Text variant="caption" tone="secondary" tabular>
              {value}
            </Text>
          </View>
        ))}
      </Section>
    </GalleryScreen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  grow: { flex: 1 },
  swatch: { width: size.touch, height: size.touch, borderRadius: radius.control, borderWidth: size.hairline },
  spaceName: { width: space.xxxl },
  radiusItem: { alignItems: 'center', gap: space.xxs },
  sheet: {
    minHeight: size.touch * 2,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    padding: space.md,
  },
  fail: { textDecorationLine: 'underline' },
});
