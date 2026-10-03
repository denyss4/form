// One consent purpose (GDPR Art. 9): its name on one line, the details behind "What this means", and Not now / Allow with equal weight
// (first-launch plan, 3 Oct, item 12). Shared by onboarding's consent screen and Profile › Privacy, so withdrawing is the same control as
// giving. Nothing is preselected. The details open in place; screen readers hear the toggle as expanded or collapsed.
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import ChevronDown from 'lucide-react-native/icons/chevron-down';
import ChevronUp from 'lucide-react-native/icons/chevron-up';

import { copy } from '@copy';
import { useAppState, type Purpose } from '@state';
import { answerOptions } from '@state/answers';
import { size, space } from '@tokens';
import { ChoiceGroup, FocusRing, Text, useFocus, useIconSize, useTheme } from '@ui';

export function PurposeChoice({ purpose }: { purpose: Purpose }) {
  const { color } = useTheme();
  const app = useAppState();
  const focus = useFocus();
  const iconPx = useIconSize(size.iconSm);
  const [open, setOpen] = useState(false);
  const { name, what } = copy.consent.purposes[purpose];
  const Chevron = open ? ChevronUp : ChevronDown;
  return (
    <View style={styles.group}>
      <View style={styles.head}>
        <Text variant="bodyStrong" accessibilityRole="header" style={styles.name}>
          {name}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${copy.consent.whatThisMeans}, ${name}`}
          accessibilityState={{ expanded: open }}
          onPress={() => setOpen((v) => !v)}
          onFocus={focus.onFocus}
          onBlur={focus.onBlur}
          hitSlop={{ top: space.xs, bottom: space.xs }}
          style={styles.toggle}
        >
          <Text variant="caption">{copy.consent.whatThisMeans}</Text>
          <Chevron color={color.text.primary} size={iconPx} strokeWidth={size.outline} />
          <FocusRing visible={focus.focused} />
        </Pressable>
      </View>
      {open ? (
        <Text variant="caption" tone="secondary">
          {what}
        </Text>
      ) : null}
      <ChoiceGroup label={name} options={answerOptions} value={app.consents[purpose]} onChange={(answer) => app.setConsent(purpose, answer)} />
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: space.sm },
  head: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', columnGap: space.sm },
  name: { flexShrink: 1 },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: space.xxs, minHeight: size.touch - space.md },
});
