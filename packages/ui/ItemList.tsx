// D5 (the user's pick), shadcn Item list, item-19): an activity list rebuilt for a phone. Each row: a 32 pt icon tile (sunken, hairline edge),
// a title and a muted line under it, and a short muted note on the right (the original's "2m ago"). Hairline separators between rows,
// as in the original; Form removed row dividers on Progress in D4 (white-space critique), so this brings them back on purpose for the
// comparison. Rows are left-aligned to the screen margin (no inner side padding: CLAUDE.md, left-align). Each row reads as one sentence.
// Text wraps, never truncates (the original clamps the description to two lines; CLAUDE.md keeps Dynamic Type text whole).
import { Fragment, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { radius, size, space } from '@tokens';

import { Text } from './Text';
import { useTheme } from './theme';

export interface ListItem {
  key: string;
  media: ReactNode;
  title: string;
  description: string;
  /** The exception to notice (Progress: a day that did not fit): the description in Text High, bold, instead of muted. */
  emphasis?: boolean;
  note: string;
  spoken: string;
}

const TILE = space.xl; // 32 pt, the original's size-8

export function ItemList({ items }: { items: ListItem[] }) {
  const { color } = useTheme();
  return (
    <View accessibilityRole="list">
      {items.map((item, i) => (
        <Fragment key={item.key}>
          <View accessible accessibilityLabel={item.spoken} style={styles.item}>
            <View style={[styles.tile, { backgroundColor: color.bg.sunken, borderColor: color.stroke.hairline }]}>{item.media}</View>
            <View style={styles.content}>
              <Text variant="bodyStrong">{item.title}</Text>
              <Text variant={item.emphasis ? 'bodyStrong' : 'body'} tone={item.emphasis ? 'primary' : 'secondary'}>
                {item.description}
              </Text>
            </View>
            <Text variant="caption" tone="secondary" style={styles.note}>
              {item.note}
            </Text>
          </View>
          {i < items.length - 1 ? <View style={[styles.separator, { backgroundColor: color.stroke.hairline }]} /> : null}
        </Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'flex-start', gap: space.md, paddingVertical: space.md },
  tile: { width: TILE, height: TILE, borderRadius: radius.control - space.xxs, borderWidth: size.hairline, alignItems: 'center', justifyContent: 'center', marginTop: space.xxs / 2 },
  content: { flex: 1, gap: space.xxs },
  note: { flexShrink: 0, marginTop: space.xxs / 2 },
  separator: { height: size.hairline },
});
