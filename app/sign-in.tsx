// Sign in (D5, the user's pick 6B): the shared auth screen, opened on its "Sign in" tab. See packages/features/AuthScreen.
import { AuthScreen } from '@features/AuthScreen';

export default function SignIn() {
  return <AuthScreen initialMode="signIn" />;
}
