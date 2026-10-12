# Admin setup

Click-by-click steps to rebuild the Potting Bench dev store from this repo. These are admin tasks: do them by hand in Shopify admin. Code never creates them.

**Convention:** a step marked *(unsure of current UI)* describes what to look for, because Shopify's labels change. Fix this file whenever the real screen differs.

## Confirmed admin paths

| Task | Path |
|---|---|
| Metaobject and metafield definitions | Settings → Metafields and metaobjects. Metafield definitions are listed per resource (Products, Variants, …). Metaobject definitions are further down the same page. |
| Metaobject entries | Content (left sidebar) → Metaobjects → Glaze → Add entry |
| Theme editor | Online Store → Themes → Edit theme |

## Store basics

- Currency AUD, market Australia only.
- Storefront password stays on while this is a concept store.

## Glaze data model

Checklist (all done 11 Oct 2026):

- [x] **0. Clean up the swatch test.** Delete the "Swatch test planter" product, the Products → "Glazes" metafield definition, and the old Glaze metaobject definition.
- [x] **1. Metaobject definition "Glaze".** Settings → Metafields and metaobjects → Metaobject definitions → Add definition.
- [x] **2. Glaze entries.** Content → Metaobjects → Glaze → Add entry.
- [x] **3. Variant metafield "Glaze".** Settings → Metafields and metaobjects → Variants → Add definition.
- [x] **4. Test product "Bell Planter 15cm".**

### 1. Glaze definition

Name **Glaze**, type `glaze`.

| Field | Key | Type | Rules |
|---|---|---|---|
| Name | `name` | Single line text | Required |
| Colour | `colour` | Colour | Required |
| Finish | `finish` | Single line text | Preset choices Gloss, Satin, Matte (if offered) |
| Pattern image | `pattern_image` | File | Images only, optional |

Options:

| Option | Value |
|---|---|
| Active-draft status | On |
| Translations | On |
| Publish entries as web pages | Off |
| Storefronts API access | On |
| Customer Account API access | Off |
| Display name | Name |

Check that the keys are exactly `name`, `colour`, `finish` and `pattern_image`. Keys can't be renamed later, and the theme reads them.

### 2. Seed entries

Set every entry's status to **Active** before saving. Draft entries don't reach the storefront, so Liquid would read nothing.

| Name | Colour | Finish | Why it's in the seed |
|---|---|---|---|
| Celadon | `#A8C3A0` | Gloss | Light-mid tone |
| Tenmoku | `#3B2416` | Gloss | Dark: needs light text |
| Terracotta | `#C4622D` | Satin | Mid-tone worst case for text contrast |
| Chalk | `#F2EFE8` | Matte | Near the page background: tests the border |

Type the hex into the Colour field's text box rather than using the picker.

### 3. Variant metafield

| Setting | Value |
|---|---|
| Name | Glaze |
| Namespace and key | `custom.glaze` (check before saving; it can't be changed) |
| Type | Metaobject → Glaze, **one entry** |
| Storefront access | On *(unsure of current UI: may be under "Access")* |

### 4. Test product

- Title **Bell Planter 15cm**, price $39, status Active, sales channel Online Store.
- Option name **Colour**. Type it yourself as plain text. If Shopify suggests "Color" or offers to link the option to a category metafield, **don't accept**: see the swatch test below.
- Values: Celadon, Tenmoku, Terracotta, Chalk. Stock 5 each.
- Open each variant → Metafields → Glaze, and choose the matching entry. If Glaze isn't shown, look for a "Show all" link *(unsure of current UI)*.

## Swatch test

**What we tried:** a product option linked to a custom Glaze metaobject, with Dwell's "Show swatches" turned on.

**Result:** the option's `swatch` was empty, and the picker stayed a dropdown. This matches community reports that the Liquid `swatch` object is only filled for Shopify's own Color metaobjects on the default Color option, not for custom metaobjects:

- [Variants from custom metaobjects always have an empty swatch](https://community.shopify.dev/t/29115)
- [Native colour swatches not accessible in Liquid for all option types](https://community.shopify.dev/t/28132)
- Liquid reference: [swatch object](https://shopify.dev/docs/api/liquid/objects/swatch)

**Decision:** a plain-text Colour option plus the `custom.glaze` variant metafield. See README decision D3.

## Still to set up

These are added in `chore/data-model`:

- Plant care metaobject (`plant_care`): botanical name, light, water, humidity, pet safe, difficulty. Use preset choices for consistent tags. An empty pet-safe value means "unknown", so nothing renders.
- Product metafields `custom.care` (→ Plant care) and `custom.live_plant` (true or false).
- A plant test product, so the plant product page baseline can be measured.

Later branches add the $120 free-shipping rate and the WA and Tasmania shipping zones.
