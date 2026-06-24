# Cinematic Hero Portfolio

A fullscreen, sticky, cinematic video hero built with Next.js (App Router), Three.js, GSAP, and CSS Modules — designed to feel premium and emotional, like a movie reel opening into a portfolio.

## What's inside

```
app/
  layout.js            Root layout, page metadata
  page.js               Demo page mounting <VideoIntro /> + a sample next section
  page.module.css        Styling for the overlapping "next section" reveal
  globals.css            Design tokens (CSS variables), font imports, resets
components/
  Hero/
    VideoIntro.jsx              Main hero: dual video layers, gradients, GSAP timeline, layout
    VideoIntro.module.css       All hero layout / visual styling
    CinematicLayer.jsx          Three.js bokeh particle field (additive blending, parallax)
    HeroControls.jsx            Glassmorphism play/pause + mute buttons, "tap for sound" badge
    HeroControls.module.css
    ScrollIndicator.jsx          Bottom-center scroll cue with animated pulse line
    ScrollIndicator.module.css
  About/
    AboutSection.jsx             Bio + portrait + skills grid, scroll-triggered reveal
    AboutSection.module.css
    SkillsGrid.jsx               Reusable grouped pill-tag skills list
    SkillsGrid.module.css
  Services/
    ServicesSection.jsx          Numbered service rows, scroll-triggered stagger
    ServicesSection.module.css
  Projects/
    ProjectsSection.jsx          Sticky-stacking project cards (pure CSS, no JS animation)
    ProjectsSection.module.css
  Contact/
    ContactSection.jsx           4-card contact grid (email / whatsapp / linkedin / github)
    ContactSection.module.css
public/
  videos/                Put your talking-head video here (see below)
  images/                Put your portrait photo here (see below)
```

## 1. Add your video

Drop your talking-head video file at:

```
public/videos/hero.mp4
```

Recommended: H.264 MP4, 1080p or larger, under ~15MB if possible for fast loads (compress with Handbrake or `ffmpeg -i in.mp4 -vcodec h264 -crf 23 hero.mp4`). The same file is used twice — once sharp in the foreground, once heavily blurred behind it as ambient glow — so no extra asset is needed.

If no video is present, the hero gracefully falls back to a styled placeholder panel instead of breaking.

## 1b. Add your photo (About section)

Drop a portrait photo at:

```
public/images/portrait.jpg
```

If it's missing, the About section shows a styled placeholder instead of breaking.

## 1c. Update your contact details

`ContactSection` (in `app/page.js` or directly inside `components/Contact/ContactSection.jsx`) currently uses placeholder email/WhatsApp/LinkedIn/GitHub values — replace them with your real ones via the `channels` prop or by editing the defaults directly.

## 2. Install & run

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## 3. Customize the content

`VideoIntro` accepts props, so you can reuse it anywhere:

```jsx
<VideoIntro
  videoSrc="/videos/hero.mp4"
  eyebrow="FRONTEND ENGINEER — SHOWREEL"
  firstName="ALEX"
  lastName="MERCER"
  subtitle="Creative engineer crafting immersive, motion-driven interfaces."
  reelLabel="REEL 01"
  nextSectionId="work"
/>
```

`nextSectionId` should match the `id` of the section the scroll indicator scrolls to.

## 4. Design notes

- **Color tokens** live in `app/globals.css` as CSS variables (`--color-void`, `--color-ember`, `--color-amber`, `--color-monitor-blue`, `--color-bone`, `--color-smoke`) — change the palette in one place.
- **Typography**: Fraunces (display/name), Inter (body), JetBrains Mono (eyebrow/timecode/UI labels) — loaded via Google Fonts `@import` in `globals.css`.
- **Letterbox bars** are the signature reveal: they start as a near-closed curtain and open with an `expo.out` ease as the page loads, echoing a film reel starting to roll. The live timecode top-left is driven by the actual `<video>` element's `currentTime`, not a fake animation.
- **Ambient glow**: the foreground video is masked (CSS `mask-image`) at the top/bottom edges so the heavily blurred duplicate behind it glows through exactly where the dark readability gradients sit.
- All entrance motion respects `prefers-reduced-motion`.

## 5. Performance

- The Three.js layer builds geometry/material once, animates via a single `requestAnimationFrame` loop using delta time (not frame-count), and fully disposes geometry, materials, textures, and the renderer on unmount.
- Particle count automatically drops on small screens.
- Pixel ratio is capped at 2 to avoid burning GPU on high-DPI displays.
