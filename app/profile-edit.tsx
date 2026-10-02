// Layout plan. Job: change what Profile shows and the plan settings, then Save or Cancel (REDESIGN-PROMPT §5 edit mode). Focal element:
// the fields, grouped under Training and Work pattern so they scan in chunks (white-space audit E). Quiet: hints.
// - Inline validation, shown when a field is left or on Save, in plain words. Save with errors names how many need a fix.
// - Leaving with unsaved changes (Cancel, back, or the swipe) asks first, in a sheet where Keep editing is as easy as Discard.
// - Save: "Saved." with the success haptic, then back to Profile.
// - Photo via expo-image-picker (approved 1 Oct), held in memory; the initials are always the fallback. Signed in only, with the name.
// - Sessions: rename, reorder, remove, add. Renames reach Week and the evening log through a display-name map (Q7); GAP G55.
// - Training days use the snappy slider (D3).
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import ArrowDown from 'lucide-react-native/icons/arrow-down';
import ArrowUp from 'lucide-react-native/icons/arrow-up';
import CircleCheck from 'lucide-react-native/icons/circle-check';
import X from 'lucide-react-native/icons/x';

import { copy } from '@copy';
import { weekdayLong, weekdayShort } from '@format';
import { useAppState } from '@state';
import { initials, validTime, type SessionEntry } from '@state/profile';
import { radius, size, space } from '@tokens';
import {
  announce,
  Button,
  FocusRing,
  haptic,
  IconButton,
  InlineMessage,
  Section,
  Sheet,
  SnappySlider,
  Text,
  TextField,
  useFocus,
  usePress,
  useTheme,
} from '@ui';

const SAVED_MS = 700; // "Saved." stays long enough to read before Profile returns
const days = [0, 1, 2, 3, 4, 5, 6];

function DayToggle({ day, on, onChange }: { day: number; on: boolean; onChange: (on: boolean) => void }) {
  const { color } = useTheme();
  const press = usePress();
  const focus = useFocus();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={weekdayLong(day)}
      accessibilityState={{ checked: on }}
      aria-checked={on}
      onPress={() => {
        haptic.selection();
        onChange(!on);
      }}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      onFocus={focus.onFocus}
      onBlur={focus.onBlur}
    >
      <Animated.View
        style={[
          styles.day,
          on
            ? {
                backgroundColor: color.state.selected,
                borderColor: color.state.selected,
              }
            : { borderColor: color.stroke.control },
          press.style,
        ]}
      >
        <Text variant="bodyStrong" tone={on ? 'inverse' : 'primary'}>
          {weekdayShort(day)}
        </Text>
        <FocusRing visible={focus.focused} radius={radius.full} />
      </Animated.View>
    </Pressable>
  );
}

export default function EditProfile() {
  const { color } = useTheme();
  const router = useRouter();
  const navigation = useNavigation();
  const app = useAppState();
  const signedIn = app.account !== null;

  const [name, setName] = useState(app.account?.name ?? '');
  const [photo, setPhoto] = useState(app.photo);
  const [trainingDays, setTrainingDays] = useState(app.profile.trainingDays);
  const [trainingTime, setTrainingTime] = useState(app.profile.trainingTime);
  const [sessions, setSessions] = useState<SessionEntry[]>(app.profile.sessions);
  const [workDays, setWorkDays] = useState(app.profile.workDays);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showAll, setShowAll] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [asking, setAsking] = useState(false);
  const pending = useRef<(() => void) | null>(null);
  const leaving = useRef(false);

  const draft = {
    name: name.trim(),
    photo,
    trainingDays,
    trainingTime: trainingTime.trim(),
    sessions,
    workDays,
  };
  const original = {
    name: app.account?.name ?? '',
    photo: app.photo,
    trainingDays: app.profile.trainingDays,
    trainingTime: app.profile.trainingTime,
    sessions: app.profile.sessions,
    workDays: app.profile.workDays,
  };
  const dirty = JSON.stringify(draft) !== JSON.stringify(original);

  const lower = sessions.map((s) => s.name.trim().toLowerCase());
  const sessionError = (s: SessionEntry, i: number) =>
    !s.name.trim() ? copy.editProfile.errors.session : lower.indexOf(lower[i] ?? '') !== i ? copy.editProfile.errors.duplicate : null;
  const errors = {
    name: signedIn && !name.trim() ? copy.editProfile.errors.name : null,
    time: validTime(trainingTime) ? null : copy.editProfile.errors.time,
    sessions: sessions.map(sessionError),
  };
  const errorCount = [errors.name, errors.time, ...errors.sessions].filter(Boolean).length;
  const show = (key: string) => showAll || touched[key];
  const touch = (key: string) => setTouched((t) => ({ ...t, [key]: true }));

  // Back, the swipe and Cancel all pass through here: with unsaved changes, ask first.
  useEffect(() => {
    return navigation.addListener('beforeRemove', (e) => {
      if (!dirty || leaving.current) return;
      e.preventDefault();
      pending.current = () => navigation.dispatch(e.data.action);
      setAsking(true);
    });
  }, [navigation, dirty]);

  const leave = () => (router.canGoBack() ? router.back() : router.replace('/profile'));

  const discard = () => {
    setAsking(false);
    leaving.current = true;
    const go = pending.current;
    pending.current = null;
    if (go) go();
    else leave();
  };

  const save = () => {
    setShowAll(true);
    if (errorCount > 0) {
      haptic.warning();
      announce(copy.editProfile.errors.fix(errorCount));
      return;
    }
    app.saveProfile({
      name: signedIn ? name : undefined,
      photo: signedIn ? photo : undefined,
      profile: {
        trainingDays,
        trainingTime: trainingTime.trim(),
        sessions: sessions.map((s) => ({ ...s, name: s.name.trim() })),
        workDays: [...workDays].sort((a, b) => a - b),
      },
    });
    haptic.success();
    announce(copy.editProfile.saved);
    setSaved(true);
    leaving.current = true;
    setTimeout(leave, SAVED_MS);
  };

  const pickPhoto = async () => {
    setPhotoError(false);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [2, 3], // the capsule's proportion
        quality: 0.7,
      });
      if (!result.canceled && result.assets[0]) setPhoto(result.assets[0].uri);
    } catch {
      setPhotoError(true);
    }
  };

  const move = (i: number, by: -1 | 1) =>
    setSessions((list) => {
      const next = [...list];
      const [item] = next.splice(i, 1);
      if (item) next.splice(i + by, 0, item);
      return next;
    });

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: color.bg.canvas }]}>
      <View style={styles.bar}>
        <Button variant="text" label={copy.editProfile.cancel} onPress={() => (dirty ? setAsking(true) : leave())} />
        <Button variant="text" label={copy.editProfile.save} onPress={save} />
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text variant="title" accessibilityRole="header">
          {copy.editProfile.title}
        </Text>

        {saved ? (
          <View style={styles.saved} accessibilityLiveRegion="polite">
            <CircleCheck color={color.status.success} size={size.icon} strokeWidth={size.outline} />
            <Text variant="bodyStrong">{copy.editProfile.saved}</Text>
          </View>
        ) : null}

        {showAll && errorCount > 0 ? (
          <Text variant="body" style={{ color: color.status.attention }}>
            {copy.editProfile.errors.fix(errorCount)}
          </Text>
        ) : null}

        {signedIn ? (
          <View style={styles.group}>
            <View style={styles.photoRow}>
              <View style={[styles.capsule, { borderColor: color.stroke.control }]}>
                {photo ? (
                  <Image source={{ uri: photo }} style={styles.photo} accessibilityIgnoresInvertColors />
                ) : (
                  <Text variant="heading">{initials(name || (app.account?.name ?? ''))}</Text>
                )}
              </View>
              <View style={styles.photoActions}>
                <Button variant="secondary" label={photo ? copy.editProfile.changePhoto : copy.editProfile.addPhoto} onPress={pickPhoto} />
                {photo ? <Button variant="text" label={copy.editProfile.removePhoto} onPress={() => setPhoto(null)} /> : null}
              </View>
            </View>
            {photoError ? <InlineMessage title={copy.editProfile.photo} body={copy.editProfile.photoError} /> : null}
            <TextField
              label={copy.auth.name}
              value={name}
              onChangeText={setName}
              onBlur={() => touch('name')}
              error={show('name') ? errors.name : null}
              autoComplete="name"
              textContentType="name"
              autoCapitalize="words"
            />
          </View>
        ) : null}

        <Section title={copy.profile.training}>
          <SnappySlider
            label={copy.editProfile.trainingDays}
            value={trainingDays}
            onChange={setTrainingDays}
            min={1}
            max={7}
            valueText={copy.editProfile.trainingDaysValue(trainingDays)}
          />
          <TextField
            label={copy.editProfile.trainingTime}
            value={trainingTime}
            onChangeText={setTrainingTime}
            onBlur={() => touch('time')}
            hint={copy.editProfile.trainingTimeHint}
            error={show('time') ? errors.time : null}
            keyboardType="numbers-and-punctuation"
          />
        </Section>

        <Section title={copy.editProfile.sessions} note={copy.editProfile.sessionsHint}>
          {sessions.map((s, i) => (
            <View key={s.id} style={styles.session}>
              <View style={styles.sessionField}>
                <TextField
                  label={copy.editProfile.sessionName(i + 1)}
                  value={s.name}
                  onChangeText={(value) => setSessions((list) => list.map((x) => (x.id === s.id ? { ...x, name: value } : x)))}
                  onBlur={() => touch(s.id)}
                  error={show(s.id) ? (errors.sessions[i] ?? null) : null}
                  autoCapitalize="sentences"
                />
              </View>
              <View style={styles.sessionTools}>
                {/* A fixed slot per tool, so every name field is the same width. */}
                {i > 0 ? (
                  <IconButton icon={ArrowUp} label={copy.editProfile.moveUp(s.name)} onPress={() => move(i, -1)} />
                ) : (
                  <View style={styles.slot} />
                )}
                {i < sessions.length - 1 ? (
                  <IconButton icon={ArrowDown} label={copy.editProfile.moveDown(s.name)} onPress={() => move(i, 1)} />
                ) : (
                  <View style={styles.slot} />
                )}
                <IconButton
                  icon={X}
                  label={copy.editProfile.remove(s.name)}
                  onPress={() => setSessions((list) => list.filter((x) => x.id !== s.id))}
                />
              </View>
            </View>
          ))}
          <Button
            variant="secondary"
            label={copy.editProfile.addSession}
            onPress={() =>
              setSessions((list) => [
                ...list,
                {
                  id: `n${Date.now()}`,
                  name: copy.editProfile.newSession,
                  source: null,
                },
              ])
            }
          />
        </Section>

        <Section title={copy.editProfile.workDays} note={copy.editProfile.workDaysHint}>
          <View style={styles.days} accessibilityRole="none">
            {days.map((d) => (
              <DayToggle
                key={d}
                day={d}
                on={workDays.includes(d)}
                onChange={(on) => setWorkDays((list) => (on ? [...list, d] : list.filter((x) => x !== d)))}
              />
            ))}
          </View>
        </Section>
      </ScrollView>

      <Sheet visible={asking} onClose={() => setAsking(false)} title={copy.editProfile.discardTitle}>
        <Text variant="body">{copy.editProfile.discardBody}</Text>
        <View style={styles.sheetActions}>
          <Button variant="secondary" label={copy.editProfile.keep} fullWidth onPress={() => setAsking(false)} />
          <Button variant="destructive" label={copy.editProfile.discard} onPress={discard} />
        </View>
      </Sheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: space.margin,
    paddingTop: space.xxs,
  },
  content: {
    paddingHorizontal: space.margin,
    paddingTop: space.xs,
    paddingBottom: space.xxl,
    gap: space.xl,
  },
  saved: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  group: { gap: space.md },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    flexWrap: 'wrap',
  },
  capsule: {
    width: size.avatar.weekCapsule * 1.5,
    height: size.avatar.weekCapsule * 2.25,
    borderRadius: radius.full,
    borderWidth: size.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photo: { width: '100%', height: '100%' },
  photoActions: { gap: space.xxs, flexShrink: 1 },
  session: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    gap: space.xxs,
  },
  sessionField: { flexGrow: 1, flexBasis: space.xxxl * 3 },
  sessionTools: { flexDirection: 'row' },
  slot: { width: size.touch, height: size.touch },
  days: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  day: {
    minWidth: size.touch,
    minHeight: size.touch,
    paddingHorizontal: space.sm,
    borderRadius: radius.full,
    borderWidth: size.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetActions: { gap: space.xs },
});
