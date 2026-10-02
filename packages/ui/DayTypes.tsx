// Day types from the calendar (work, training, social, travel, rest): an icon and the word for each, in Text High.
// Day types are not plan state, so they never take a plan colour; their icons differ from the four plan glyphs so the two are never
// confused (Dumbbell, Footprints, Moon, Focus are the plans). Used on Day 1 and in the Week day detail.
import { StyleSheet, View } from 'react-native';
import Activity from 'lucide-react-native/icons/activity';
import BriefcaseBusiness from 'lucide-react-native/icons/briefcase-business';
import Plane from 'lucide-react-native/icons/plane';
import Sofa from 'lucide-react-native/icons/sofa';
import Users from 'lucide-react-native/icons/users';

import { copy } from '@copy';
import type { DayTag } from '@planner';
import { size, space } from '@tokens';

import { Text } from './Text';
import { useTheme } from './theme';
import { useIconSize } from './useIconSize';

const icons = { work: BriefcaseBusiness, training: Activity, social: Users, travel: Plane, rest: Sofa };

export function DayTypes({ tags }: { tags: DayTag[] }) {
  const { color } = useTheme();
  const px = useIconSize(size.iconSm);
  return (
    <View style={styles.row} accessible accessibilityLabel={tags.map((t) => copy.tag[t]).join(', ')}>
      {tags.map((tag) => {
        const Icon = icons[tag];
        return (
          <View key={tag} style={styles.item}>
            <Icon color={color.text.primary} size={px} strokeWidth={size.outline} />
            <Text variant="body">{copy.tag[tag]}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', columnGap: space.md, rowGap: space.xs },
  item: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
});
