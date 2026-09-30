// Three tabs on the platform's own bottom bar (Jakob's law: navigation and back behaviour stay native).
// Active is not colour alone: the label goes semibold too.
import { Tabs } from 'expo-router';
import CalendarDays from 'lucide-react-native/icons/calendar-days';
import Sun from 'lucide-react-native/icons/sun';
import TrendingUp from 'lucide-react-native/icons/trending-up';

import { copy } from '@copy';
import { font, size } from '@tokens';
import { Text, useTheme } from '@ui';

export default function TabsLayout() {
  const { color } = useTheme();

  const label = (title: string) =>
    function TabLabel({ focused }: { focused: boolean }) {
      return (
        <Text
          variant="caption"
          tone={focused ? 'primary' : 'secondary'}
          style={focused ? { fontFamily: font.body600 } : undefined}
        >
          {title}
        </Text>
      );
    };

  return (
    <Tabs
      initialRouteName="week"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color.text.primary,
        tabBarInactiveTintColor: color.text.secondary,
        tabBarStyle: {
          backgroundColor: color.bg.canvas,
          borderTopColor: color.stroke.hairline,
          borderTopWidth: size.hairline,
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
