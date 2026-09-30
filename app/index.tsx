import { Redirect } from 'expo-router';

import { useAppState } from '@state';

// Every launch starts at onboarding: the demo state lives in memory (GAPS G11).
export default function Index() {
  const { onboarded } = useAppState();
  return <Redirect href={onboarded ? '/week' : '/onboarding'} />;
}
