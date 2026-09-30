// Layout plan. Job: ask for Health data access, clearly as a preview. Focal element: the primary action. Quiet: the preview note.
// Real HealthKit and Health Connect are out of scope (MASTER_PROMPT §8): nothing is read. The screen is shared with the calendar one.
import { PermissionPreview } from '@features/PermissionPreview';
import { copy } from '@copy';
import { useAppState } from '@state';

export default function HealthSync() {
  const app = useAppState();
  return <PermissionPreview copy={copy.health} blocked={app.consents.health === 'decline'} route="/health-sync" />;
}
