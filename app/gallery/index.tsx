// Layout plan. Job: reach any token or component quickly. Focal element: the list of pages. Quiet: the dev pickers.
import { copy } from '@copy';
import { GalleryScreen, NavLink } from '@ui';

const pages = [
  { href: '/gallery/screens', label: copy.dev.hub.screens },
  { href: '/gallery/tokens', label: copy.dev.hub.tokens },
  { href: '/gallery/type', label: copy.dev.hub.type },
  { href: '/gallery/button', label: copy.dev.hub.button },
  { href: '/gallery/plan', label: copy.dev.hub.plan },
  { href: '/gallery/dial', label: copy.dev.hub.dial },
  { href: '/gallery/drivers', label: copy.dev.hub.drivers },
  { href: '/gallery/model', label: copy.dev.hub.model },
] as const;

export default function GalleryHub() {
  return (
    <GalleryScreen title={copy.dev.hub.title} note={copy.dev.hub.note} home>
      {pages.map((page) => (
        <NavLink key={page.href} href={page.href} label={page.label} />
      ))}
    </GalleryScreen>
  );
}
