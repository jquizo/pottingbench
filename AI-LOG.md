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
- **Correction:** AI planned step 25 (password page) without checking dev store limits. On a dev store the theme's password page doesn't control access ([development stores](https://shopify.dev/docs/api/development-stores)), so the step was skipped.
- A predicted bug: once a shipping policy exists, the product price line may lose the space before "Shipping calculated at checkout." (`blocks/price.liquid:66-73`).
- Docs checked: [policies](https://help.shopify.com/en/manual/checkout-settings/refund-privacy-tos), [menus](https://help.shopify.com/en/manual/online-store/menus-and-links), [password page](https://help.shopify.com/en/manual/online-store/themes/password-page), [WA Consumer Protection: "no refunds"](https://www.consumerprotection.wa.gov.au/consumer-protection/no-refunds-0). The ACCC site blocked the fetch (403).

**What I should verify**

- [ ] The ACL paragraph against the Competition and Consumer Regulations 2010 (AI quoted it from memory).
- [x] The price line spacing after step 19: **no bug** (21 Oct 2026). AI's prediction from the Liquid whitespace tags was wrong; what adds the space wasn't investigated.
- [x] Steps 18–24 and 26 done, step 25 skipped (22 Oct 2026).
- [x] Step 26 keyboard checks: the announcement link, footer menus and Terms and policies (opens, links reachable, Escape closes, focus returns), plus the labels on Home, a product page and a collection page (22 Oct 2026).
- [x] The focused link inside the policy popover: **clearly visible.** AI predicted a faint tint of about 1.4:1 (`blocks/footer-policy-list.liquid:67`, `:72-74`); that was wrong, and why wasn't investigated.

**What AI was unsure about**

- The admin labels for pages, policies, menus and hiding a block (flagged in steps 18–25).
- Whether the menu link picker offers policies directly.
- What Shopify's automated return template says (not used).

**Outcome (accepted / changed / rejected):**

---

## 2026-10-23 · feat/pb-care-label

**What AI produced**

- A trace of the Horizon patterns the block copies: `@theme` blocks in product details (`blocks/_product-details.liquid:80-83`), `closest.product` (`blocks/sku.liquid:7`), per-block colour through `contrast-override` (`blocks/_collection-info.liquid:4-8`), inline `{% stylesheet %}` (`blocks/product-inventory.liquid:85-115`).
- `blocks/pb-care-label.liquid` and `snippets/pb-care-label-row.liquid`: heading, botanical name, a `<dl>` with one row per filled-in field, an editor-only hint, Horizon tokens and logical properties. Locale keys in the two English files.
- The MatchingTranslations fix: AI first recommended copying the keys into all 55 other locale files; after your push-back (the store is English-only) it changed to turning the check off (README D16).
- D17, step 27, the README "Run locally" notes, the overrides row, and the 7 tests below, each explained before you ran it.
- Contrast, WCAG 2.x formula, `--opacity-muted-text` 0.6 (`snippets/theme-styles-variables.liquid:399`):

  | Colours | Text | Labels (60%, 12 px) | Left edge | Row outline (20%, decorative) |
  |---|---|---|---|---|
  | Page (`#111111` on `#F7F7F5`) | 17.60:1 | 4.83:1 | 17.60:1 | 1.55:1 |
  | Block background `#111111` (text auto `#F7F7F5`) | 17.60:1 | 6.79:1 | 17.60:1 | 1.79:1 |

  The outline doesn't need 3:1: the left edge and the text identify each row. A merchant-chosen text colour skips the automatic contrast (`snippets/contrast-override.liquid:72-74`), so it's their responsibility.
- Docs checked: [Theme Check configuration](https://shopify.dev/docs/storefronts/themes/tools/theme-check/configuration), [MatchingTranslations](https://shopify.dev/docs/storefronts/themes/tools/theme-check/checks/matching-translations).

**What I should verify**

- [x] Test 1: the preset is under Product; the planter and the potting mix show only the editor hint; all 5 plants show their rows; only Parlour Palm says "Non-toxic to cats and dogs"; the botanical name isn't italic (23 Oct 2026).
- [x] Test 2: reorder, remove and undo in the editor.
- [x] Test 3: heading (changed and empty), Show botanical name, Show pet safety, and the pet safety help text.
- [x] Test 4: background `#111111` with automatic text, padding 16, then reset.
- [x] Test 5: on the saved development theme (share preview), the planter shows nothing and Golden Pothos shows the label; `git status` stayed clean.
- [x] Test 6: Tab and Shift+Tab skip the block; the focus ring is never hidden.
- [x] Test 7: 375 px and 320 px, no sideways scrolling.
- [ ] Test 8, a blank Pet safety field: **skipped (your choice, demo scope).** The blank-value path in `snippets/pb-care-label-row.liquid` hasn't run.
- [x] Theme Check locally: 0 errors, 6 vendor warnings.
- [x] Theme Check in CI on the pull request (#8): 0 errors.
- [x] Step 27 after the merge (23–24 Oct 2026, on the live theme). The first save put the block under Price; a second save moved it below Buy buttons.

**What AI was unsure about**

- What Liquid returns for an unset metaobject field. Still untested (test 8 skipped); the row snippet's `!= blank` treats nil and an empty string the same way.
- `.value` on the metaobject-reference metafield returning the metaobject: **confirmed in practice** (test 1).
- Editor UI: how to change the preview product (you found a way; not recorded), and that the development theme shows as "Draft".
- Whether `127.0.0.1:9292` shows editor saves. Not tested; the share preview link was used instead.
- **Corrections:** AI called the group "product details"; the editor calls it **Details**. AI sent you to an editor without first checking it was the development theme, and the live theme had no Care label; the editor is link [3] in `theme dev`'s output.

**Outcome (accepted / changed / rejected):**

## 2026-10-24 · Home copy (customiser) and `chore/docs-home-copy`

**What AI produced**

- An inventory of Dwell's placeholder copy, read from `templates/index.json`, `sections/footer-group.json` and `templates/product.json`. The footer had no placeholder text saved, so the README known issue was partly wrong.
- Replacement copy for the hero and the Icons with text cards (docs/page-copy.md), checked against the copy rules. AI pushed back on "Handpicked and healthy": nothing is picked, and "healthy" reads as a promise about live goods.
- A review of the 13 bot commits: two `<h1>`s on Home (Horizon prints a hidden one, `sections/header.liquid:387`) and a card heading saved as `<p>`. Both fixed in the customiser (README D18).
- The explanation that the Text block's typography preset is only a CSS class (`snippets/text.liquid:57`), so heading levels and looks are separate.
- Docs: admin-setup steps 28–31, step 27 ticked, the confirmed live-editor check (Active label, theme ID), D18, known issues and the performance row.

**What I should verify**

- [x] Each bot commit's diff was read before pulling (23–24 Oct 2026).
- [x] Step 27 storefront checks: Golden Pothos, Parlour Palm, Bell Planter 15cm, and "You might also like" still a heading (24 Oct 2026).
- [ ] Lighthouse on Home, 1 run: **skipped (your choice, demo scope).** That Fraunces italic no longer loads is expected from the JSON, not measured.

**What AI was unsure about**

- The rich text toolbar's heading-format control name (not recorded) and the Home page entry in the page selector (unconfirmed).
- **Correction:** AI first read your sidebar report as the saved order; the bot commit showed Care label under Price. Lesson recorded in step 27: trust `block_order` in the commit.

**Outcome (accepted / changed / rejected):**

---

## 2026-10-24 · feat/pb-glaze-accent

**What AI produced**

- A trace of Horizon's variant change: `<variant-picker>` dispatches `shopify:product:select` (`assets/variant-picker.js:318-333`), fetches the product URL with `option_values` and resolves the promise with the parsed page (`:390-399`). Other blocks update themselves from `detail.html` (`assets/product-inventory.js:23-41`). No Section Rendering API on the product page.
- `blocks/pb-glaze-accent.liquid`: the glaze tag, the text colour chosen with `color_contrast` (README D19), a low-contrast fallback, the empty states, the CSS and the schema. Locale keys in the two English files.
- `assets/pb-glaze-accent.js`: **you typed pieces 1–2** (imports, class shell, listener and clean-up); **AI wrote pieces 3–4** (event handling, morph, errors) at your request, with explanations.
- Contrast, WCAG 2.x formula: Celadon 9.87:1, Tenmoku 13.50:1 (light text), Terracotta 4.61:1, Chalk 16.44:1.
- Two improvements on Horizon's own code: a new `AbortController` on every connect (`media-gallery.js` creates one once), and `morph` with Horizon's default options (`product-inventory.js:41` replaces them).
- D19, admin-setup step 32, the corrected step 13 data check, a known issue and the performance row.
- Docs checked: [metafield](https://shopify.dev/docs/api/liquid/objects/metafield), [metaobject](https://shopify.dev/docs/api/liquid/objects/metaobject), [color](https://shopify.dev/docs/api/liquid/objects/color), [color_contrast](https://shopify.dev/docs/api/liquid/filters/color_contrast), [product](https://shopify.dev/docs/api/liquid/objects/product), [high-variant products](https://shopify.dev/docs/storefronts/themes/product-merchandising/variants/support-high-variant-products), [product select event](https://shopify.dev/docs/api/storefront-events-and-actions/events/product-select.md), [standard events](https://shopify.dev/docs/storefronts/themes/best-practices/standard-events), [editing variants](https://help.shopify.com/en/manual/products/variants/edit-variants).

**What I should verify**

- [x] Step 2: the block adds from its preset below Variant picker on the Draft theme, the Celadon tag renders, and the settings show (24 Oct 2026).
- [x] Step 3: all four glazes update with the right fill and text on the share preview. In the editor it updates only after a preview reload (known issue).
- [x] Step 4: all 3 planters show the tag; plants and supplies show nothing, with the hint in the editor only. **Found:** the 20cm and Cylinder variants had no Glaze linked; you linked them, and step 13 was corrected.
- [x] Step 5: Label (changed, empty), Show finish, padding, reorder, remove and undo.
- [x] Step 6: keyboard only: arrow keys and Alt+↓ then Enter change the glaze; Tab skips the tag; focus stays visible.
- [x] Step 7: 375 px and 320 px, no sideways scrolling.
- [ ] Step 8, DevTools contrast and console: **skipped (your choice, demo scope).** The ratios above are calculated, not measured on the page.
- [x] Theme Check locally: 0 errors, 6 vendor warnings.
- [x] Theme Check in CI on the pull request (#10).
- [x] Step 32 on the live theme after the merge (24 Oct 2026): the tag follows the dropdown on all 3 planters, Tenmoku has light text, and plants and supplies show nothing.

**What AI was unsure about**

- Whether `option_values` sets `selected_or_first_available_variant`. The docs only imply it; it worked in testing.
- Whether the editor runs a block's `<script>` when the block is added. Testing showed it doesn't until a reload.
- **Corrections:** AI said Horizon's `detail` fields were untyped; they're typed in `assets/global.d.ts:105-108`. AI first planned `morph(…, { childrenOnly: true })`, which drops Horizon's default options. AI told you not to save in step 2 and guessed that was the editor problem; it wasn't.
- What Liquid returns for an unset metaobject field. Still untested (a blank Finish wasn't tried).

**Outcome (accepted / changed / rejected):**

---

## 2026-10-24 · chore/readme-demo

**What AI produced**

- The README "View the demo" section: store link, the storefront password, code access, five things to look at first, and what isn't built yet.
- A fix to the README intro, which said "free shipping from $120" as if it existed (copy rule): it now says that rate and the WA/Tasmania notice aren't built yet.
- A new copy-rule finding, logged as a known issue: the About page also lists "free shipping from $120" as if it existed.
- The answer that a dev store can't go public ("Dev stores are always password protected", "can't be converted to production stores"), so the password goes to reviewers instead.
- Docs checked: [development stores](https://shopify.dev/docs/api/development-stores), [password page](https://help.shopify.com/en/manual/online-store/themes/password-page).

**What I should verify**

- [x] Password wording: the password itself goes in the README (your choice, 24 Oct 2026). AI first kept it out of the repo; it changed its advice once you wanted anyone with the link to get in, since the store can't take orders and holds no customer data.
- [ ] The 4 screenshots, still to take and add: Bell Planter 20cm in Tenmoku (desktop), Terracotta at 375 px, the Golden Pothos care label, the editor with Glaze accent selected.
- [ ] Every link in the section opens the right page.

**What AI was unsure about**

- Whether the Shopify GitHub integration ignores `docs/images/`. It ignores `docs/` today, so it's expected to.
- Whether a share preview link (`?preview_theme_id=…`) gets past the storefront password. Neither docs page says; not tested.

**Outcome (accepted / changed / rejected):**
