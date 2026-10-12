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
- [ ] The Theme Check workflow runs on the first pull request and adds annotations (needs `checks: write`).
- [ ] The README baseline numbers match the Lighthouse reports.
- [ ] The glaze field keys in admin are exactly `name`, `colour`, `finish`, `pattern_image`.

**What AI was unsure about**

- The admin UI wording for storefront access and the variant metafield "Show all" link (flagged in `docs/admin-setup.md`).
- Where the GT Standard font on every page comes from. It loads from `cdn.shopify.com/shop-assets/…` and looks Shopify-injected, not theme-owned.
- **Correction to earlier research:** Dwell's fonts are Newsreader and Red Hat Display, set in `config/settings_data.json`, not Work Sans and Anonymous Pro. Those are Horizon's schema defaults, which Dwell's preset overrides.
- Whether a single Lighthouse run per page is stable enough. It was one run, not the median of three.

**Outcome (accepted / changed / rejected):**
