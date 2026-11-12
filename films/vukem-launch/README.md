# Vukem launch film

Accepted brief: 120 seconds, English on-screen copy, no voice-over, separate
1920×1080 and 1080×1920 compositions, real v0.43.0 finance SaaS captures,
electronic music and synchronized effects. The destination is vukem.dev.

## Local production

Requires Node 24, the repository Playwright browser, Python 3 with NumPy,
and FFmpeg/ffprobe with libx264. Set `FFMPEG` and `FFPROBE` to override executable paths, or use `PATH`. Rendering is a local CLI mode, independent
of the existing web job worker. No API key is required.

1. Generate the demo with the v0.43.0 CLI: `vukem new money --example finance`.
2. Install dependencies, build Vite assets, migrate and start on loopback port 3210.
3. Keep the generated project at `storage/marketing/money`.
4. Run `node scripts/film/capture.mjs` from the repository root.
5. Run `python3 scripts/film/music.py`.
6. Run `node scripts/film/render.mjs horizontal` and then the vertical variant.

Source timeline: `scripts/film/scenes.json`; browser composition:
`scripts/film/composition.html`. Intermediate and final media go under ignored
`storage/marketing/output/`. The renderer writes a pending MP4 and promotes it
only after dimensions, duration and pixel format are checked by ffprobe.
Further loudness, decode and editorial review is required before publication.

## Asset provenance

- UI: unchanged finance scaffold from v0.43.0; see `assets/capture.json`.
- Data: fictional, disposable local SQLite records only.
- Type: locally installed Geist, provided by `@fontsource-variable/geist`.
- Audio: original deterministic synthesized instrumental and effects from
  `scripts/film/music.py`, created for this film. No external samples or voice.
- Interface captures do not demonstrate live billing or external email delivery.

Two known scaffold issues are recorded in workspace-root `vukem-feedback.md`:
empty charts and the workspace page's conflicting prop shape. Final captures
use seeded data and functional dashboard, transactions, accounts and login.

Art direction is recorded in `art-direction.json`, adapting the existing
`lab-ia` kit palette to the approved launch brief and locally licensed Geist.
Both orientations share the same tokens and editorial manifest. The vertical
composition uses mobile captures and stacked typography rather than a crop.
