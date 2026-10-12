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
- Prices include GST: Settings → Taxes and duties → check that prices are shown and charged with tax included *(unsure of current UI)*. Every product keeps "Charge tax" on.

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

- [ ] **5. Store basics.** Prices include GST (see [Store basics](#store-basics)).
- [ ] **6. Metaobject definition "Plant care".** Settings → Metafields and metaobjects → Metaobject definitions → Add definition.
- [ ] **7. Product metafields "Care" and "Live plant".** Settings → Metafields and metaobjects → Products → Add definition.
- [ ] **8. Plant care entries.** Content → Metaobjects → Plant care → Add entry.
- [ ] **9. Products.** 9 new products, plus product type "Pot" on the existing Bell Planter 15cm.
- [ ] **10. Collections.** 3 automated collections with SEO fields.
- [ ] **11. Images.** One 4:5 image per product, with alt text and a README credit.
- [ ] **12. Collection description in the theme editor.** Only after the `chore/data-model` pull request is merged.
- [ ] **13. Data checks and baseline.**

### 6. Plant care definition

Name **Plant care**, type `plant_care`. Use the same options as Glaze (see [Glaze definition](#1-glaze-definition)), except **Display name: Botanical name**.

| Field | Key | Type | Rules |
|---|---|---|---|
| Botanical name | `botanical_name` | Single line text | Required |
| Light | `light` | Single line text | Required. Preset choices: Low to medium indirect · Low to bright indirect · Medium indirect · Bright indirect |
| Water | `water` | Single line text | Required. Preset choices: Keep lightly moist · When top soil is dry · When soil is fully dry |
| Humidity | `humidity` | Single line text | Required. Preset choices: Low · Average · High |
| Pet safety | `pet_safe` | Single line text | **Optional.** Preset choices: Non-toxic to cats and dogs · Toxic to cats and dogs |
| Difficulty | `difficulty` | Single line text | Required. Preset choices: Easy · Moderate · Tricky |

- Look for an option that limits the field to preset choices *(unsure of current UI)*. Type each choice exactly as above. The storefront shows the text as entered.
- Pet safety is optional on purpose. **Blank means "unknown"**, and the theme renders nothing for it. That's why it's a text field and not True or false, which is a checkbox and can't show "unknown". See README D6.
- Check the keys before saving. They can't be renamed later, and the theme reads them.

### 7. Product metafields

| Name | Namespace and key | Type | Notes |
|---|---|---|---|
| Care | `custom.care` | Metaobject → Plant care, **one entry** | Plants only |
| Live plant | `custom.live_plant` | True or false | Tick on plants only. Leave it unticked on everything else: the theme treats unticked as false. |

Storefront access On for both *(unsure of current UI: may be under "Access")*.

### 8. Plant care entries

Set every entry's status to **Active**. Leave **Pet safety blank** until you've checked each plant against the [ASPCA toxic and non-toxic plants list](https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants). The "expected" column is unverified.

| Botanical name | Plant | Light | Water | Humidity | Pet safety (expected; check ASPCA) | Difficulty |
|---|---|---|---|---|---|---|
| Epipremnum aureum | Devil's Ivy | Low to bright indirect | When top soil is dry | Average | Toxic to cats and dogs | Easy |
| Dracaena trifasciata | Snake Plant | Low to bright indirect | When soil is fully dry | Low | Toxic to cats and dogs | Easy |
| Spathiphyllum wallisii | Peace Lily | Medium indirect | Keep lightly moist | High | Toxic to cats and dogs | Moderate |
| Chamaedorea elegans | Parlour Palm | Low to medium indirect | When top soil is dry | Average | Non-toxic to cats and dogs | Easy |
| Ficus lyrata | Fiddle Leaf Fig | Bright indirect | When top soil is dry | Average | Toxic to cats and dogs | Tricky |

Water and humidity are general care guidance, not checked against a horticultural source. Sanity-check them before entering.

### 9. Products

For every product: status Active, sales channel Online Store, "Charge tax" on, stock 5 per variant. Check the URL handle under Search engine listing *(unsure of current UI)* and set it to the handle below if Shopify generated something different.

**Plants:** product type `Indoor plant`. Tick **Live plant**, and choose the matching **Care** entry.

| Title | Handle | Option | Variants and prices | Description |
|---|---|---|---|---|
| Devil's Ivy | `devils-ivy` | Size | Small 12cm $24 · Medium 17cm $39 | A trailing plant with heart-shaped leaves. Choose a 12cm or 17cm nursery pot. |
| Snake Plant | `snake-plant` | none | $45 | Stiff, upright, sword-shaped leaves, supplied in a 17cm nursery pot. |
| Peace Lily | `peace-lily` | none | $42 | Glossy dark-green leaves and white flowers, supplied in a 17cm nursery pot. |
| Parlour Palm | `parlour-palm` | none | $36 | A compact palm with soft, arching fronds, supplied in a 14cm nursery pot. |
| Fiddle Leaf Fig | `fiddle-leaf-fig` | none | $69 | Large, violin-shaped leaves on an upright stem, supplied in a 20cm nursery pot. |

**Planters:** product type `Pot`. Option **Colour**, as plain text (see [step 4](#4-test-product)). On each variant, set **Glaze** to the entry with the same name.

| Title | Handle | Colour values | Price | Description |
|---|---|---|---|---|
| Bell Planter 15cm | `bell-planter-15cm` | Celadon · Tenmoku · Terracotta · Chalk | $39 | Exists already: only set the product type. |
| Bell Planter 20cm | `bell-planter-20cm` | Celadon · Tenmoku · Terracotta · Chalk | $59 | A glazed ceramic bell planter, 20cm, in four glazes. |
| Cylinder Planter 12cm | `cylinder-planter-12cm` | Celadon · Chalk | $29 | A glazed ceramic cylinder planter, 12cm, in two glazes. |

**Potting mix and fertiliser:** product type `Potting mix & fertiliser`. Leave Live plant unticked.

| Title | Handle | Price | Description |
|---|---|---|---|
| Indoor Potting Mix 5L | `indoor-potting-mix-5l` | $15.95 | Potting mix for indoor plants, in a 5L bag. |
| Liquid Plant Food 500ml | `liquid-plant-food-500ml` | $18.95 | Liquid fertiliser for indoor plants, in a 500ml bottle. Dilute as directed on the label. |

### 10. Collections

Products → Collections → Create collection. Collection type **Automated**, condition **Product type is equal to** the value below, typed exactly. Help Center doesn't say whether this match is case-sensitive. Fill in the SEO fields under Search engine listing → Edit *(unsure of current UI)*. The store is password-protected, so the SEO work is practice only.

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

- One image per product, **4:5 portrait**, at least 1600 × 2000 px. This matches Dwell's portrait product cards (ratio 0.8) and product media (`1/1.25` in `templates/product.json`).
- Source: Unsplash or Pexels only. Check that the photo really shows the species named, because stock photos are often mislabelled. Add a row to the README "Image credits" table.
- Alt text: describe the product as a customer would see it, for example "Devil's Ivy trailing over the rim of a nursery pot". Use the image's alt text option in the product's media *(unsure of current UI)*.

### 12. Collection description in the theme editor

The collection template shows only the title. To show the description, open Online Store → Themes → Edit theme → a collection page, add a **Text** block, and connect it to the dynamic source **Collection → Description** *(unsure of current UI)*.

⚠️ Saving commits `templates/collection.json` straight to `main`. Do this **after** the `chore/data-model` pull request is merged, then run `git switch main` and `git pull` before starting the next branch.

### 13. Data checks and baseline

- [ ] Each of the 5 plants has Care set and Live plant ticked. Nothing else has Live plant ticked.
- [ ] Every planter variant has a Glaze.
- [ ] Each collection shows the right products: 5 plants, 3 planters, 2 mix and fertiliser.
- [ ] Test cart **$119.95**: Bell Planter 20cm + Snake Plant + Indoor Potting Mix 5L.
- [ ] Test cart **$120.00**: Bell Planter 15cm + Snake Plant + Parlour Palm.
- [ ] Lighthouse mobile, same conditions as the README baseline: `/products/devils-ivy`, `/` and `/collections/all`. Record the results in the README as baseline v2.

Later branches add the $120 free-shipping rate and the WA and Tasmania shipping zones.
