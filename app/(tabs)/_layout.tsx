// Three tabs on the platform's own bottom bar (Jakob's law: navigation and back behaviour stay native), floating on glass
// (REDESIGN-PROMPT §2.2). Glass carries Text High only, so both labels are Text High; active is the sage icon (3.34:1 at the glass's
// worst case, above 3:1 for graphics) plus a semibold label, never colour alone. Tab screens reserve useTabBarSpace() at the bottom.
import { Tabs } from 'expo-router';
import CalendarDays from 'lucide-react-native/icons/calendar-days';
import Sun from 'lucide-react-native/icons/sun';
import TrendingUp from 'lucide-react-native/icons/trending-up';

import { copy } from '@copy';
import { chromeMaxFontScale, font, size } from '@tokens';
import { GlassBar, Text, useTabBarSpace, useTheme } from '@ui';

export default function TabsLayout() {
  const { color } = useTheme();
  const barHeight = useTabBarSpace();

  const label = (title: string) =>
    function TabLabel({ focused }: { focused: boolean }) {
      return (
        <Text
          variant="caption"
          tone="primary"
          maxFontSizeMultiplier={chromeMaxFontScale}
          style={focused ? { fontFamily: font.body600 } : undefined}
        >
          {title}
        </Text>
      );
    };

  return (
    <Tabs
      initialRouteName="today"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color.state.selected,
        tabBarInactiveTintColor: color.text.primary,
        tabBarBackground: () => <GlassBar />,
        tabBarStyle: {
          position: 'absolute',
          height: barHeight,
          backgroundColor: 'transparent',
          borderTopWidth: 0, // the glass draws its own hairline edge
          elevation: 0,
          shadowOpacity: 0,
        },
        sceneStyle: { backgroundColor: color.bg.canvas },
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          title: copy.tabs.today,
          tabBarLabel: label(copy.tabs.today),
          tabBarIcon: ({ color: tint, size: px }) => <Sun color={tint} size={px} strokeWidth={size.outline} />,
        }}
      />
      <Tabs.Screen
        name="week"
        options={{
          title: copy.tabs.week,
          tabBarLabel: label(copy.tabs.week),
          tabBarIcon: ({ color: tint, size: px }) => (
            <CalendarDays color={tint} size={px} strokeWidth={size.outline} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: copy.tabs.progress,
          tabBarLabel: label(copy.tabs.progress),
          tabBarIcon: ({ color: tint, size: px }) => <TrendingUp color={tint} size={px} strokeWidth={size.outline} />,
        }}
      />
    </Tabs>
  );
}
