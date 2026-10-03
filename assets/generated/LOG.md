# Generated assets

| Date | Files | Source | How |
|---|---|---|---|
| 2 Oct 2026 | `assets/icon.png`, `android-icon-foreground.png`, `android-icon-background.png`, `android-icon-monochrome.png`, `favicon.png`, `splash-icon.png`; SVG sources in `assets/generated/icons/` | The user's logo, `Logos/form-white.svg` (paths unchanged) | `npm run icons` (scripts/app-icons.mjs): SVG built from the logo's F (icons) or the whole wordmark (splash), rendered with headless Chrome. Colours are Lichen tokens: canvas #121212, Text High #F5F5F7, sage #b3be8b at 0.22 fading out for the first-light glow. Replaces the Expo template icons |
| 2 Oct 2026 | `packages/ui/metalVertex.ts`, `assets/licenses/paper-shaders-LICENSE.txt`, `paper-shaders-NOTICE.txt` | @paper-design/shaders 0.0.81 (Apache 2.0) | The vertex shader copied unchanged (the package does not export it), with the licence and notice |
