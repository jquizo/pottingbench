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
- **Store address first.** Shopify won't let you change tax settings until the store has an address: Settings → General → store address *(unsure of current UI)*. Use a real address you're entitled to use (your own, or a PO box), never a made-up one. The theme never prints it (no `shop.address` in the code), but it can appear in order emails and Shopify-generated policies.
- **Prices include GST:** Settings → Taxes and duties → Additional configuration → turn on **"Include sales tax in product price and shipping rate"**. Shopify says "sales tax" generically; this is the GST-inclusive setting. Check: the product price shows "Taxes included." (verified 12 Oct 2026). After `feat/gst-labels` it reads "Includes GST.", and the theme only shows it while this setting is on (`cart.taxes_included`).
- **Tax regions → Australia stays "not collecting".** Shopify's Basic Tax requires a tax registration number ([Help Center](https://help.shopify.com/en/manual/taxes/registration)). A concept store has no ABN, and you must never enter a made-up one. A real merchant registers for GST, enters their ABN here, and then starts collecting.
- Leave **"Charge sales tax on shipping"** as it is: Help Center says Australia taxes shipping automatically where it applies ([shipping tax](https://help.shopify.com/en/manual/taxes/shipping-tax)).
- Every product keeps "Charge tax" on.
- **Later check:** Tax regions lists **United States**, so a shipping zone still includes the US. Remove it when the shipping zones are set up (`feat/cart-live-plant-notice`).

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

## Catalogue and plant care

Checklist (added in `chore/data-model`). Work top to bottom: definitions before entries, entries before products.

- [x] **5. Store basics.** Store address, then prices include GST (see [Store basics](#store-basics)).
- [x] **6. Metaobject definition "Plant care".** Settings → Metafields and metaobjects → Metaobject definitions → Add definition.
- [x] **7. Product metafields "Care" and "Live plant".** Settings → Metafields and metaobjects → Products → Add definition.
- [x] **8. Plant care entries.** Content → Metaobjects → Plant care → Add entry.
- [x] **9. Products.** 9 new products, plus the existing Bell Planter 15cm brought up to the same standard (done 15 Oct 2026).
- [x] **10. Collections.** 3 collections with a Type condition and SEO fields (done 15 Oct 2026).
- [ ] **11. Images.** 18 AI-generated 4:5 images (one per variant where variants differ), with alt text. Disclosed in the README.
  - [x] 11a. Product images uploaded with alt text (18 Oct 2026).
  - [x] 11b. Each variant linked to its image (reported done 19 Oct 2026).
  - [ ] 11c. Bell Planter 15cm images regenerated in the 20cm's flared shape, uploaded, alt text set, variants re-linked. **Deferred (known issue, 19 Oct 2026):** the 15cm still shows a rounded jar shape, unlike the 20cm. Accepted for the concept demo.
  - [ ] 11d. Pots & Planters collection image: the Tenmoku and Terracotta pots are the rounded jar shape we don't sell. Regenerate with the real shapes (bell and cylinder). **Deferred (known issue).**
  - [ ] 11e. Potting Mix & Fertiliser collection image: the bottle label has garbled text and "Dllute". Regenerate or crop. **Deferred (known issue).**
- [x] **12. Collection description in the theme editor.** (19 Oct 2026, commit `8422ad5` on `main`)
  - [ ] 12a. Check each collection's description and meta description against the copy rules. **Skipped (19 Oct 2026).** The step 10 copy still contains "Easy-care" (Indoor Plants) and "Hand-glazed" (Pots & Planters meta description). Whatever is in admin now shows on the collection pages.
  - [x] 12b. A Text block connected to **Collection → Description**, added below the title in the collection template's first section. The editor set that section's direction to column so the description sits under the title.
- [x] **13. Data checks and baseline.** (19 Oct 2026)

### 6. Plant care definition

Name **Plant care**, type `plant_care`. Use the same options as Glaze (see [Glaze definition](#1-glaze-definition)), except **Display name: Botanical name**.

| Field | Key | Type | Required | Validation → Regular expression |
|---|---|---|---|---|
| Botanical name | `botanical_name` | Single line text | Yes | none |
| Light | `light` | Single line text | Yes | `^(Low to medium indirect\|Low to bright indirect\|Medium indirect\|Bright indirect)$` |
| Water | `water` | Single line text | Yes | `^(Keep lightly moist\|When top soil is dry\|When soil is fully dry)$` |
| Humidity | `humidity` | Single line text | Yes | `^(Low\|Average\|High)$` |
| Pet safety | `pet_safe` | Single line text | **No** | `^(Non-toxic to cats and dogs\|Toxic to cats and dogs)$` |
| Difficulty | `difficulty` | Single line text | Yes | `^(Easy\|Moderate\|Hard)$` |

In the patterns, type a plain `|`. The backslashes only appear because a Markdown table can't show a bare `|`.

- **Add field** gives a row with the field label, key and type. **Required:** click the asterisk (\*) beside the field label. **Validation:** click the expand arrow on the row, then the Validation tab ([Help Center](https://help.shopify.com/en/manual/custom-data/metaobjects/building-a-metaobject)).
- Metaobject fields in admin offer only **Character limit** and **Regular expression** (checked 12 Oct 2026). Preset choices aren't available, so an anchored regex allows only the exact values above. It's case-sensitive (Shopify uses RE2), so "low" or "Low " (with a trailing space) is rejected. The storefront shows the text as entered.
- The key for "Pet safety" auto-fills as `pet_safety`. **Change it to `pet_safe`.**
- Pet safety is optional on purpose. **Blank means "unknown"**, and the theme renders nothing for it. That's why it's a text field and not True or false, which is a checkbox and can't show "unknown". See README D6.
- Check the keys before saving. They can't be renamed later, and the theme reads them.

### 7. Product metafields

| Name | Namespace and key | Type | Notes |
|---|---|---|---|
| Care | `custom.care` | Type box: **One** + **Plant care** | Plants only |
| Live plant | `custom.live_plant` | True or false | True on plants, False on everything else. Set it explicitly: blank means "not reviewed" (the theme treats blank as false). |

The screen (checked 12 Oct 2026):

- **Name**, then the key shown underneath (for example `custom.care`). Check the key before saving.
- **Suggested standards** (Care guide, Care instructions, …): **don't click them.** They swap in a Shopify standard definition with a different namespace and key.
- **Type:** a **One / List** dropdown, then the type. Choose **One**.
- **Category assignments:** leave empty, so the definition applies to every product.
- **Options:**
  - Filter on the product list and in the Admin API: **Off**
  - Use as a condition in collections: **Off** (collections use product type; see README D7)
  - **Storefront API access: On.** Without it the theme can't read the value.

### 8. Plant care entries

Set every entry's status to **Active**. Pet safety was checked against the [ASPCA toxic and non-toxic plants list](https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants) on 13 Oct 2026. For any new plant, leave Pet safety blank until you've checked it there.

| Botanical name | Plant | Light | Water | Humidity | Pet safety (ASPCA, checked) | Difficulty |
|---|---|---|---|---|---|---|
| Epipremnum aureum | Golden Pothos | Low to bright indirect | When top soil is dry | Average | Toxic to cats and dogs | Easy |
| Dracaena trifasciata | Snake Plant | Low to bright indirect | When soil is fully dry | Low | Toxic to cats and dogs | Easy |
| Spathiphyllum wallisii | Peace Lily | Medium indirect | Keep lightly moist | High | Toxic to cats and dogs | Moderate |
| Chamaedorea elegans | Parlour Palm | Low to medium indirect | When top soil is dry | Average | Non-toxic to cats and dogs | Easy |
| Ficus lyrata | Fiddle Leaf Fig | Bright indirect | When top soil is dry | Average | Toxic to cats and dogs | Hard |

Water and humidity are general care guidance, not checked against a horticultural source. Sanity-check them before entering.

### 9. Products

For every product:

- Status **Active**, sales channel **Online Store**, **Charge tax** on, stock **5** per variant.
- **Compare-at price** and **Cost per item**: blank. A made-up "was" price would mislead customers under the Australian Consumer Law.
- **URL handle:** check it under Search engine listing *(unsure of current UI)* and set it to the handle below if Shopify generated something different.
- **SEO:** page title and meta description from the approved product copy.
- **Live plant:** set it **explicitly**: True on plants, False on everything else. Blank means "not reviewed", so step 13 can spot a product nobody checked. The theme treats blank as false anyway. *(Control type not recorded: checkbox or True/False dropdown.)*
- **Category:** Shopify's standard product taxonomy. Names as Shopify shows them (checked 15 Oct 2026). Leave any extra category fields empty.

| Products | Category (Shopify name) | Path |
|---|---|---|
| Plants | **Potted Houseplants** | Home & Garden > Plants > Indoor & Outdoor Plants |
| Planters | **Planters** | Home & Garden > Lawn & Garden > Gardening > Pots & Planters |
| Potting mix | **Soil** | Home & Garden > Lawn & Garden > Gardening > Sands & Soils |
| Plant food | **Fertilizers** (Shopify's spelling, not our identifier) | Home & Garden > Lawn & Garden > Gardening |

**Type** (Product organisation card): free text, our own value. It doesn't come from Shopify's list. Type it exactly as shown below and add it as a new type. After the first product, pick the existing type from the suggestions so every product matches ([Help Center: product type](https://help.shopify.com/en/manual/products/details/product-type)). Type and Category are separate: collections use Type, and Category is Shopify's standard taxonomy.

**Variant options:** plain-text custom options only. Click **+ Add options like size or color** → Option name → Option values → **Done** → **Save**, then set price and stock on each variant ([Help Center](https://help.shopify.com/en/manual/products/variants/add-variants)). The first value is the default variant.

**Plants:** product type `Indoor plant`. Live plant **True**, and choose the matching **Care** entry.

| Title | Handle | Option | Variants and prices | Description |
|---|---|---|---|---|
| Golden Pothos | `golden-pothos` | Size | Small 12cm $24 · Medium 17cm $39 | A trailing plant with heart-shaped leaves. Choose a 12cm or 17cm nursery pot. |
| Snake Plant | `snake-plant` | none | $45 | Stiff, upright, sword-shaped leaves, supplied in a 17cm nursery pot. |
| Peace Lily | `peace-lily` | none | $42 | Glossy dark-green leaves and white flowers, supplied in a 17cm nursery pot. |
| Parlour Palm | `parlour-palm` | none | $36 | A compact palm with soft, arching fronds, supplied in a 14cm nursery pot. |
| Fiddle Leaf Fig | `fiddle-leaf-fig` | none | $69 | Large, violin-shaped leaves on an upright stem, supplied in a 20cm nursery pot. |

**Planters:** product type `Pot`, Live plant **False**. Option **Colour**, as plain text (see [step 4](#4-test-product)). If Shopify offers a linked "Color" option or offers to connect Colour to a category metafield, **decline**. On each variant, open Metafields → **Glaze** and choose the entry with the same name. Linked an option by mistake? Edit → the metafield name → **Disconnect**.

| Title | Handle | Colour values | Price | Description |
|---|---|---|---|---|
| Bell Planter 15cm | `bell-planter-15cm` | Celadon · Tenmoku · Terracotta · Chalk | $39 | Exists already (step 4). Add the product type, category, description, SEO fields and Live plant False. |
| Bell Planter 20cm | `bell-planter-20cm` | Celadon · Tenmoku · Terracotta · Chalk | $59 | A glazed ceramic bell planter, 20cm, in four glazes. |
| Cylinder Planter 12cm | `cylinder-planter-12cm` | Celadon · Chalk | $29 | A glazed ceramic cylinder planter, 12cm, in two glazes. |

**Potting mix and fertiliser:** product type `Potting mix & fertiliser`. Live plant **False**.

| Title | Handle | Price | Description |
|---|---|---|---|
| Indoor Potting Mix 5L | `indoor-potting-mix-5l` | $15.95 | Potting mix for indoor plants, in a 5L bag. |
| Liquid Plant Food 500ml | `liquid-plant-food-500ml` | $18.95 | Liquid fertiliser for indoor plants, in a 500ml bottle. Dilute as directed on the label. |

### 10. Collections

This store uses Shopify's **new collections model** (screen checked 15 Oct 2026): there's no "Automated / Manual" choice any more. A collection has a **source** (Products or Variants) that you fill with conditions, hand-picked products, or both ([Help Center: create a collection](https://help.shopify.com/en/manual/products/collections/create-collection)).

Products → Collections → **Add collection**, then:

1. **Add title** and **Add description** (top card).
2. Right-hand card: leave the source dropdown on **Products** (not Variants). Click **Add condition** → **Type** (not Category) → **is equal to** → the value below, typed exactly *(unsure of the operator label)*. The condition list offers Category, Compare at price, Inventory stock, Price, Status, Tag, Title, Type, Variant title, Vendor and Weight (checked 15 Oct 2026).
3. **Don't use Add products or Exclude.** Hand-picked products stay until removed, so the collection would drift from the rule (README D7).
4. **Channels** selector (top card, "3 channels" by default): check that **Online Store** is included.
5. **Image:** added, with alt text (18 Oct 2026; the plan was to skip it). Files: `indoor-plants-collection.jpg`, `glazed-ceramic-indoor-pots-and-planters.jpg`, `indoor-plant-potting-mix-and-fertiliser.jpg` *(alt text per collection: not yet recorded)*. **Theme template:** Default collection.
6. **Search engine listing** → pencil icon: page title, meta description, and check the URL handle.
7. **Save.** **Collection items** should show 5, 3 and 2 products. Help Center doesn't say whether the product type match is case-sensitive.
8. **Count too low?** Open the missing product and check its **Type** character for character (blank, plural, capitals, trailing space). This happened once on Pots & Planters (2 instead of 3, fixed 17 Oct 2026). A collection lists products, not variants: the 10 planter variants are 3 products, and the theme shows one card per product.

The store is password-protected, so the SEO work is practice only.

| Title | Handle | Product type | Description |
|---|---|---|---|
| Indoor Plants | `indoor-plants` | `Indoor plant` | Easy-care indoor plants, each with a simple care guide. Live plants can't be sent to WA or Tasmania. |
| Pots & Planters | `pots-planters` | `Pot` | Glazed ceramic planters in celadon, tenmoku, terracotta and chalk. |
| Potting Mix & Fertiliser | `potting-mix-fertiliser` | `Potting mix & fertiliser` | Potting mix and liquid plant food for indoor plants. |

| Collection | SEO title | Meta description |
|---|---|---|
| Indoor Plants | Indoor Plants Online \| Potting Bench | Easy-care indoor plants with simple care guides. Free shipping from $120. Live plants ship everywhere in Australia except WA and Tasmania. |
| Pots & Planters | Glazed Ceramic Pots & Planters \| Potting Bench | Hand-glazed ceramic pots in celadon, tenmoku, terracotta and chalk. Free shipping from $120. |
| Potting Mix & Fertiliser | Potting Mix & Plant Fertiliser \| Potting Bench | Indoor potting mix and liquid plant food to keep your plants healthy. Ships Australia-wide. Free shipping from $120. |

Copy rules behind these:

- "From $120", not "over $120": a $120.00 cart qualifies.
- "Everywhere in Australia except WA and Tasmania": the NT and ACT are territories, not states.
- No "sized to fit our plants" claim. The Fiddle Leaf Fig comes in a 20cm pot and the largest planter is 20cm. Don't make fit claims we can't back up.

### 11. Images

**18 images:** one per variant where the variants look different (each glaze, each Golden Pothos size), otherwise one per product.

- **Source:** AI-generated with Google Gemini (README D9). This replaces the earlier Unsplash or Pexels plan.
- **Look:** plants in black nursery pots; planters shown empty; supplies unbranded (generic label text such as "Dilute before use" is fine, but no brand names or logos); background close to `#F7F7F5`.
- **Size:** **4:5 portrait**, at least 1600 × 2000 px. This matches Dwell's portrait product cards (ratio 0.8). Gemini output is 1856 × 2304 (ratio 0.806), so cards crop less than 1%.
- **Product page media is square** (aspect ratio `1`, set in the theme editor on 17 Oct 2026, commit `89197db` on `main`; Dwell's default was `1/1.25`). With media fit "cover", the product page crops about 10% off the top and bottom of each 4:5 image. Keep each product's subject inside the middle 80% of the height, and check tall plants (Fiddle Leaf Fig) and trailing ones (Golden Pothos) on the product page.
- **Check before uploading:**
  - each plant looks like its species;
  - each glaze matches its name and finish;
  - the same product has the same shape and framing in every variant;
  - no brand names or logos.
- **File names:** start with the handle, lowercase, hyphens, for example `bell-planter-20cm-glazed-ceramic-celadon`. Google treats file names as "very light clues", and alt text matters far more ([Google Images SEO](https://developers.google.com/search/docs/appearance/google-images)).
- **Format:** uploaded as **JPEG**, Gemini's original `.jpg` files (plants 16 Oct 2026, planters and supplies 17 Oct 2026). WebP copies made with `sharp` at quality 90 sit in the `webp\` subfolder but weren't uploaded. The upload format doesn't change what customers download: `image_url` asks the CDN for a resized copy, and the CDN re-encodes it for the browser ([`image_url`](https://shopify.dev/docs/api/liquid/filters/image_url)). Measured 19 Oct 2026 in Chrome 155: every product image arrived as WebP (one thumbnail as JPEG XL), 3–79 KB each. Re-uploading smaller files wouldn't reduce what customers download. Keep the original `.jpg` files outside the repo as masters.
- **Latest versions:** the Bell Planter 20cm masters were last saved on 16 Oct 2026 at 11:09–11:13 pm, and the store's copies were uploaded on 17 Oct 2026, so the store has the latest versions.
- **Upload:** product → **Media** → **Upload new** (or **Select existing** for a file already in Content → Files, so you don't create a duplicate) ([Help Center](https://help.shopify.com/en/manual/products/product-media/add-media)) *(unsure of current UI)*. Put the first variant's image first: the first media item is the featured image on product cards, the cart and checkout. Drag to reorder.
- **Variant images:** Variants → the image icon next to each variant → choose the image → **Done** → **Save** ([Help Center](https://help.shopify.com/en/manual/products/product-media/add-images-variants)).
- **Alt text:** after uploading, the product → click the image → **Add alt text** → type it → **Save alt text** → **X** ([Help Center](https://help.shopify.com/en/manual/products/product-media/add-alt-text)) *(unsure of current UI)*. Describe what a customer sees, without keyword stuffing.
- **The table below is suggested wording, not an exact match.** The store's alt text differs (checked 19 Oct 2026) and may change again. Keep to the rules instead: describe what's visible, say which glaze or size it is when a product's variant images differ, and make no claims (care, fit, hand-made).

| Image | Alt text |
|---|---|
| Golden Pothos, Small 12cm | Golden Pothos Small 12cm in a black nursery pot, with green heart-shaped leaves marbled with yellow |
| Golden Pothos, Medium 17cm | Golden Pothos Medium 17cm in a black nursery pot, with long trailing stems of green and yellow heart-shaped leaves |
| Snake Plant | Snake Plant with upright, sword-shaped leaves banded in dark and light green, in a black nursery pot |
| Peace Lily | Peace Lily with glossy dark-green leaves and two white flowers, in a black nursery pot |
| Parlour Palm | Parlour Palm with soft, arching green fronds on slender stems, in a black nursery pot |
| Fiddle Leaf Fig | Fiddle Leaf Fig with large, glossy, violin-shaped leaves on a single upright stem, in a black nursery pot |
| Bell Planter 20cm, Celadon | Bell Planter 20cm in Celadon, a pale green gloss glaze, with a flared shape and rolled rim, shown empty |
| Bell Planter 20cm, Tenmoku | Bell Planter 20cm in Tenmoku, a deep brown-black gloss glaze, with a flared shape and rolled rim, shown empty |
| Bell Planter 20cm, Terracotta | Bell Planter 20cm in Terracotta, a warm orange satin glaze, with a flared shape and rolled rim, shown empty |
| Bell Planter 20cm, Chalk | Bell Planter 20cm in Chalk, a soft off-white matte glaze, with a flared shape and rolled rim, shown empty |
| Cylinder Planter 12cm, Celadon | Cylinder Planter 12cm in Celadon, a pale green gloss glaze, with straight sides, shown empty |
| Cylinder Planter 12cm, Chalk | Cylinder Planter 12cm in Chalk, a soft off-white matte glaze, with straight sides, shown empty |
| Bell Planter 15cm (4 glazes) | *To write once the images are regenerated to match the 20cm shape* |
| Indoor Potting Mix 5L | Indoor Potting Mix 5L in a plain kraft paper bag, with a small pile of dark potting mix beside it |
| Liquid Plant Food 500ml | Liquid Plant Food 500ml in a white bottle with a green cap and a plain label that says to dilute before use |

### 12. Collection description in the theme editor

The collection template shows only the title. To show the description, open Online Store → Themes → Edit theme → a collection page, add a **Text** block, and connect it to the dynamic source **Collection → Description** *(unsure of current UI)*.

⚠️ Saving commits `templates/collection.json` straight to `main`. Do this **after** the `chore/data-model` pull request is merged, then run `git switch main` and `git pull` before starting the next branch.

### 13. Data checks and baseline

- [x] Each of the 5 plants has Care set and Live plant True. The other 5 products have Live plant False. None is blank. (19 Oct 2026)
- [x] Every planter variant has a Glaze, matching its Colour value. (19 Oct 2026)
- [x] Each collection shows the right products: 5 plants, 3 planters, 2 mix and fertiliser, in admin and on the storefront. (19 Oct 2026)
- [x] Test cart **$119.95**: Bell Planter 20cm + Snake Plant + Indoor Potting Mix 5L. (19 Oct 2026)
- [x] Test cart **$120.00**: Bell Planter 15cm + Snake Plant + Parlour Palm. (19 Oct 2026)
- [x] Lighthouse mobile, same conditions as the README baseline: `/`, `/products/golden-pothos`, `/products/bell-planter-20cm` and `/collections/all`. Results recorded in the README as baseline v2. (19 Oct 2026)

Later branches add the $120 free-shipping rate and the WA and Tasmania shipping zones.

## Theme settings

Customiser settings that the store relies on. Saving commits `config/settings_data.json` to `main`, so run `git switch main`, then `git pull`, afterwards.

- [x] **14. Show AUD on product pages** (`feat/gst-labels`, after merging). Online Store → Themes → pottingbench/main → Customise → Theme settings (gear icon) → **Currency code** → turn on **Product pages** *(unsure of current UI)*. Leave **Product cards** off. Cart items and cart total are on by default. Check: the Bell Planter 20cm page shows "$59.00 AUD". (Done 19 Oct 2026, commit `4b6e350`; checked 20 Oct 2026.)

### Brand tokens (`feat/brand-tokens`)

Dwell reads its colours and fonts from these settings and turns them into CSS custom properties, so no code changes (README D12). Do one step at a time, **Save** after each, then `git switch main` and `git pull`.

Each Save reached `main` as a `shopify[bot]` commit 2–10 minutes later (20 Oct 2026). Wait for it before checking `settings_data.json`.

- [x] **15. Colour palette.** (20 Oct 2026, commits `51a2871`, `3a29be7`, `1d2f8d0`) Theme settings → **Color palette** *(unsure of current UI)*. The palette shows swatches, not names, so find each colour by its current hex:

  | Palette key | Current | New | Used for |
  |---|---|---|---|
  | `background` | `#ffffff` | `#F7F7F5` | Page, drawers, popovers, button text |
  | `foreground` | `#4A4A4A` | `#111111` | Text, primary buttons, selected variant |
  | `color4` | `#D0CAC4` | `#767672` | Footer newsletter input border; input borders after step 16 |

  Leave `color1` (`#7D5449`) and `color3` (`#E9E4E0`) as they are. Check: the page background is off-white and body text is near-black.

  ⚠️ **Match swatches by hex, never by position.** The first attempt changed `color3` instead of `color4`, which turned the footer mid-grey, and a fix by position then changed `color1`. The order of the swatches on screen wasn't recorded *(unsure of current UI)*. If you must swap values between swatches, order the edits so no two swatches ever share a hex.

  Check `config/settings_data.json` on `main` afterwards: `"color_palette"` should read `#f7f7f5`, `#111111`, `#7D5449`, `#E9E4E0`, `#767672` (case doesn't matter).

- [x] **16. Input field borders.** (20 Oct 2026, commit `44f5102`) Theme settings → **Input fields** → **Borders** → choose the `#767672` palette swatch *(unsure of current UI)*. It's currently `#E9E4E0`, which is 1.18:1 against the page and fails WCAG 1.4.11 (3:1 for form field edges). `#767672` gives 4.25:1. Check: the search field and the footer newsletter field have a clearly visible border. In `settings_data.json`: `"palette_input_border": "{{ settings.color_palette.color4 }}"`. Picking a swatch that's already selected saves nothing, so no commit appears.

- [x] **17. Fonts.** (20 Oct 2026, commit `9fb6988`) Theme settings → **Typography** → Fonts *(unsure of current UI)*:

  | Role | Now | New |
  |---|---|---|
  | Heading | Newsreader Light (300) | **Fraunces** Regular (400) |
  | Subheading | Newsreader Regular (400) | **Fraunces** Regular (400) |
  | Body | Newsreader Regular (400) | **Work Sans** Regular (400) |
  | Accent | Red Hat Display Medium (500) | **Work Sans** Regular (400) |

  Use the same weight for both roles of each font: that's what keeps it to 2 font files (README D13). Leave the heading-level font settings (H1–H6) as they are. Check: headings are in Fraunces, and body text, the menu and uppercase labels are in Work Sans. In `settings_data.json`: `fraunces_n4` for heading and subheading, `work_sans_n4` for body and accent.

## Concept labelling and pages (`feat/concept-labelling-pages`)

All wording is in [page-copy.md](page-copy.md). No code changes (README D15). Do the steps in order: the page and policies must exist before menus and links point to them.

Steps 22–25 are customiser saves on **pottingbench/main**: each commits to `main` as `shopify[bot]` 2–10 minutes later. Then `git switch main` and `git pull`.

- [x] **18. About page.** (21 Oct 2026, with the SEO title and meta description from page-copy.md. **The real handle is `about-us`**, found in step 24 on 22 Oct 2026.) Online Store → Pages → **Add page** *(unsure of current UI)*. Title **About**, content from page-copy.md, Visibility **Visible**, Theme template **Default page**. Check the URL handle under Search engine listing (`about-us` on this store). **Save.** Check: `/pages/about-us` shows the page.
- [x] **19. Shipping policy.** (21 Oct 2026. The price line kept its space: "Includes GST. Shipping calculated at checkout.") Settings → Policies → **Shipping policy**. Leave **Use automated policy** off. Paste the text from page-copy.md, then **Save**. Check:
  - `/policies/shipping-policy` shows it;
  - the Bell Planter 20cm price line: is there a space in "Includes GST. Shipping calculated at checkout."? AI expects the space to be missing (`blocks/price.liquid:66-73`). Report what you see.
- [x] **20. Return policy.** (22 Oct 2026) Settings → Policies → **Return policy** *(may be labelled "Return and refund policy")*. Automated policy off. Paste, **Save**. Check: the footer shows **Terms and policies**, and its popover lists both policies.
- [x] **21. Menus.** (22 Oct 2026) Content → Menus → **Add menu**:
  - **Customer care**: Shipping policy, Return policy (the link picker has a **Policies** option, confirmed 22 Oct 2026);
  - **Information**: About.
- [x] **22. Footer menus.** (22 Oct 2026, commits `356e4cc`, `47d0b3e`: `"menu": "customer-care"` and `"menu": "information"` in `sections/footer-group.json`. The editor also renamed the two blocks from "Menu" to "Customer care" and "Information"; that's the block label in the editor sidebar, not storefront text.) Customise → Footer → the **CUSTOMER CARE** menu block → Menu: **Customer care**; the **INFORMATION** menu block → Menu: **Information** *(unsure of current UI)*. **Save.**
- [x] **23. Footer label.** (22 Oct 2026, commit `cc65b1c`: block `text_twHK4L` after the logo in `sections/footer-group.json`. **Saved text differs:** only "Concept store, not a real business." (a trailing `&nbsp;` was removed in `19bc8fb`); the "Product images are AI-generated." sentence is missing. The CLAUDE.md label requirement is met, and the About page discloses the AI images. Adding the sentence is optional.) Customise → Footer → add a **Text** block in the group with the logo *(unsure of current UI)*, with the footer text from page-copy.md. **Save.** Check: it shows on every page, below the logo.
- [x] **24. Announcement bar.** (22 Oct 2026, commits `66080aa`, `19bc8fb` in `sections/header-group.json`: `"link": "shopify://pages/about-us"`. The saved text has an `&nbsp;` at each end, which is invisible on centred text. The editor also wrote about 20 default-valued keys, with no visual effect. **Bar background changed on purpose** from `color1` `#7D5449` to `foreground` `#111111`; `contrast-override` then picks `#F7F7F5` text, 17.60:1.) Customise → Header → Announcement bar → the announcement block: replace the text, set the link to the About page. **Save.** Check: the bar reads "Concept store, not a real business" (shown in capitals: the block's Case is Uppercase) and goes to `/pages/about-us`.
- [ ] **25. Password page.** Customise → page selector → **Password** ([Help Center](https://help.shopify.com/en/manual/online-store/themes/password-page)): replace "Opening soon" and the paragraph below with the password page text, and hide the **Email signup** block (the eye icon) *(unsure of current UI)*. **Save.** Check: log out of the storefront, or open a private window, and look at the password page.
- [ ] **26. Checks.**
  - Keyboard: Tab to the announcement link, the footer menus and **Terms and policies**. The popover opens, its links are reachable, and Escape closes it.
  - The label shows in the announcement bar and footer on Home, a product page and a collection page.
