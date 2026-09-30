// Layout plan. Job: ask for permission to change the calendar, clearly as a preview. Focal element: the primary action. Quiet: the preview note.
// Calendar write is out of scope (MASTER_PROMPT §8): nothing is written. Reading stays a separate choice; writing needs reading first.
import { PermissionPreview } from '@features/PermissionPreview';
import { copy } from '@copy';
import { useAppState } from '@state';

export default function CalendarWrite() {
  const app = useAppState();
  const blocked = app.consents.calendar === 'decline' || app.calendar !== 'connected';
  return <PermissionPreview copy={copy.calendarWrite} blocked={blocked} route="/calendar-write" />;
}
