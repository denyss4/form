// Tells screen readers about a status change that has no focus of its own, such as "Plan accepted." (WCAG 4.1.3).
// On the web this feeds a live region; on iOS and Android it uses the platform announcement.
import { AccessibilityInfo } from 'react-native';

export const announce = (message: string) => AccessibilityInfo.announceForAccessibility(message);
