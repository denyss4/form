// Layout plan. Job: who this Form belongs to, and every setting the plan uses, in one place (REDESIGN-PROMPT §5; Settings folds in here).
// Focal element: signed in, the capsule avatar; as a guest, what an account adds and "Create account" (white-space audit E: no empty
// capsule). Quiet: the settings sections, each its own block separated by space, with no dividers.
// Sections in the prompt's order: this week, training, work pattern, connections, notifications, privacy, account, about. Every field
// has a stated use (GDPR Art. 5(1)(c)). A guest's account actions sit at the top, so the Account section is not repeated for them.
import Constants from 'expo-constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pencil from 'lucide-react-native/icons/pencil';

import { copy } from '@copy';
import { formatDays } from '@format';
import { LegalSheet } from '@features/LegalSheet';
import { ProfileHeader } from '@features/ProfileHeader';
import { WeekCapsules } from '@features/WeekCapsules';
import { purposes, useAppState } from '@state';
import { demoAccount, eveningTimes } from '@state/profile';
import { size, space } from '@tokens';
import {
  announce,
  Button,
  ChoiceGroup,
  FocusRing,
  LinkRow,
  ScreenHeader,
  Section,
  SwitchRow,
  Text,
  useFocus,
  useIconSize,
  usePress,
  useTheme,
} from '@ui';

function EditButton({ onPress }: { onPress: () => void }) {
  const { color } = useTheme();
  const iconPx = useIconSize(size.iconSm);
  const press = usePress();
  const focus = useFocus();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={copy.profile.editA11y}
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      onFocus={focus.onFocus}
      onBlur={focus.onBlur}
    >
      <Animated.View style={[styles.edit, press.style]}>
        <Pencil color={color.text.primary} size={iconPx} strokeWidth={size.outline} />
        <Text variant="bodyStrong">{copy.profile.edit}</Text>
        <FocusRing visible={focus.focused} />
      </Animated.View>
    </Pressable>
  );
}

const timeOptions = eveningTimes.map((t) => ({ value: t, label: t }));

export default function Profile() {
  const { color } = useTheme();
  const router = useRouter();
  const app = useAppState();
  const [legal, setLegal] = useState(false);
  const params = useLocalSearchParams<{ as?: string }>();

  // Review only: ?as=marta shows the signed-in state without going through Sign in.
  useEffect(() => {
    if (params.as === 'marta' && !app.account) app.signUp(demoAccount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.as]);
  const { account, profile, prefs } = app;
  const allowed = purposes.filter((p) => app.consents[p] === 'allow').length;
  const sessions = profile.sessions.map((s) => s.name).join(', ');

  const signOut = () => {
    app.signOut();
    announce(copy.profile.signedOut);
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          title={copy.profile.title}
          onBack={() => (router.canGoBack() ? router.back() : router.replace('/today'))}
          right={<EditButton onPress={() => router.push('/profile-edit')} />}
        />

        {account ? (
          <View style={styles.header}>
            <ProfileHeader name={account.name} email={account.email} photo={app.photo} />
          </View>
        ) : (
          <View style={styles.guest}>
            <Text variant="heading" accessibilityRole="header" level={2}>
              {copy.profile.guestTitle}
            </Text>
            <Text variant="body" tone="secondary">
              {copy.profile.guestBody}
            </Text>
            <View style={styles.actions}>
              <Button label={copy.welcome.createAccount} fullWidth onPress={() => router.push('/sign-up')} />
              <Button variant="text" label={copy.welcome.signIn} onPress={() => router.push('/sign-in')} />
            </View>
            <Text variant="caption" tone="secondary">
              {copy.profile.guestNote}
            </Text>
          </View>
        )}

        <WeekCapsules />

        <Section title={copy.profile.training} note={copy.profile.trainingNote}>
          <View style={styles.lines}>
            <Text variant="body">{copy.profile.trainingDays(profile.trainingDays)}</Text>
            <Text variant="body">{copy.profile.trainingTime(profile.trainingTime)}</Text>
            <Text variant="body">{sessions ? copy.profile.sessions(sessions) : copy.profile.noSessions}</Text>
          </View>
        </Section>

        <Section title={copy.profile.work}>
          <Text variant="body">
            {profile.workDays.length ? copy.profile.workDays(formatDays(profile.workDays)) : copy.profile.noWorkDays}
          </Text>
        </Section>

        <Section title={copy.profile.connections}>
          <View>
            <LinkRow
              label={copy.profile.calendar}
              caption={app.calendar === 'connected' ? copy.profile.calendarOn : copy.profile.calendarOff}
              divider={false}
              spotlight
              onPress={() => router.push('/connect-calendar')}
            />
            <LinkRow
              label={copy.settings.healthRow.label}
              caption={copy.settings.healthRow.status}
              divider={false}
              spotlight
              onPress={() => router.push('/health-sync')}
            />
            <LinkRow
              label={copy.settings.calendarWriteRow.label}
              caption={copy.settings.calendarWriteRow.status}
              divider={false}
              spotlight
              onPress={() => router.push('/calendar-write')}
            />
          </View>
        </Section>

        <Section title={copy.profile.notifications} note={copy.profile.notificationsNote}>
          <SwitchRow
            label={copy.profile.morningPlan}
            caption={copy.profile.morningPlanCaption}
            value={prefs.morningPlan}
            onChange={(morningPlan) => app.setPrefs({ morningPlan })}
          />
          <SwitchRow
            label={copy.profile.eveningReminder}
            caption={copy.profile.eveningReminderCaption}
            value={prefs.eveningReminder}
            onChange={(eveningReminder) => app.setPrefs({ eveningReminder })}
          />
          {prefs.eveningReminder ? (
            <View style={styles.lines}>
              <Text variant="bodyStrong">{copy.profile.eveningTime}</Text>
              <ChoiceGroup
                label={copy.profile.eveningTime}
                options={timeOptions}
                value={prefs.eveningTime as (typeof eveningTimes)[number]}
                onChange={(eveningTime) => app.setPrefs({ eveningTime })}
              />
            </View>
          ) : null}
        </Section>

        <Section title={copy.profile.privacy}>
          <View>
            <LinkRow
              label={copy.profile.consents}
              caption={copy.profile.consentsCaption(allowed, purposes.length)}
              divider={false}
              spotlight
              onPress={() => router.push('/privacy')}
            />
            <LinkRow label={copy.profile.export} divider={false} spotlight onPress={() => router.push('/export-data')} />
            <LinkRow label={copy.profile.deleteData} divider={false} spotlight onPress={() => router.push('/delete-data')} />
          </View>
        </Section>

        {account ? (
          <Section title={copy.profile.account}>
            <View>
              <LinkRow label={copy.profile.changeEmail} divider={false} spotlight onPress={() => router.push('/change-email')} />
              <LinkRow label={copy.profile.changePassword} divider={false} spotlight onPress={() => router.push('/change-password')} />
            </View>
            <View style={styles.actions}>
              <Button variant="text" label={copy.profile.signOut} onPress={signOut} />
              <Button variant="destructive" label={copy.profile.deleteAccount} onPress={() => router.push('/delete-account')} />
            </View>
          </Section>
        ) : null}

        <Section title={copy.profile.about}>
          <Button variant="text" label={copy.profile.legal} onPress={() => setLegal(true)} />
          <View style={styles.lines}>
            <Text variant="body">{copy.profile.version(Constants.expoConfig?.version ?? '1.0.0')}</Text>
            <Text variant="body">{copy.profile.language}</Text>
            <Text variant="caption" tone="secondary">
              {copy.profile.languageNote}
            </Text>
            <Text variant="caption" tone="secondary">
              {copy.settings.fonts}
            </Text>
            <Text variant="caption" tone="secondary">
              {copy.settings.model}
            </Text>
          </View>
        </Section>
      </ScrollView>
      <LegalSheet visible={legal} onClose={() => setLegal(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: space.margin, paddingTop: space.xs, paddingBottom: space.xxl, gap: space.xl },
  header: { marginTop: space.md, marginBottom: space.xs },
  guest: { gap: space.sm },
  actions: { gap: space.xxs },
  lines: { gap: space.xxs },
  edit: { minHeight: size.touch, flexDirection: 'row', alignItems: 'center', gap: space.xs, paddingHorizontal: space.xs },
});
