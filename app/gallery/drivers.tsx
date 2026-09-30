// Layout plan. Job: review the driver list. Focal element: the signed values. Quiet: the basis captions and hairlines.
// Drivers come from Marta's fixtures (real predict output). "Personal" only swaps the basis label, to review the wording.
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { copy } from '@copy';
import { martaWeek } from '@fixtures';
import { DevPicker, DriverRow, GalleryScreen, oneOf, Section, Text } from '@ui';

type Basis = 'typical' | 'personal';
type SetKey = 'three' | 'one' | 'none';

const days = martaWeek.days;
const threeDrivers = days.find((d) => d.forecastFor === martaWeek.meta.demoToday) ?? days[days.length - 1];
const oneDriver = days.find((d) => d.result.drivers.length === 1) ?? days[0];

export default function DriversGallery() {
  const params = useLocalSearchParams<{ basis?: string; set?: string }>();
  const [basis, setBasis] = useState<Basis>(oneOf(params.basis, ['typical', 'personal'] as const, 'typical'));
  const [set, setSet] = useState<SetKey>(oneOf(params.set, ['three', 'one', 'none'] as const, 'three'));
  const d = copy.dev.drivers;

  const day = set === 'one' ? oneDriver : threeDrivers;
  const drivers = set === 'none' ? [] : day.result.drivers.map((x) => ({ ...x, basis }));

  return (
    <GalleryScreen title={copy.dev.hub.drivers} note={d.note}>
      <DevPicker
        label={d.basis}
        options={[
          { value: 'typical', label: copy.basis.typical },
          { value: 'personal', label: copy.basis.personal },
        ]}
        value={basis}
        onChange={setBasis}
      />
      <DevPicker
        label={d.set}
        options={[
          { value: 'three', label: d.sets.three },
          { value: 'one', label: d.sets.one },
          { value: 'none', label: d.sets.none },
        ]}
        value={set}
        onChange={setSet}
      />

      <Section title={copy.whyHeading}>
        {drivers.length === 0 ? (
          <Text variant="body" tone="secondary">
            {copy.noDrivers}
          </Text>
        ) : (
          drivers.map((driver, i) => (
            <DriverRow key={driver.id} driver={driver} divider={i < drivers.length - 1} />
          ))
        )}
      </Section>
    </GalleryScreen>
  );
}
