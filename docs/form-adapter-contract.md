# Form Adapter Contract

This document defines the interface contract between hmpo-form-wizard, the translation layer, and our GOV.UK component adapter (`src/lib/form-fields.js`).

## res.locals shape from hmpo-form-wizard

When hmpo-form-wizard processes a step and calls `res.render()`, the following properties are available on `res.locals`:

| Property     | Type     | Description                                                              |
| ------------ | -------- | ------------------------------------------------------------------------ |
| `errors`     | `object` | Map of fieldId → error object (`{ type, message, arguments }`)           |
| `errorlist`  | `array`  | Flat array of error objects with `key`/`field` property for ordering     |
| `values`     | `object` | Map of fieldId → current value (from session or form body)               |
| `options`    | `object` | Step config including `options.fields` (field definitions for this step) |
| `action`     | `string` | Form action URL                                                          |
| `csrf-token` | `string` | CSRF token for form submission                                           |
| `backLink`   | `string` | URL for the back link                                                    |
| `baseUrl`    | `string` | Base URL of the wizard router                                            |
| `nextPage`   | `string` | Next step URL (for navigation)                                           |

### options.fields structure

Each field in `options.fields` is keyed by field ID and contains:

```js
{
  type: 'text' | 'number' | 'select' | 'list' | 'radios',
  validate: [...],
  items: [...],        // for select/list/radios
  autocomplete: '...', // for text inputs
  inline: true,        // for inline radios
  journeyKey: '...',   // meta fields (no type) — session storage key
}
```

## What hmpo-components locals.js adds

The `hmpo-components` package provides a middleware (`lib/locals.js`) that adds:

| Property    | Type       | Description                                                                                                      |
| ----------- | ---------- | ---------------------------------------------------------------------------------------------------------------- |
| `translate` | `function` | Calls `req.translate(key)` then renders Nunjucks `{{ }}` expressions in the result using `res.locals` as context |
| `t`         | `function` | Alias for `translate`                                                                                            |
| `ctx`       | `function` | Dotted-path accessor into `res.locals` (e.g., `ctx('options.fields.name')`)                                      |

Our replacement: `src/lib/nunjucks-helpers.js` → `createTranslateMiddleware(app, env, opts)`

## Translation key conventions

The translation files (YAML in `src/locales/{lang}/`) follow these key patterns:

### Field translations

- `fields.{id}.label` — Input label text
- `fields.{id}.hint` — Hint text below label
- `fields.{id}.validation.{type}` — Error message for specific validation type
- `fields.{id}.validation.default` — Default error for the field
- `fields.{id}.items.{value}.label` — Label for radio/select item

### Page translations

- `pages.{key}.title` — Page heading / H1

### Button translations

- `buttons.{action}` — Button text (e.g., `buttons.next`, `buttons.find-address`)

### Generic validation

- `validation.{type}` — Generic fallback for a validation type
- `validation.{id}.{type}` — Field-specific validation (alternative location)
- `validation.default` — Ultimate fallback

### GOV.UK chrome

- `govuk.serviceName` — Service name in header
- `govuk.backLink` — Back link text
- `govuk.errorSummaryTitle` — Error summary heading
- `govuk.error` — Visually hidden prefix for inline errors
- `govuk.errorPrefix` — "Error" prefix for page title
- `govuk.skipLink` — Skip to content link text

## Error resolution cascade

When resolving an error message for field `{id}` with error type `{type}`:

1. **Pre-set message** — If `error.message` is already a valid string (not undefined, not starting with `[`), use it directly
2. **Field-specific** — `fields.{id}.validation.{type}`
3. **Namespaced generic** — `validation.{id}.{type}`
4. **Field default** — `fields.{id}.validation.default`
5. **Type generic** — `validation.{type}`
6. **Ultimate fallback** — `validation.default`

The cascade stops at the first key that returns a valid translation (not undefined, not starting with `[`).

### Interpolation

If the error has `arguments` (scalar or array), any `{{placeholder}}` in the resolved message is replaced with the argument value. For arrays, the first element is used.

## Template chain explanation

### Current (hmpo-components)

```
govuk/template.njk
  └── hmpo-template.njk (hmpo-components)
       └── base-form.njk (common-express)
            └── page-specific.njk
```

The `hmpo-template.njk` adds:

- Error summary via `hmpoForm` macro
- Translation-driven page titles
- Cookie banner, phase banner, header, footer
- Analytics scripts

### New (cri-base-form/page)

```
govuk/template.njk
  └── cri-base-form.njk (this repo) — with error summary
  └── cri-base-page.njk (this repo) — without error summary
       └── page-specific.njk
```

The new base templates replicate the same output but:

- Use `govukErrorSummary` directly instead of hmpo macros
- Use `@govuk-one-login/frontend-ui` components for header/footer/banner
- Consume pre-built `formFields` from the middleware instead of calling hmpo macros
- Support `MAY_2025_REBRAND_ENABLED` feature flag

## Per-page analysis

### Search page (`/search`)

**Fields:** `addressSearch` (type: text, autocomplete: postal-code)

**Current template:** Extends `base-form.njk`, uses `hmpoText` macro for the postcode input, `hmpoSubmit` for the button.

**Migration:** Extend `cri-base-form.njk`, use `govukInput(formFields.addressSearch)` for the input, `govukButton` for submit. The `prepopulatedPostcode` inset text logic remains as-is.

**Locals needed:** `formFields.addressSearch`, `errorSummary`, `csrfToken`, `prepopulatedPostcode`

### Results page (`/results`)

**Fields:** `addressResults` (type: list)

**Current template:** Extends `base-form.njk`, uses `hmpoSelect` macro with `addresses` items passed from controller.

**Migration:** Extend `cri-base-form.njk`, use `govukSelect(formFields.addressResults)`. The controller already builds the items array via `addressesToSelectItems` presenter — these pre-built `{text, value}` objects pass through the adapter directly.

**Locals needed:** `formFields.addressResults`, `errorSummary`, `csrfToken`

**Note:** The controller sets `res.locals.addresses` — the field config's `items` should be populated from this in the controller's `locals()` method, or the template can override items: `govukSelect(formFields.addressResults | merge({ items: addresses }))`.

### Confirm page (`/summary/confirm`)

**Fields:** None (display-only page)

**Current template:** Extends `address-confirm.njk` component which uses `govukSummaryList` to display collected address data.

**Migration:** Extend `cri-base-page.njk` (no error summary needed). The confirm page doesn't use form fields — it displays a summary list built by the confirm controller. No `formFields` processing needed.

**Locals needed:** Summary list data from controller, `csrfToken` for the confirm button form.

### Problem page (`/problem`)

**Fields:** `addressBreak` (type: radios, items: ['continue', 'retry'])

**Current template:** Uses hmpo radios macro.

**Migration:** Extend `cri-base-form.njk`, use `govukRadios(formFields.addressBreak)`.

**Locals needed:** `formFields.addressBreak`, `errorSummary`, `csrfToken`

### Address (manual entry) page (`/address`)

**Fields:** `addressFlatNumber`, `addressHouseNumber`, `addressHouseName`, `addressStreetName`, `addressLocality`, `addressYearFrom` (all type: text or number)

**Current template:** Extends `base-form.njk`, includes `address-input-fields.njk` component and year-from field component.

**Migration:** Extend `cri-base-form.njk`, use `govukInput(formFields.addressFlatNumber)`, etc. for each field. The `addressYearFrom` field is type: number so gets `inputmode: 'numeric'` and `govuk-input--width-4` class automatically.

**Locals needed:** `formFields.*` for each field, `errorSummary`, `csrfToken`

### What country page (`/what-country`)

**Fields:** `country` (type: select with country items)

**Current template:** Uses hmpo select macro with country list.

**Migration:** Extend `cri-base-form.njk`, use `govukSelect(formFields.country)`. Country items are pre-built objects from the countries data file.

**Locals needed:** `formFields.country`, `errorSummary`, `csrfToken`
