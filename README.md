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

### Keeping local files in sync

GitHub is the source of truth for theme files. Admin data (products, metafields, metaobjects, collections, settings) lives in the store database, never in the repo, so there's nothing to pull for it. `shopify theme dev` reads it live: refresh the preview.

| Situation | Is GitHub ahead of your computer? | What to do |
|---|---|---|
| Before starting a new branch | Maybe (a customiser save or a merged PR) | `git switch main`, then `git pull`, then create the branch |
| Just merged a PR on GitHub | Yes | `git switch main`, then `git pull`, then delete the local branch |
| Saved in the theme editor on **pottingbench/main** | Yes: the integration committed to `main` | `git switch main`, then `git pull` |
| Changed admin data (products, metafields, metaobjects, settings) | No: nothing is committed anywhere | Nothing to pull. Update `docs/admin-setup.md` if the steps differed. |
| Working on your own feature branch | No: only you push to it | Nothing to pull |
| Want another theme's files | n/a | **Never run `shopify theme pull` inside this repo.** If you must inspect another theme, pull it into a separate scratch folder. |

Before any pull: run `git status`, check you're on the branch you expect, and that there are no uncommitted changes. `git pull` = `git fetch` + `git merge` into the **current** branch. In GitHub Desktop it's **Fetch origin**, then **Pull origin**.

**Rule:** pull `main` before you branch, after you merge, and after any customiser save.

## Data model

| Resource | Definition | Fields / type | Used by | Status |
|---|---|---|---|---|
| Metaobject | Glaze (`glaze`) | `name` single line text (required), `colour` colour (required), `finish` single line text (Gloss, Satin, Matte), `pattern_image` file, images only (optional) | `pb-glaze-accent` | Created |
| Variant metafield | `custom.glaze` | Metaobject reference → Glaze, one entry | `pb-glaze-accent` | Created |
| Product option | Colour | Plain text (Celadon, Tenmoku, …). Not linked to a metafield. | Horizon variant picker | Created on all 3 planters |
| Metaobject | Plant care (`plant_care`) | `botanical_name` single line text (required); `light`, `water`, `humidity`, `difficulty` single line text limited to fixed values by regex validation (required); `pet_safe` single line text with the same kind of regex validation (optional: blank means unknown) | `pb-care-label` | Created |
| Product metafield | `custom.care` | Metaobject reference → Plant care, one entry | `pb-care-label` | Created |
| Product metafield | `custom.live_plant` | True or false. True on plants, False on everything else, set explicitly (blank = not reviewed; the theme treats it as false). | `cart-live-plant-notice` | Created |
| Product type | `Indoor plant`, `Pot`, `Potting mix & fertiliser` | Drives the 3 automated collections | Collections | Created |
| Collections | `indoor-plants`, `pots-planters`, `potting-mix-fertiliser` | Condition: Type is equal to … (new collections model) | Navigation, collection pages | Created |

Values and the full catalogue are in [docs/admin-setup.md](docs/admin-setup.md#catalogue-and-plant-care).

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

### D6. Plant care data model

- **Options:**
  - six product metafields, or one `plant_care` metaobject referenced by `custom.care`;
  - choice values stored as display text, or as keys that the theme maps to locale strings;
  - pet safety as True or false, or as text limited to two values.
- **Trade-offs:**
  - Plants and care entries are 1:1 today, so product metafields would work. A metaobject groups the care fields in one definition and needs only one reference per product.
  - Keys plus locale strings keep wording in code, but every new value would need a deploy. Display text limited to fixed values still gives consistent tags, and the metaobject's translations cover other languages.
  - Preset choices (a dropdown) exist for single line text metafields, but admin doesn't offer them for metaobject fields: only Character limit and Regular expression (checked 12 Oct 2026). An anchored regex such as `^(Low|Average|High)$` enforces the same exact values, without the dropdown.
  - True or false is a checkbox in admin, so "never set" and "unticked" look the same, and that can't express "unknown". Optional text with two allowed values makes blank mean unknown.
- **Decision:** a `plant_care` metaobject. Values are display text, limited by regex validation. Pet safety is optional text: "Non-toxic to cats and dogs" or "Toxic to cats and dogs".
- **Reason:** it's the simplest model that keeps tags consistent and never shows a pet-safety claim we haven't checked. The wording matches the ASPCA list, which says "non-toxic", not "safe".

### D7. Collection rules

- **Options:** manual collections, automated by tag, automated by product type, automated by Shopify's standard product category, or automated by the `custom.live_plant` metafield (Shopify supports True or false metafield conditions).
- **Trade-offs:** manual collections drift as products are added. Tags are free text and easy to mistype. Product type gives each product exactly one category, so the same rule works for all 3 collections. Shopify's standard Category is also a condition, but the supplies collection would need two (Soil or Fertilizers, "match any"), and it follows Shopify's taxonomy rather than our own merchandising. The `live_plant` flag would only cover plants, and it duplicates the product type for plants. That's accepted because it states the shipping rule directly; a data check in `docs/admin-setup.md` catches a plant left False or blank.
- **Decision:** automated by product type. `live_plant` stays a separate flag for the cart notice.
- **Reason:** one consistent rule, and the business rule (live plants) stays explicit rather than inferred from a type string in Liquid.

### D8. Product name: Golden Pothos, not Devil's Ivy

- **Options:** keep "Devil's Ivy" (a common Australian retail name), rename to "Pothos", or rename to "Golden Pothos".
- **Trade-offs:** Google Trends (Australia, 5 years, checked 16 Oct 2026) showed more search interest for pothos than for devils ivy. "Pothos" alone covers several cultivars (Marble Queen, Neon), so it's less precise than the product we sell. Renaming before launch costs nothing: the store is password-protected and nothing is indexed.
- **Decision:** title **Golden Pothos**, handle `golden-pothos`. "Devil's Ivy" stays in the SEO title and the description, so both names are searchable.
- **Reason:** lead with the name customers search for, keep it accurate to the cultivar, and still match people who know the other name.

### D9. Product images: AI-generated, not stock photos

- **Options:** stock photos (Unsplash or Pexels), AI-generated images (Google Gemini), or photographing real products.
- **Trade-offs:** stock photos show real plants, but no stock photo shows our exact glazes, so the variant images wouldn't match the glaze names. AI can show every glaze on the same planter shape, with one consistent background, but it shows goods that don't exist. AI images also need checking: one batch gave the Bell Planter 15cm a different shape from the 20cm. A real merchant has no choice: images must show the actual goods, or customers could be misled under the Australian Consumer Law.
- **Decision:** AI-generated with Gemini, disclosed in this README.
- **Reason:** the store is a disclosed concept with no real stock, and per-variant images are needed to test the variant picker and the glaze accent.

### D10. Baseline v2 includes a planter product page

- **Options:** keep v2 to the three pages first planned (Home, Golden Pothos, Collection), or add a planter page.
- **Trade-offs:** v1's planter row was measured before the planter had any images, so it's no longer a fair "before" for `feat/pb-glaze-accent`. Bell Planter 20cm has its final images; the 15cm's are being regenerated (step 11c). One more run costs about two minutes.
- **Decision:** add `/products/bell-planter-20cm` to v2. Leave the cart drawer until just before `feat/cart-free-shipping`.
- **Reason:** every feature compares against a baseline of the page it changes.

### Spelling exceptions

Our identifiers use Australian spelling. American spelling appears only where an external API requires it.

| Identifier | Where | Required by |
|---|---|---|
| *None yet* | | |

## Images

**Product images are AI-generated with Google Gemini.** They don't show real stock. This is a concept store, and a real merchant must photograph the goods they actually sell (see D9). All images are 4:5 portrait.

The images are uploaded as JPEG masters (about 2 MB each). Customers never download the masters: `image_url` requests a resized copy, and Shopify's CDN re-encodes it as WebP (or JPEG XL) for the browser. In the v2 baseline each product image arrived at 3–79 KB.

## Performance baseline

Lighthouse 13.4.1 in Chrome DevTools (Chrome 154 for v1, Chrome 155 for v2), mobile. **One run per page**, so allow for about ±5 points of run-to-run variance.

### v1: untouched Dwell, before the catalogue was loaded

Measured 11 Oct 2026 on the published theme (untouched Dwell 4.2.0) with the storefront password unlocked.

| Page | Mode | Score | LCP | CLS | TBT | INP |
|---|---|---|---|---|---|---|
| Home `/` | Navigation | 77 | 5.5 s | 0 | 120 ms | n/a |
| Planter product page `/products/bell-planter-15cm` | Navigation | 80 | 3.8 s | 0.105 | 110 ms | n/a |
| Collection `/collections/all` | Navigation | 70 | 7.4 s | 0 | 70 ms | n/a |
| Cart drawer open (Add to cart on planter page) | Timespan | n/a | n/a | 0.005 | 30 ms | 110 ms |

Notes:

- Navigation runs use simulated throttling. The timespan run uses DevTools throttling. Navigation runs can't measure INP, so TBT is the lab proxy.
- The LCP element is text on every page (home `<p>`, product `<h1>`, collection `<span>`), so font loading drives LCP.
- Fonts loaded: Newsreader (300, 400, 700 and italic) and Red Hat Display 500 from Dwell's preset. GT Standard also loads from `cdn.shopify.com/shop-assets/…`, which appears to be injected by Shopify rather than by the theme *(unconfirmed)*.
- Planter product page CLS of 0.105 comes from Dwell's media-with-content section in the product template. That's just over the 0.1 "good" threshold. It's vendor behaviour and is left untouched.

### v2: untouched Dwell code, after the catalogue was loaded

Same conditions as v1, measured after the 10 products, images and 3 collections were added (`chore/data-model`). The catalogue changes what Home and Collection render, so v1 isn't a like-for-like comparison any more. **Later features compare against v2.**

Measured 19 Oct 2026. Dwell's code is still untouched, but two theme editor changes came first:

- 17 Oct 2026 (commit `89197db`): product media aspect ratio `1` (square, was `1/1.25`), thumbnails on the left, media corner radius 8.
- 19 Oct 2026 (commits `a280d58`, `19b748f`): a second product list on Home, showing the Indoor Plants collection, above the existing one.

| Page | Mode | Score | LCP | CLS | TBT | INP | LCP element |
|---|---|---|---|---|---|---|---|
| Home `/` | Navigation | 74 | 6.1 s | 0 | 80 ms | n/a | Text: Dwell's demo `<p>` in the second section |
| Plant product page `/products/golden-pothos` | Navigation | 66 | 7.5 s | 0 | 150 ms | n/a | Image: first product photo |
| Planter product page `/products/bell-planter-20cm` | Navigation | 80 | 4.0 s | 0 | 190 ms | n/a | Image: first product photo |
| Collection `/collections/all` | Navigation | 77 | 4.8 s | 0 | 170 ms | n/a | Image: first product card |

Notes:

- **Images aren't the bottleneck.** Each product image arrived as WebP or JPEG XL at 3–79 KB. Images were 3–19% of each page's 2.2–2.3 MB. On both product pages the LCP image passed all three Lighthouse discovery checks (`fetchpriority=high`, in the initial HTML, not lazy-loaded) and downloaded in about 50 ms in the observed trace.
- **The two product pages share a template but differ by 3.5 s of LCP.** FCP differs too (3.8 s against 2.7 s), and FCP comes before any image paints, so this is most likely run-to-run variance in a single run, not the Golden Pothos images (69 KB more). Treat the Golden Pothos row with caution, and use the median of three runs when a feature changes the product page.
- **Bigger costs than images:**
  - fonts, at 220–375 KB per page (four Newsreader files plus GT Standard);
  - render-blocking CSS: `compiled_assets/styles.css` (50 KB), `base.css`, and on product pages `accelerated-checkout.css`;
  - the dynamic checkout buttons' `portable-wallets` script (83 KB, high priority);
  - about 970 KB of `checkout-web` scripts that Shopify prefetches at the lowest priority, which isn't theme code.
- **Collection:** the LCP card image has no `fetchpriority=high`, and the cards download 635 px images for 403 px slots (Lighthouse estimates 114 KiB of savings). This is Horizon card behaviour *(cause unconfirmed)*.
- **Product pages:** CLS is now 0. v1's 0.105 no longer appears; the cause wasn't investigated.
- **Cart drawer:** not re-measured. Re-measure it before `feat/cart-free-shipping`.
