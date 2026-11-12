# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Local launch-film capture, composition, original synthesized soundtrack and dual-format rendering tools.

- **ui:** Add shadcn/ui (radix-nova) with a collapsible sidebar, tooltips, cards and form controls, and a tips panel on the dashboard
- **dashboard:** Show the brief form, recent videos and tips on `/`, with a tooltip on every brief field
- **i18n:** English and Brazilian Portuguese for the login page, the sidebar and the dashboard (`resources/lang`, `inertia.I18n("ui.")`), picked from `?lang=`, the `lang` cookie or the browser; a language switcher in the header stores the choice through `POST /locale`
- **dashboard:** Example placeholders in every free-text brief field

### Changed

- **ui:** Redesign `/login` as a two-column page with a single Google button
- **ui:** The sidebar collapses to an icon rail (header button or Ctrl+B) and stays collapsed after a reload (`sidebar_state` cookie, shared with SSR)
- **dashboard:** The dashboard lives only at `/`, which requires a session; `/dashboard` answers 301 to `/`, and sign-in lands on `/`

### Security

- **auth:** Only `aleexgvieira@gmail.com` and `aleexgalhardoo@gmail.com` may sign in; other or unverified Google accounts are refused before a user is created, and sessions of other users are ended

## [0.4.0] - 2026-11-07

### Fixed

- **security:** Honor the declared WAV data size and check the decoded voice length ([c415fd2](https://github.com/AlexGalhardo/vukem-studio/commit/c415fd280bcbcd0c28379380ceecaad22ae1ab42))
- **security:** Save job columns instead of whole stale rows ([a4fa430](https://github.com/AlexGalhardo/vukem-studio/commit/a4fa430dad56f41ff7faa7d82df523d2e050b25a))
- **security:** Stop following symlinks in the root chown of the start command ([50e5e09](https://github.com/AlexGalhardo/vukem-studio/commit/50e5e09a552702895aaeeedad75b4c2819e40e0f))
- **security:** Remove password sign-in so Google is the only way in ([b2063f4](https://github.com/AlexGalhardo/vukem-studio/commit/b2063f47671ac059bc83b790a24573aaf0df77e1))
- **security:** Count retries in the rolling render quota ([1bc8114](https://github.com/AlexGalhardo/vukem-studio/commit/1bc81140afc4efcc346d68dd16bd7e91abbc15f4))
- **security:** Add a global rolling daily model budget ([7d3afc4](https://github.com/AlexGalhardo/vukem-studio/commit/7d3afc46c8da935e36ad5bcd179ea12a474d0423))
- **site:** Date doc pages by author date so rebase merges keep them valid ([ea230fd](https://github.com/AlexGalhardo/vukem-studio/commit/ea230fdafd1e50e3950ffd72f62d267db9946197))

## [0.3.1] - 2026-11-07

### Fixed

- **app:** Remove the public posts scaffold ([9e2fda7](https://github.com/AlexGalhardo/vukem-studio/commit/9e2fda76ba5c44f6ae0ff4c211938036c4aef6af))
- **deploy:** Migrate the SQLite volume in the start command, not in pre-deploy ([e402fb5](https://github.com/AlexGalhardo/vukem-studio/commit/e402fb563056625923c378cd0fc1f75669552a73))
- **deploy:** Let each Railway service pick its Dockerfile instead of the shared railway.toml ([d276ad2](https://github.com/AlexGalhardo/vukem-studio/commit/d276ad283bc55fcc65f6eaa0150d59dcf8882ab6))
- **deploy:** Move the vukem queue tables out of the way of the app's jobs table ([658fcb5](https://github.com/AlexGalhardo/vukem-studio/commit/658fcb50dbc570bf9d8d59871bb6845cf4760519))

## [0.3.0] - 2026-11-07

### Added

- **site:** Migrate the docs site from Next.js to Astro on the vukem site shell ([16def7f](https://github.com/AlexGalhardo/vukem-studio/commit/16def7f789c268162f9cb85be89148d7c9cda2ac))
- **studio:** Add Claude and OpenAI planners with a key check, a cost cap and a real-model test ([860e8a3](https://github.com/AlexGalhardo/vukem-studio/commit/860e8a33d27c9701073e67ec2e079b9d92bb6131))
- **deploy:** Ship the skill files, a queue worker setting and a migrate pre-deploy step in the app image ([5a5821a](https://github.com/AlexGalhardo/vukem-studio/commit/5a5821aa7ed7a4c31c6b7e6f59d7051d477721cf))
- Raise the brief duration limit to 300 seconds and scale plan, token and queue limits with it ([e9e2422](https://github.com/AlexGalhardo/vukem-studio/commit/e9e2422a7d61dc3faa413cb6b10e05943b44e51e))

### Fixed

- **site:** Remove the legacy pt-br redirect that allowed an open redirect ([9fc34c6](https://github.com/AlexGalhardo/vukem-studio/commit/9fc34c6a1fdbe5733b804854f1aa09dfa6bc6381))
- **site:** Answer 400 on malformed paths and keep decoded paths inside dist ([33d5c16](https://github.com/AlexGalhardo/vukem-studio/commit/33d5c167703a37071ca7c35cd267c563b91e8b81))
- **studio:** Bound every encoder process with a deadline and reject caption injection in plans ([3414db3](https://github.com/AlexGalhardo/vukem-studio/commit/3414db35f29501ca8d71a6709c847bd1d58be8ef))
- **jobs:** Enforce the rolling quota, claim and requeue with atomic SQL ([d32e230](https://github.com/AlexGalhardo/vukem-studio/commit/d32e230db5869a99aa9ac9cc900e25a0a2df6c8d))

## [0.2.0] - 2026-11-06

### Added

- **studio:** Render a brief into a checked mp4 ([64d9289](https://github.com/AlexGalhardo/vukem-studio/commit/64d92891d656731a5ab0dd852cf48021c9ff2cb6))

## [0.1.0] - 2026-11-05

### Added

- Add the vukem app shell and its ci jobs ([9c02185](https://github.com/AlexGalhardo/vukem-studio/commit/9c02185ffbb1951e79d746f6ce12ab0448093816))

### Fixed

- **docs:** Use a markdown link on the railway page ([cae7a8f](https://github.com/AlexGalhardo/vukem-studio/commit/cae7a8f5f15db84ca6c01e059ac71fe2919e0f8b))

[Unreleased]: https://github.com/AlexGalhardo/vukem-studio/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/AlexGalhardo/vukem-studio/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/AlexGalhardo/vukem-studio/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/AlexGalhardo/vukem-studio/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/AlexGalhardo/vukem-studio/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/AlexGalhardo/vukem-studio/releases/tag/v0.1.0
