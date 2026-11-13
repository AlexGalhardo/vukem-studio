# Vukem launch film

The launch film is 128 seconds. English on-screen copy, no voice-over, separate
1920×1080 and 1080×1920 compositions. The story is real CLI output, then auth,
database, security, CLI, APIs, and Vukem Studio. The final 30 seconds are the
example personal-finance SaaS. Music is an instrumental bed with transition
effects. The destination is vukem.dev.

## Local production

Requires Node 24, the repository Playwright browser, Python 3 with NumPy,
and FFmpeg/ffprobe with libx264. Set `FFMPEG` and `FFPROBE` to override executable paths, or use `PATH`. Rendering is a local CLI mode, independent
of the existing web job worker. No API key is required.

1. Generate a disposable app with `vukem new <name> --example finance --seed` from a CLI that includes the finance scaffold. Do not point capture at the port 3210 preview.
2. Set `FILM_BASE` to that app (`http://127.0.0.1:<port>`), `FILM_ADMIN_EMAIL`, and `FILM_ADMIN_FILE` (a mode-0600 password file). The script refuses ports 3210 and 4321 and does not delete rows.
3. Run `node scripts/film/capture.mjs` from the repository root.
4. Run `python3 scripts/film/music.py` after `scenes.json` durations are final.
5. Run `node scripts/film/render.mjs horizontal` and then the vertical variant.

Source timeline: `scripts/film/scenes.json`; browser composition:
`scripts/film/composition.html`. Intermediate and final media go under ignored
`storage/marketing/output/`. The renderer writes a pending MP4 and promotes it
only after dimensions, duration and pixel format are checked by ffprobe.
Further loudness, decode and editorial review is required before publication.

## Asset provenance

- UI: the generated finance app described in `assets/capture.json`. Published CLI v0.43.0 predates the scaffold; the source revision is finance follow-up `61b94c4b` on main `c8fadd0fe1915b3b4dde65cdeef378cebc23c40b`.
- Data: fictional, disposable local SQLite records only.
- Type: locally installed Geist, provided by `@fontsource-variable/geist`.
- Audio: original deterministic synthesized instrumental and effects from
  `scripts/film/music.py`, created for this film. No external samples or voice.
- Interface captures do not demonstrate live billing or external email delivery.

Scaffold provenance is in `assets/capture.json`. Final captures use the finance
follow-up on main `c8fadd0fe1915b3b4dde65cdeef378cebc23c40b`, which already
includes the empty-chart, workspace-prop and monthly-total corrections.
The rendered UI is that refactored scaffold, not the pre-refactor masters.

Art direction is recorded in `art-direction.json`, adapting the existing
`lab-ia` kit palette to the approved launch brief and locally licensed Geist.
Both orientations share the same tokens and editorial manifest. The vertical
composition uses mobile captures and stacked typography rather than a crop.

For a quick pipeline check, add `--smoke` to either render command. Input hashes
are recorded and verified again before promotion, so editing the composition
or captures during an encode fails instead of publishing mixed inputs.

After both full exports, run `python3 scripts/film/qa.py`, then
`node scripts/film/package.mjs` to retain the verified deliverables under
`films/vukem-launch/deliverables/`. The vukem.dev landing does not embed the
film. Keep a local copy of the horizontal master, poster and captions at the
workspace root, outside the `vukem/` repository.
The package command rejects media that do not match their QA hashes. Audio
requires NumPy (`scripts/film/requirements.txt`). Full masters follow `scenes.json` (128 seconds for this cut);
post-encode measurements, not the source WAV, determine readiness.

### Reproducing this cut

Published CLI v0.43.0 does not generate the interface in this film. The
captures come from main `c8fadd0fe1915b3b4dde65cdeef378cebc23c40b` (the three
PR 202 correctness fixes) plus the Phase 9 finance follow-up, committed as
`61b94c4b`. The on-screen version line is the local CLI used at capture time:
`vukem v0.43.1-0.20261112225041-c8fadd0fe191+dirty`. No release tag was cut
for the film or the landing.

`assets/capture.json` records the scaffold command, the disposable loopback
URL, and that capture signs in without deleting or reseeding. After the
finance follow-up merges, check out that commit, build `./cmd/vukem`, and
repeat the local production steps above. Do not point capture at port 3210
or 4321.
