# Project brief

Studio is an open source short-form video product hosted at <https://studio.vukem.dev>.

A visitor to that hostname lands on the technical documentation. The documentation uses the same site shell as <https://vukem.dev>. The reference implementation is <https://github.com/AlexGalhardo/vukem/tree/main/site>.

The product is a dashboard that automates a short-form video. The person enters the goal, the style, and the technique. The app compiles the prompt. A language model writes the plan. Open source tools render an MP4 for shorts, reels, site promotion, digital products, events, lessons, and marketing.

Primary tools: FFmpeg, Remotion, a Claude or OpenAI model, and the catalogs in `docs/`. HyperFrames is the permissive renderer alternative recorded in `docs/web-research.md`.

The application itself is a Vukem app (<https://vukem.dev/docs/introduction>) with Inertia, React, and a sidebar. `/` is the dashboard. A signed-out visitor is redirected to `/login`, which has one Google button.

Repository: <https://github.com/AlexGalhardo/vukem-studio>

Framework bugs found while building Studio go in the single shared `vukem-feedback.md` at the workspace root; this repository keeps no copy (the name stays in `.gitignore` so one is never committed).

The implementation order and the audit checks are in `ROADMAP.md`.
