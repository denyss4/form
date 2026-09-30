// Layout plan. Job: review every button variant in every state. Focal element: the button. Quiet: state captions.
import { StyleSheet, View } from 'react-native';

import { copy } from '@copy';
import { space } from '@tokens';
import { Button, GalleryScreen, Section, Text, type ButtonProps } from '@ui';

const variants = ['primary', 'secondary', 'text'] as const;

export default function ButtonGallery() {
  const b = copy.dev.button;
  const states: { label: string; props: Partial<ButtonProps> }[] = [
    { label: b.states.default, props: {} },
    { label: b.states.pressed, props: { forceState: 'pressed' } },
    { label: b.states.focused, props: { forceState: 'focused' } },
    { label: b.states.disabled, props: { disabled: true } },
    { label: b.states.loading, props: { loading: true } },
  ];

  return (
    <GalleryScreen title={copy.dev.hub.button} note={b.note}>
      {variants.map((variant) => (
        <Section key={variant} title={b[variant]}>
          {states.map((state) => (
            <View key={state.label} style={styles.item}>
              <Text variant="caption" tone="secondary">
                {state.label}
              </Text>
              <Button label={b.sample} variant={variant} {...state.props} />
            </View>
          ))}
        </Section>
      ))}
    </GalleryScreen>
  );
}

const styles = StyleSheet.create({
  item: { gap: space.xxs },
});
