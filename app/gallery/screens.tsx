// Layout plan. Job: reach any screen in any state in one tap. Focal element: the list. Quiet: everything else.
// This is the dev-only state picker for whole screens: each link opens a screen with its state held (?state=...).
import { copy } from '@copy';
import { GalleryScreen, NavLink, Section } from '@ui';

export default function Screens() {
  return (
    <GalleryScreen title={copy.dev.hub.screens} note={copy.dev.screens.note}>
      {copy.dev.screens.groups.map((group) => (
        <Section key={group.title} title={group.title}>
          {group.links.map(([label, href]) => (
            <NavLink key={href} href={href} label={label} />
          ))}
        </Section>
      ))}
    </GalleryScreen>
  );
}
