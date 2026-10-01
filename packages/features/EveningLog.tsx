// Layout plan. Job: the 3-tap evening log, plus the optional outcome question. Focal element: the questions. Quiet: the hint line.
// Three taps at most: effort (only when the calendar has a session that day), alcohol, anything unusual. "Did the plan fit?" is
// extra and optional. Nothing is preselected. Save stays off until the core answers are in. Completion ring, success haptic,
// then the sheet dismisses (MASTER_PROMPT §6).
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { copy } from '@copy';
import type { EveningAnswers, Effort, Fit } from '@planner/dailyLog';
import type { WeekDay } from '@planner';
import { space } from '@tokens';
import { announce, Button, ChoiceGroup, CompletionRing, haptic, InlineMessage, Sheet, Text } from '@ui';
import { formatDay } from '@format';

const yesNo = [
  { value: 'no', label: copy.log.alcohol.no },
  { value: 'yes', label: copy.log.alcohol.yes },
] as const;

export function EveningLog({
  visible,
  day,
  planAccepted,
  onClose,
  onSave,
}: {
  visible: boolean;
  day: WeekDay;
  /** "Did the plan fit?" is only asked when there was an accepted plan to judge. */
  planAccepted: boolean;
  onClose: () => void;
  /** Throws if the forecast cannot be worked out. The sheet then says so and stays open. */
  onSave: (answers: EveningAnswers) => void;
}) {
  const session = day.sessions[0];
  const [effort, setEffort] = useState<Effort | null>(null);
  const [alcohol, setAlcohol] = useState<'no' | 'yes' | null>(null);
  const [unusual, setUnusual] = useState<'no' | 'yes' | null>(null);
  const [fit, setFit] = useState<Fit | null>(null);
  const [failed, setFailed] = useState(false);

  const core = [session ? effort : 'n/a', alcohol, unusual];
  const answered = core.filter((v) => v !== null).length;
  const remaining = core.length - answered;

  const save = () => {
    if (alcohol === null || unusual === null || (session && effort === null)) return;
    try {
      onSave({
        effort: session ? (effort ?? undefined) : undefined,
        alcohol: alcohol === 'yes',
        unusual: unusual === 'yes',
        fit: fit ?? undefined,
      });
      haptic.success();
      announce(copy.today.logged);
      setFailed(false);
      setEffort(null);
      setAlcohol(null);
      setUnusual(null);
      setFit(null);
      onClose();
    } catch {
      setFailed(true);
    }
  };

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title={copy.log.title}
      accessory={<CompletionRing done={answered} total={core.length} />}
      footer={
        <>
          {failed ? (
            <InlineMessage title={copy.today.error.title} body={copy.today.error.body} />
          ) : remaining > 0 ? (
            <Text variant="caption" tone="secondary">
              {copy.log.remaining(remaining)}
            </Text>
          ) : null}
          <Button label={copy.log.save} fullWidth disabled={remaining > 0} onPress={save} />
        </>
      }
    >
      <Text variant="caption" tone="secondary">
        {formatDay(day.date)}
      </Text>

      {session ? (
        <View style={styles.question}>
          <Text variant="bodyStrong">{copy.log.effort.question(session.name)}</Text>
          <ChoiceGroup
            label={copy.log.effort.question(session.name)}
            columns={2}
            options={[
              { value: 'skipped', label: copy.log.effort.skipped },
              { value: 'easy', label: copy.log.effort.easy },
              { value: 'moderate', label: copy.log.effort.moderate },
              { value: 'hard', label: copy.log.effort.hard },
            ]}
            value={effort}
            onChange={setEffort}
          />
        </View>
      ) : null}

      <View style={styles.question}>
        <Text variant="bodyStrong">{copy.log.alcohol.question}</Text>
        <ChoiceGroup label={copy.log.alcohol.question} options={[...yesNo]} value={alcohol} onChange={setAlcohol} />
      </View>

      <View style={styles.question}>
        <Text variant="bodyStrong">{copy.log.unusual.question}</Text>
        <ChoiceGroup label={copy.log.unusual.question} options={[...yesNo]} value={unusual} onChange={setUnusual} />
      </View>

      {planAccepted ? (
      <View style={styles.question}>
        <Text variant="bodyStrong">{copy.log.fit.question}</Text>
        <Text variant="caption" tone="secondary">
          {copy.log.fit.optional}
        </Text>
        <ChoiceGroup
          label={copy.log.fit.question}
          columns={2}
          options={[
            { value: 'yes', label: copy.log.fit.yes },
            { value: 'tooHard', label: copy.log.fit.tooHard },
            { value: 'tooEasy', label: copy.log.fit.tooEasy },
          ]}
          value={fit}
          onChange={setFit}
        />
      </View>
      ) : null}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  question: { gap: space.xs },
});
