# Potting Bench

> **Concept store, not a real business.** Built as a portfolio piece. Nothing here is for sale.

Potting Bench sells indoor plants and glazed planters to Australian customers: AUD, GST-inclusive prices, free shipping from $120, and no live plants to WA or Tasmania. The selected planter glaze drives an accent colour on the product page. Plant care shows as nursery-tag-style rows.

- Working agreement: [CLAUDE.md](CLAUDE.md)
- Shopify's theme authoring guide (vendor file): [AGENTS.md](AGENTS.md)
- Admin setup (rebuild the store from the repo): [docs/admin-setup.md](docs/admin-setup.md)
- AI usage log: [AI-LOG.md](AI-LOG.md)

## Base theme

| | |
|---|---|
| Theme | Dwell 4.2.0 (Shopify Theme Store) |
| Code base | Horizon 4.2.0. Dwell's code is identical apart from leading blank lines, `theme_name`, the `settings_data.json` preset (fonts, colours), locales and `AGENTS.md`. |
| Vendor branch | `vendor/dwell` holds the untouched Dwell files. `main` holds Dwell plus our changes. |
| Store | `potting-bench.myshopify.com`, AUD, Australia only |

### Updating Dwell

1. Download the new Dwell release (Online Store → Themes → ⋯ on Dwell → Download theme file *(unsure of current UI)*).
2. `git switch vendor/dwell`, then `git rm -rq .`, unzip the release into the repo root, and restore `AGENTS.md` if the package ships one.
3. `git add -A` and commit `chore(vendor): import Dwell x.y.z`.
4. Branch from `main` (`chore/dwell-x.y.z`), run `git merge vendor/dwell`, and resolve conflicts:
   - `config/settings_data.json`, `templates/*.json`, `sections/*-group.json`: keep `main`'s version (editor-owned), then check for new settings.
   - Files in the overrides table below: re-apply our documented change on top of the new vendor file.
5. Run `shopify theme check`, preview the result, and open a pull request to `main`.

## Run locally

Requires Shopify CLI (4.x) and access to the dev store.

```bash
shopify theme dev --store potting-bench.myshopify.com
```

```bash
shopify theme check
```

The Shopify GitHub integration deploys `main` to the connected theme, and theme editor saves commit back to `main`. Work on a branch and merge through a pull request. CI runs Theme Check on every pull request and on pushes to `main`, and fails on errors only.

## Data model

| Resource | Definition | Fields / type | Used by | Status |
|---|---|---|---|---|
| Metaobject | Glaze (`glaze`) | `name` single line text (required), `colour` colour (required), `finish` single line text (Gloss, Satin, Matte), `pattern_image` file, images only (optional) | `pb-glaze-accent` | Created |
| Variant metafield | `custom.glaze` | Metaobject reference → Glaze, one entry | `pb-glaze-accent` | Created |
| Product option | Colour | Plain text (Celadon, Tenmoku, …). Not linked to a metafield. | Horizon variant picker | Created on test product |
| Metaobject | Plant care (`plant_care`) | Botanical name, light, water, humidity, pet safe, difficulty | `pb-care-label` | Planned |
| Product metafield | `custom.care` | Metaobject reference → Plant care | `pb-care-label` | Planned |
| Product metafield | `custom.live_plant` | True or false | `cart-live-plant-notice` | Planned |

## Overrides of Dwell core files

Every edit to a vendor file is listed here so Dwell updates stay mergeable.

| File | Change | Reason | PR |
|---|---|---|---|
| *None yet* | | | |

## Decision log

### D1. Base theme: Dwell 4.2.0

- **Options:** Horizon (Shopify's reference theme), Dwell (a Horizon-family Theme Store theme), Dawn (the previous generation).
- **Trade-offs:** Horizon and Dwell share the same theme-block architecture. Dwell adds a finished design preset that suits a homewares brand. Dawn is section-based and no longer Shopify's direction.
- **Decision:** Dwell 4.2.0.
- **Reason:** current architecture, a credible starting design, and identical code to Horizon, so Horizon's documentation and patterns apply directly.

### D2. Vendor updates: a vendor branch

- **Options:** an `upstream` remote to Shopify/horizon, a fork, or a `vendor/dwell` branch that receives each release.
- **Trade-offs:** an upstream remote would track Horizon, not Dwell, whose preset and locales aren't on GitHub. A fork is the same problem. A vendor branch gives a clean three-way merge base for each Dwell release.
- **Decision:** `vendor/dwell` branch, merged into `main` through a pull request.
- **Reason:** it's the simplest way to see exactly what Dwell changed versus what we changed.

### D3. Glaze data model

- **Options:**
  - native swatches, with the Colour option linked to a custom Glaze metaobject;
  - a hex value in a metafield on each variant;
  - a plain-text Colour option plus a variant metafield referencing a Glaze metaobject.
- **Trade-offs:**
  - Linked options returned an empty `swatch` for a custom metaobject in an admin test, and the picker stayed a dropdown. Only Shopify's own category "Color" options get swatches (see [docs/admin-setup.md](docs/admin-setup.md#swatch-test)).
  - Hex per variant repeats data across every planter.
  - A metaobject lets us enter a glaze once and reuse it.
- **Decision:** plain-text Colour option plus `custom.glaze` → Glaze metaobject. No native swatches.
- **Reason:** it works with the data we control, and Horizon's picker keeps doing the selecting. A coloured swatch style may come in Phase 2.

### D4. Theme Check in CI, failing on errors only

- **Options:** no CI, fail on any warning, or fail on errors only.
- **Trade-offs:** Dwell ships with 6 warnings (5 `UnusedDocParam`, 1 `ExcessiveSettingsCount`) that we don't own. Failing on warnings would mean editing vendor files. Annotations are limited to changed files (`base: main`).
- **Decision:** `shopify/theme-check-action@v2` with `--fail-level error`, extending `theme-check:recommended`.
- **Reason:** it blocks real problems without forcing vendor edits.

### D5. Private repository

- **Options:** public repository, or private repository shared on request.
- **Trade-offs:** the Horizon licence restricts distributing themes based on its code, so a public repo containing the whole theme is a risk. A private repo is harder for employers to browse. GitHub Free also doesn't offer branch protection on private repos, so `main` is protected by process (branches, pull requests, CI) rather than by a rule.
- **Decision:** private. Grant read access to reviewers on request.
- **Reason:** it respects the licence. This isn't legal advice.

### Spelling exceptions

Our identifiers use Australian spelling. American spelling appears only where an external API requires it.

| Identifier | Where | Required by |
|---|---|---|
| *None yet* | | |

## Performance baseline

Lighthouse 13.4.1 in Chrome 154 DevTools, mobile. Measured 11 Oct 2026 on the published theme (untouched Dwell 4.2.0) with the storefront password unlocked. **One run per page**, so allow for about ±5 points of run-to-run variance.

| Page | Mode | Score | LCP | CLS | TBT | INP |
|---|---|---|---|---|---|---|
| Home `/` | Navigation | 77 | 5.5 s | 0 | 120 ms | n/a |
| Planter product page `/products/bell-planter-15cm` | Navigation | 80 | 3.8 s | 0.105 | 110 ms | n/a |
| Collection `/collections/all` | Navigation | 70 | 7.4 s | 0 | 70 ms | n/a |
| Cart drawer open (Add to cart on planter page) | Timespan | n/a | n/a | 0.005 | 30 ms | 110 ms |
| Plant product page | Navigation | Not measured yet: no plant product exists. Measure before `feat/pb-care-label`. | | | | |

Notes:

- Navigation runs use simulated throttling. The timespan run uses DevTools throttling. Navigation runs can't measure INP, so TBT is the lab proxy.
- The LCP element is text on every page (home `<p>`, product `<h1>`, collection `<span>`), so font loading drives LCP.
- Fonts loaded: Newsreader (300, 400, 700 and italic) and Red Hat Display 500 from Dwell's preset. GT Standard also loads from `cdn.shopify.com/shop-assets/…`, which appears to be injected by Shopify rather than by the theme *(unconfirmed)*.
- Planter product page CLS of 0.105 comes from Dwell's media-with-content section in the product template. That's just over the 0.1 "good" threshold. It's vendor behaviour and is left untouched.
