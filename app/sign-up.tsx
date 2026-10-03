// Create an account (D5, the user's pick 6B): the shared auth screen, opened on its "Create account" tab. See packages/features/AuthScreen.
import { AuthScreen } from '@features/AuthScreen';

export default function SignUp() {
  return <AuthScreen initialMode="signUp" />;
}
