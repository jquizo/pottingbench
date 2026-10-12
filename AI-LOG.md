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

- [ ] Pet safety for all 5 plants against the ASPCA list, before entering any value.
- [ ] Water and humidity values against a horticultural source.
- [ ] The plant_care field keys in admin are exactly `botanical_name`, `light`, `water`, `humidity`, `pet_safe`, `difficulty`.
- [ ] The product handles match `docs/admin-setup.md`, especially `devils-ivy` (the apostrophe).
- [ ] Both test carts total exactly $119.95 and $120.00.
- [ ] Each collection shows the right products.

**What AI was unsure about**

- What Liquid returns for an unset metaobject field. The Liquid docs don't say. It's assumed to be nil and will be tested in `feat/pb-care-label`.
- Whether Liquid needs Storefronts access on a metaobject definition. The docs don't say, so it's kept On, as for Glaze.
- Admin labels for preset choices, storefront access, the product URL handle, image alt text and the collection SEO fields (flagged in `docs/admin-setup.md`).
- Whether the automated collection "Product type is equal to" condition is case-sensitive. Help Center doesn't say.

**Outcome (accepted / changed / rejected):**
