// The profile button for the top right of Today, Week and Progress (REDESIGN-PROMPT §5, Q4: a header button, no fourth tab).
import { useRouter } from 'expo-router';

import { useAppState } from '@state';
import { initials } from '@state/profile';
import { ProfileButton } from '@ui';

export function HeaderProfile() {
  const router = useRouter();
  const { account, photo } = useAppState();
  return (
    <ProfileButton
      initials={account ? initials(account.name, account.email) : null}
      photo={photo}
      onPress={() => router.push('/profile')}
    />
  );
}
