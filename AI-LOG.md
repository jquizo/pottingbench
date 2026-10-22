# AI log

One entry per feature. AI tool: Claude (Claude Code). I review and decide; the "Outcome" line is mine.

---

## 2026-10-11 · chore/project-setup

**What AI produced**

- Architecture research on Dwell 4.2.0 / Horizon 4.2.0:
  - colour palette and `contrast-override` instead of colour schemes;
  - theme blocks with inline `{% stylesheet %}`;
  - `@shopify/events` (`shopify:product:select`, `shopify:cart:lines-update`) replacing the old events;
  - the cart drawer re-rendering through `morphSection` in hydration mode.
- The glaze data model after the failed swatch test (README D3), and the admin click-by-click steps in `docs/admin-setup.md`.
- Corrections to `CLAUDE.md`; the README (base theme record, vendor update flow, decision log D1–D5, data model, baseline); the Theme Check config and CI workflow.
- Extraction of the Lighthouse baseline numbers from my four exported reports.

**What I should verify**

- [ ] `.cart-drawer__inner` has `data-hydration-key="cart-drawer-inner"` (`snippets/cart-drawer.liquid`), and a snippet inside it re-renders after a cart change.
- [ ] The `shopify:product:select` payload shape (`event.promise` resolving to `{ variant, detail }`) in `assets/variant-picker.js` and `assets/product-sku.js`.
- [x] The Theme Check workflow runs on the first pull request and adds annotations (needs `checks: write`).
- [ ] The README baseline numbers match the Lighthouse reports.
- [ ] The glaze field keys in admin are exactly `name`, `colour`, `finish`, `pattern_image`.

**What AI was unsure about**

- The admin UI wording for storefront access and the variant metafield "Show all" link (flagged in `docs/admin-setup.md`).
- Where the GT Standard font on every page comes from. It loads from `cdn.shopify.com/shop-assets/…` and looks Shopify-injected, not theme-owned.
- **Correction to earlier research:** Dwell's fonts are Newsreader and Red Hat Display, set in `config/settings_data.json`, not Work Sans and Anonymous Pro. Those are Horizon's schema defaults, which Dwell's preset overrides.
- Whether a single Lighthouse run per page is stable enough. It was one run, not the median of three.

**Outcome (accepted / changed / rejected):**

---

## 2026-10-12 · chore/data-model

**What AI produced**

- The `plant_care` metaobject design: field keys, types, preset choices, and optional pet safety where blank means unknown (README D6).
- The collection rules decision (README D7) and the full catalogue in `docs/admin-setup.md` (steps 5–13): 10 products, 3 automated collections, SEO fields, images, data checks.
- One-sentence product descriptions, collection descriptions, and the water and humidity values for each plant.
- Five push-backs on the approved plan, all accepted:
  - pet safety as optional text, not True or false;
  - "from $120" rather than "over $120";
  - "everywhere in Australia except WA and Tasmania" (the NT and ACT aren't states);
  - the unverifiable "sized to fit our plants" claim removed;
  - a v2 baseline, because the catalogue changes Home and Collection.
- Docs checked:
  - [Validation options](https://shopify.dev/docs/apps/build/metafields/list-of-validation-options)
  - [Metafield types (Help Center)](https://help.shopify.com/en/manual/custom-data/metafields/metafield-definitions/metafield-types)
  - [Automated collection conditions](https://help.shopify.com/en/manual/products/collections/automated-collections/auto-select)
  - Liquid [metaobject](https://shopify.dev/docs/api/liquid/objects/metaobject) and [metafield](https://shopify.dev/docs/api/liquid/objects/metafield)

**What I should verify**

- [x] Pet safety for all 5 plants against the ASPCA list, before entering any value (13 Oct 2026: only *Chamaedorea elegans* is non-toxic).
- [ ] Water and humidity values against a horticultural source.
- [ ] The plant_care field keys in admin are exactly `botanical_name`, `light`, `water`, `humidity`, `pet_safe`, `difficulty`.
- [ ] The product handles match `docs/admin-setup.md`, especially `golden-pothos` (renamed from Devil's Ivy on 16 Oct 2026; Shopify may have kept the old handle).
- [x] Both test carts total exactly $119.95 and $120.00 (19 Oct 2026).
- [x] Each collection shows the right products, in admin and on the storefront (19 Oct 2026).

**What AI was unsure about**

- What Liquid returns for an unset metaobject field. The Liquid docs don't say. It's assumed to be nil and will be tested in `feat/pb-care-label`.
- Whether Liquid needs Storefronts access on a metaobject definition. The docs don't say, so it's kept On, as for Glaze.
- Admin labels for preset choices, storefront access, the product URL handle, image alt text and the collection SEO fields (flagged in `docs/admin-setup.md`).
- Whether the automated collection "Product type is equal to" condition is case-sensitive. Help Center doesn't say.
- **Correction:** AI said metaobject fields could use "preset choices". The validation options page only covers metafield definitions, and admin offered only Character limit and Regular expression for metaobject fields. Replaced with anchored regex validation (D6 updated).
- Whether an optional field with a regex accepts a blank value. **Tested 13 Oct 2026:** a blank Pet safety saved, and `low` in Humidity was rejected.
- Whether the regex also checks translated values. Untested; it doesn't matter while the store is English-only.

**Outcome (accepted / changed / rejected):**

---

## 2026-10-19 · chore/baseline-v2

**What AI produced**

- Analysis of the four Lighthouse v2 JSON reports: scores, LCP elements, image responses, render-blocking CSS, fonts and page weight. The results and notes are in the README v2 table.
- Push-back on re-uploading smaller JPEGs to speed the site up. The reports show each image arrives as WebP or JPEG XL at 3–79 KB, whatever the master size, and the LCP image downloads in about 50 ms.
- D10 (a planter page in baseline v2), and corrections to `docs/admin-setup.md` step 11: images uploaded as JPEG, and the alt text table is guidance, not exact wording.
- The retrospective end-of-feature pack for `chore/data-model` (PR #2), delivered in the `chore/baseline-v2` pull request.

**What I should verify**

- [ ] The README v2 numbers match the four reports (Home 74, Golden Pothos 66, Bell Planter 20cm 80, Collection 77).
- [ ] The Golden Pothos row: re-run it three times and compare with the median. AI thinks 7.5 s is run-to-run variance, because the Bell Planter 20cm page uses the same template and measured 4.0 s.
- [ ] Whether the home product list added in the customiser on 19 Oct (`a280d58`, `19b748f`) was meant to stay.

**What AI was unsure about**

- Whether Shopify keeps the uploaded file's extension in CDN URLs. AI inferred the JPEG upload from the `.jpg` URLs, and you confirmed it.
- The cause of the collection cards' oversized images (635 px for 403 px slots): probably Horizon's `sizes` attribute, but the code wasn't read.
- How much Shopify's prefetched `checkout-web` scripts (about 970 KB) affect simulated LCP.
- Why v1's planter page CLS of 0.105 has gone. Not investigated.
- **Correction:** the LCP element audit has moved. In Lighthouse 13 it's under Insights → "LCP breakdown", not Diagnostics.

**Outcome (accepted / changed / rejected):**

---

## 2026-10-19 · feat/gst-labels

**What AI produced**

- A trace of Horizon's tax wording: the product price block ([blocks/price.liquid:62](blocks/price.liquid)) and the cart summary ([snippets/tax-info.liquid](snippets/tax-info.liquid)).
- A Horizon quirk: with the discount code field on (the default), the cart shows "Duties and taxes included" even when no duties apply (`tax-info.liquid:32`, `:38`).
- 5 locale string changes to "Includes GST", D11, a README overrides row, and step 14 in `docs/admin-setup.md` (AUD on product pages).
- Docs checked: [cart object](https://shopify.dev/docs/api/liquid/objects/cart) and [change theme wording](https://help.shopify.com/en/manual/online-store/themes/customizing-themes/language/change-wording).

**What I should verify**

- [x] Product page: "Includes GST." shows under the price, with a space before "Shipping calculated at checkout." if the store has a shipping policy (`blocks/price.liquid:70-73` has no space between the two strings).
- [x] Cart drawer: "Includes GST. Shipping calculated at checkout." and no mention of duties. (Both checked in `shopify theme dev`, 19 Oct 2026.)
- [ ] After step 14: prices on product pages show "AUD".
- [ ] Theme Check in CI: 0 errors, 6 vendor warnings.

**What AI was unsure about**

- Where admin "Edit default theme content" edits are stored. Help Center doesn't say, which is one reason the locale file was chosen.
- The customiser path to the currency code settings (flagged in step 14).

**Outcome (accepted / changed / rejected):**

---

## 2026-10-20 · feat/brand-tokens

**What AI produced**

- A trace of how Horizon handles colour and type: the palette (`snippets/color-palette.liquid`), per-block contrast (`snippets/contrast-override.liquid`), font loading (`snippets/fonts.liquid`, `snippets/theme-styles-variables.liquid`) and the settings behind them.
- The recommendation to do this feature as customiser settings with no code (README D12), and the two-font-file plan with Horizon's `swap` kept (D13).
- Customiser steps 15–17 in `docs/admin-setup.md`, the README known-issues list, and step 14 ticked.
- Contrast ratios computed with the WCAG 2.x formula: `#111111` on `#F7F7F5` 17.60:1; muted text (60% opacity) 4.83:1, where Dwell's was 3.11:1 and failed; input borders 1.18:1 → 4.25:1 with `#767672`; checkbox borders 2.25:1 (left as a known issue).
- Docs checked:
  - [Font library](https://shopify.dev/docs/storefronts/themes/architecture/settings/fonts) (Fraunces and Work Sans are both listed, 100–900 plus italics)
  - [Input settings: font_picker, color_palette](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings)
  - [font_face](https://shopify.dev/docs/api/liquid/filters/font_face), [font_url](https://shopify.dev/docs/api/liquid/filters/font_url), [font_modify](https://shopify.dev/docs/api/liquid/filters/font_modify)

**What I should verify**

- [x] After step 17: the preloaded fonts are Fraunces 400 and Work Sans 400, and each file is requested once (4 preload tags point at 2 URLs). Checked in the after-run reports, 20 Oct 2026.
- [x] One bold file loads on every page: Work Sans 700 (23 KiB). Fraunces italic 400 (93 KiB) loads on Home and the planter page, triggered by `<em>` in Dwell's placeholder headings.
- [x] CLS stays at or below the before-runs after the font swap (0 on all three pages).
- [x] Keyboard: skip link, header, search (Escape returns focus) and Add to cart show visible focus on `#F7F7F5` and `#111111` (20 Oct 2026). **Found:** the Colour dropdown's focus outline is invisible (Horizon's `overflow: clip`). Fix in `fix/variant-select-focus`.
- [x] Uppercase accent labels (menu, H4, H6, badges) still read well at weight 400 (you checked, 20 Oct 2026).
- [x] Lighthouse before-runs, 1 run per page (your choice): Home, Bell Planter 20cm, `/collections/all` (20 Oct 2026). AI extracted the numbers from the JSON reports.
- [x] Lighthouse after-runs with the same settings (20 Oct 2026): theme fonts 308 → 214 KiB (Home, Planter) and 230 → 122 KiB (Collection).

**What AI was unsure about**

- The customiser labels for the colour palette, input field borders and fonts (flagged in steps 15–17). The setting names came from `locales/en.default.schema.json`.
- The on-screen order of the palette swatches. AI gave positions in file order without flagging strongly enough that the screen might differ, and two saves changed the wrong swatch (fixed in `1d2f8d0`). Steps now say to match by hex.
- The fallback fonts Shopify lists for Fraunces and Work Sans (`font.fallback_families`), and so how much the swap shifts layout.

**Outcome (accepted / changed / rejected):**

---

## 2026-10-21 · fix/variant-select-focus

**What AI produced**

- A trace of the bug: the select's focus outline (`snippets/variant-picker-styles.liquid:52-55`) is drawn outside the select, and the wrapper's `overflow: clip` (`:34`) cuts it off. `assets/base.css:235-238` gives every element the same outline, so it's clipped too.
- A check of `:210`: no bug. It's the button-style variant label, which draws its ring on itself (`:367-373`), and an element's own `overflow` doesn't clip its own outline. That's the pattern the fix copies. (The brief called `:210` the swatch dropdown; the swatch dropdown is the same wrapper, `:38`, so this fix covers it.)
- The fix: one selector change plus a comment, a README overrides row, D14, and the known-issues update.
- A new finding, logged as a known issue: the dropdown's border is `#E9E4E0`, 1.18:1 on the page.
- Docs: none from Shopify needed (CSS only). WCAG [Understanding 2.4.7](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html) and [Understanding 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html), cited from memory.

**What I should verify**

- [x] Keyboard: Tab to the Colour dropdown (Bell Planter 20cm) and the Size dropdown (Golden Pothos). A dark ring shows on all four sides, at desktop and mobile widths.
- [x] The ring doesn't touch the option label above it (the ring extends about 4.7 px and the gap is 4.8 px).
- [x] Hovering while focused keeps the ring visible.
- [x] What a mouse click on the dropdown does: **the ring shows on a mouse click too.** Acceptable: it's the browser's own `:focus-visible` choice for a `<select>`, not something the fix added (why the browser matches on a click wasn't checked).
- [x] The sticky add-to-cart bar doesn't cover the focused dropdown (WCAG 2.4.11).
- [x] Theme editor (development theme from `shopify theme dev`): the variant picker block still renders and its settings still apply.
- [x] Theme Check: 0 errors, 6 vendor warnings (local run, 20 Oct 2026). PR #6 merged 21 Oct 2026.
- All checks above were reported done on 21 Oct 2026.

**What AI was unsure about**

- How browsers apply `:focus-visible` to a `<select>` clicked with the mouse.
- Whether Safari now supports `overflow-clip-margin`. AI relied on Horizon's own comment (`:228`) and didn't check.
- The customiser path to the variant border setting (Theme settings → Variant pickers → Variant settings → Borders, taken from `config/settings_schema.json` and the schema locale).
- Whether Shopify's public Horizon repository accepts bug reports.

**Outcome (accepted / changed / rejected):**

---

## 2026-10-21 · feat/concept-labelling-pages

**What AI produced**

- A trace of where labels can go: the announcement block (`sections/header-announcements.liquid`), footer Text blocks (`sections/footer.liquid:106`), the policy list (`blocks/footer-policy-list.liquid`) and the password page (`layout/password.liquid:43`, no announcement bar).
- The recommendation to do it as content, not code (README D15), with the wording in `docs/page-copy.md` and steps 18–26 in `docs/admin-setup.md`.
- The About page, Shipping policy and Return policy wording, including the standard ACL guarantee paragraph.
- Contrast: announcement text `#F7F7F5` on `#7D5449`, 6.05:1. You then changed the bar to `#111111` (22 Oct 2026, intentional): `#F7F7F5` on `#111111`, 17.60:1 (`snippets/contrast-override.liquid:59-83` picks the lightest palette colour).
- **Correction:** the docs said the About page handle was `about`. The store's is `about-us` (found in step 24).
- A predicted bug: once a shipping policy exists, the product price line may lose the space before "Shipping calculated at checkout." (`blocks/price.liquid:66-73`).
- Docs checked: [policies](https://help.shopify.com/en/manual/checkout-settings/refund-privacy-tos), [menus](https://help.shopify.com/en/manual/online-store/menus-and-links), [password page](https://help.shopify.com/en/manual/online-store/themes/password-page), [WA Consumer Protection: "no refunds"](https://www.consumerprotection.wa.gov.au/consumer-protection/no-refunds-0). The ACCC site blocked the fetch (403).

**What I should verify**

- [ ] The ACL paragraph against the Competition and Consumer Regulations 2010 (AI quoted it from memory).
- [x] The price line spacing after step 19: **no bug** (21 Oct 2026). AI's prediction from the Liquid whitespace tags was wrong; what adds the space wasn't investigated.
- [ ] Steps 18–26 done, and the step 26 keyboard checks.

**What AI was unsure about**

- The admin labels for pages, policies, menus and hiding a block (flagged in steps 18–25).
- Whether the menu link picker offers policies directly.
- What Shopify's automated return template says (not used).

**Outcome (accepted / changed / rejected):**
