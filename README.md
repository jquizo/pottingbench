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
| `locales/en.default.json` | 5 `content.*` tax strings say "Includes GST" instead of "Taxes included" or "Duties and taxes included": `taxes_included`, `taxes_included_shipping_at_checkout_without_policy`, `taxes_included_shipping_at_checkout_with_policy_html`, `duties_and_taxes_included_shipping_at_checkout_without_policy_without_discounts`, `duties_and_taxes_included_shipping_at_checkout_with_policy_without_discounts_html` | Australian GST labelling. Horizon's cart shows the "duties" strings whenever the discount code field is on (`snippets/tax-info.liquid:32`, `:38`). On a Dwell update, keep our values for these 5 keys. See D11. | `feat/gst-labels` |
| `snippets/variant-picker-styles.liquid` | The `:focus-visible` rule at `:52-56` moves from `.variant-option__select` to `.variant-option__select-wrapper:has(.variant-option__select:focus-visible)`, with a one-line comment | The wrapper's `overflow: clip` (`:34`) hid the dropdown's focus ring (WCAG 2.4.7). On a Dwell update, keep this selector unless Dwell has fixed the bug. See D14. | `fix/variant-select-focus` |

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

### D11. GST labels: edit Horizon's locale strings

- **Options:** change 5 strings in `locales/en.default.json`; change the wording in admin (Online Store → ⋯ → Edit default theme content); or add a `pb-` snippet with its own keys.
- **Trade-offs:** the locale edit touches a vendor file, so Dwell updates need our 5 values kept, but it's tracked in Git and reviewable. Help Center doesn't say where admin wording edits are stored ([change wording](https://help.shopify.com/en/manual/online-store/themes/customizing-themes/language/change-wording)), so they'd be invisible in the repo. A `pb-` snippet still means editing 2 core call sites (`blocks/price.liquid`, `snippets/cart-summary.liquid`).
- **Decision:** edit the 5 locale strings. "GST" is hard-coded because the store sells in Australia only. A multi-market store would need wording per market (Shopify Markets with translations per language or market).
- **Reason:** the smallest change that labels prices correctly. It also stops the cart claiming duties are included.
- **Caveat:** a real business may only say "Includes GST" once it's registered for GST. This concept store isn't (see [docs/admin-setup.md](docs/admin-setup.md#store-basics)). This isn't legal advice.

### D12. Brand colours and fonts: theme settings, not code

- **Options:** change the colour palette and fonts in the customiser; edit `config/settings_data.json` on the branch; or add `pb-` CSS custom properties that override Horizon's.
- **Trade-offs:** Horizon already turns the palette into `--color-*` tokens (`snippets/color-palette.liquid:167-232`) and the fonts into `--font-*` tokens (`snippets/theme-styles-variables.liquid:163-174`), and almost every colour setting references the palette. Editing `settings_data.json` on a branch is reviewable in the PR, but it conflicts with any customiser save made before the merge, and the editor reorders keys. `pb-` overrides would be a parallel system that the customiser can't see.
- **Decision:** customiser steps 15–17 in [docs/admin-setup.md](docs/admin-setup.md#brand-tokens-featbrand-tokens). No Liquid, CSS or locale changes. `--pb-glaze` comes in `feat/pb-glaze-accent`, where something uses it.
- **Reason:** the merchant can keep changing the brand without a developer, and the code stays mergeable with Dwell.

### D13. Fonts: two files, Horizon's `font-display: swap`

- **Options:** different weights per role (closer to Dwell's look, more files) or one weight per font; keep Horizon's `swap` or change it to `optional`.
- **Trade-offs:**
  - Dwell preloads 3 font files (Newsreader 300 and 400, Red Hat Display 500), and pages also use Newsreader bold 700 (every page) and an italic (Home and the planter page): 4–5 theme font files per page, about 230–310 KiB (v3 before-runs). Fraunces 400 for heading and subheading, and Work Sans 400 for body and accent, cut the preloaded files to 2. Bold and italic faces are declared (`font_modify`) and browsers download them only when a page uses them, so expect one bold file on every page and an italic where content uses one. Work Sans 500 for the accent role would give sturdier uppercase labels for 1 more file.
  - `swap` shows text at once in a fallback font, then swaps, which can shift layout (CLS). `optional` avoids the shift, but brand fonts may not show on a slow first visit, and it means editing 16 `font_face` calls in a core file (`snippets/theme-styles-variables.liquid:45-123`).
  - Horizon preloads each role's font at low priority (`snippets/fonts.liquid`), so the fonts don't compete with the LCP image. Both fonts appear above the fold on every page.
- **Decision:** Fraunces 400 and Work Sans 400 as the base fonts; keep `swap` and Horizon's preloads unchanged.
- **Reason:** the fewest font bytes with no core edits. If CLS rises above 0.05, the next step is a size-matched fallback `@font-face`.

### D14. Variant dropdown focus ring: draw it on the wrapper

- **Options:** move the outline from the `<select>` to its wrapper; a negative `outline-offset` on the select; remove the wrapper's `overflow: clip`; `overflow-clip-margin` on the wrapper; or a separate `pb-` stylesheet.
- **Trade-offs:**
  - The wrapper's `overflow: clip` (`snippets/variant-picker-styles.liquid:34`) cuts off anything its children draw outside it, including the select's outline. An element's own outline isn't clipped by its own `overflow`, so an outline on the wrapper shows. Horizon already does this for button-style variants (`:367-373`, with `overflow: clip` at `:210`).
  - A negative offset puts the ring over the text, unlike every other control.
  - The clip stops the select's square background (on hover, `:48-50`) painting past the wrapper's rounded corners. Removing it is invisible at our 0 px input radius, but breaks if the radius is raised in the customiser.
  - Horizon's own comment (`:228`) says `overflow-clip-margin` doesn't work in Safari.
  - A `pb-` stylesheet still needs a core edit to load it, and depends on the order of the compiled CSS.
  - `:has(:focus-visible)` keeps the ring for keyboard focus, like Horizon. `:focus-within` would also show it on mouse clicks.
- **Decision:** a one-selector change in place: `.variant-option__select-wrapper:has(.variant-option__select:focus-visible)`.
- **Reason:** the smallest core diff, and it follows a pattern Horizon already uses. A client build would also report the bug to Shopify so the override can be dropped later.

### D15. Concept labelling and policies: content, not code

- **Options:** labels as theme content (announcement block, footer Text block, password page text) or as a `pb-` block with a locale string; shipping and returns as pages or as Shopify policies; policies from Shopify's automated templates or written by hand.
- **Trade-offs:**
  - A `pb-` block still has to be added in the customiser, so it can be removed just as easily. It only moves content into code.
  - Shopify links policies in the checkout footer, and shows the shipping policy on product pages and in the cart; a page does neither ([Help Center](https://help.shopify.com/en/manual/checkout-settings/refund-privacy-tos)).
  - Automated templates update themselves, but Shopify says they aren't legal advice, and we haven't checked their wording against the Australian Consumer Law.
- **Decision:** theme content for the labels, an About page, and hand-written Shipping and Return policies. Wording in [docs/page-copy.md](docs/page-copy.md), steps 18–26 in [docs/admin-setup.md](docs/admin-setup.md#concept-labelling-and-pages-featconcept-labelling-pages).
- **Reason:** no code for what is merchant content, and policy wording we control.

### D16. New locale keys in English only; MatchingTranslations off

- **Options:** a script that copies each new `pb-` key, in English, into the other 55 locale files; turn off Theme Check's `MatchingTranslations`; or delete the non-English locale files.
- **Trade-offs:** `MatchingTranslations` fails CI when a key exists in `en.default` but not in the other locale files (352 errors for the care label). Shopify advises against turning it off ([MatchingTranslations](https://shopify.dev/docs/storefronts/themes/tools/theme-check/checks/matching-translations)), but the store is English-only, so shoppers never see those files. Copying the keys edits 55 vendor files on every feature that adds text. Deleting the files causes modify/delete conflicts on every Dwell update.
- **Decision:** `MatchingTranslations: enabled: false` in `.theme-check.yml`. New keys go in `locales/en.default.json` and `locales/en.default.schema.json` only.
- **Reason:** the simplest fix for an English-only store, with no vendor locale edits. A multilingual merchant would keep the check on and add each new key to every locale, using translators or Shopify's Translate & Adapt app.

### Spelling exceptions

Our identifiers use Australian spelling. American spelling appears only where an external API requires it.

| Identifier | Where | Required by |
|---|---|---|
| *None yet* | | |

## Images

**Product images are AI-generated with Google Gemini.** They don't show real stock. This is a concept store, and a real merchant must photograph the goods they actually sell (see D9). All images are 4:5 portrait.

The images are uploaded as JPEG masters (about 2 MB each). Customers never download the masters: `image_url` requests a resized copy, and Shopify's CDN re-encodes it as WebP (or JPEG XL) for the browser. In the v2 baseline each product image arrived at 3–79 KB.

## Known issues

Accepted for the concept demo. Image issues are listed in [docs/admin-setup.md](docs/admin-setup.md#catalogue-and-plant-care) (11c–11e).

- **Placeholder copy:** most home and footer text is Dwell's demo copy. The home hero's "unconditionally loved by our customers" breaks the copy rules (this store has no customers) and must go before anyone treats the site as real.
- **The footer newsletter signup collects real email addresses** for a store that doesn't trade. It stays for the demo. The password page template still has its signup (step 25 skipped: on a dev store the theme's password page doesn't control access).
- **The shipping policy says "Free shipping from $120"** before the free-shipping rate exists. It arrives in `feat/cart-free-shipping`.
- **The variant dropdown's border is faint:** Theme settings → Variant pickers → Variant settings → Borders is `color3` (`#E9E4E0`), 1.18:1 on `#F7F7F5`. It probably still passes WCAG 1.4.11, because the caret and the selected value identify the control, but it's weak. Fix in the customiser (choose the `#767672` swatch) *(unsure of current UI)*. That setting also colours the borders of button-style variants.
- **Checkbox borders** are the text colour at 35% opacity: 2.25:1 on `#F7F7F5`, below WCAG 1.4.11's 3:1. It's a Horizon CSS token (`--opacity-35-55`), so fixing it means overriding core.
- **Italic headings in placeholder copy** (`<em>` in `templates/index.json` and in "You might also like..." in `templates/product.json`) make Home and product pages download Fraunces italic (93 KiB). Remove the italic in the customiser when that copy is replaced.
- **Two hard-coded `#ffffff` values** don't follow the palette: the product hotspot bullseye (`templates/index.json`) and a label background on the collections list page (`templates/list-collections.json`). White on `#F7F7F5` barely shows; text inside stays readable.

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

### v3: `feat/brand-tokens` (fonts and palette)

Same tool and settings as v2 (Lighthouse 13.4.1, Chrome 155, mobile, Navigation, simulated throttling). **One run per page**, by choice, to ship faster, so treat score changes under about 5 points as noise. Font files and bytes don't vary between runs, so they're the main evidence for this feature.

Theme font bytes are the uncompressed size (`resourceSize`). Some runs served the preloaded fonts from cache (0 KB transferred) even with storage reset on, so transfer size isn't comparable. GT Standard (64 KB, `shop-assets/static_uploads/shoplift/`) is excluded: it isn't loaded by the theme *(source unconfirmed)*.

| Page | When | Score | LCP | CLS | TBT | Theme font files | Theme font KiB | LCP element |
|---|---|---|---|---|---|---|---|---|
| Home `/` | Before (20 Oct 2026) | 69 | 9.2 s | 0 | 80 ms | 5: Newsreader 300, 400, 700, italic 300; Red Hat Display 500 | 308 | Image: new hero |
| Home `/` | **After** (20 Oct 2026) | 79 | 5.0 s | 0 | 70 ms | 4: Fraunces 400, italic 400; Work Sans 400, 700 | **214** | Image: hero |
| Planter `/products/bell-planter-20cm` | Before (20 Oct 2026) | 72 | 5.0 s | 0 | 320 ms | 5: Newsreader 300, 400, 700, italic 400; Red Hat Display 500 | 307 | Image: first product photo |
| Planter `/products/bell-planter-20cm` | **After** (20 Oct 2026) | 89 | 3.3 s | 0 | 80 ms | 4: Fraunces 400, italic 400; Work Sans 400, 700 | **214** | Image: first product photo |
| Collection `/collections/all` | Before (20 Oct 2026) | 68 | 6.2 s | 0 | 360 ms | 4: Newsreader 300, 400, 700; Red Hat Display 500 | 230 | Image: first product card |
| Collection `/collections/all` | **After** (20 Oct 2026) | 78 | 4.6 s | 0 | 180 ms | 3: Fraunces 400; Work Sans 400, 700 | **122** | Image: first product card |

Notes on the before-runs:

- **Home isn't comparable with v2.** The hero image added in the customiser (`e66f7dd`) is now the LCP element. It's 32 KB, has `fetchpriority=high`, isn't lazy-loaded, and finished loading about 1.1 s in the observed trace, so the 9.2 s is the simulation's estimate under network contention, not a slow image.
- **Planter and Collection scored 8–9 points below v2** with no theme code changes, and TBT roughly doubled. That's single-run variance, and it's why the before-runs were repeated rather than reusing v2.
- **Bold and italic are used:** Newsreader 700 loads at high priority on every page, and an italic loads on Home and the planter page. The new fonts will need a bold file too.

Notes on the after-runs:

- **Fonts: one fewer file and 94–108 KiB less on every page** (Home and Planter 308 → 214 KiB, −31%; Collection 230 → 122 KiB, −47%). Each preloaded file was requested once, so the 4 preload tags for 2 URLs aren't a problem.
- **The bold file is Work Sans 700** (23 KiB), at high priority on every page, as expected from `font_modify` on the body font.
- **Fraunces italic 400 (93 KiB) is now the largest font file.** It loads only where a heading contains `<em>`: Dwell's placeholder copy on Home (`templates/index.json`) and "You might also like..." on product pages (`templates/product.json`). Removing that italic in the customiser would save another 93 KiB on those pages. Optional, so it's a known issue.
- **CLS stayed at 0** on all three pages, so the `swap` to Fraunces and Work Sans didn't move the layout.
- **Scores rose 10–17 points and TBT fell, but don't credit it all to fonts.** These are single runs, the fonts load at low priority, and TBT is script time that fonts don't affect. The font bytes and file counts are the reliable result; the scores only show that nothing got worse.
