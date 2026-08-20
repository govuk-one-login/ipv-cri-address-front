# Form Adapter Contract

This document specifies the data contract between `hmpo-form-wizard`, `hmpo-components`, and the Nunjucks template layer. It serves as the reference for building a replacement adapter that eliminates the `hmpo-components` dependency.

## 1. What `hmpo-form-wizard` Puts on `res.locals`

After the wizard processes a GET request and calls `_locals()`, the following are assigned to `res.locals`:

```js
{
  errors: {                          // Object — validation errors keyed by field ID
    fieldId: {
      type: "required",              // validator type that failed
      key: "fieldId",                // field key (same as object key)
      field: "fieldId",              // field name for linking
      errorGroup: undefined,         // if set, groups multiple fields under one error
      url: "/search",                // URL where the error was generated
      message: undefined,            // pre-resolved message (rare, usually undefined)
      headerMessage: undefined       // header variant (rare)
    }
  },
  errorlist: [                       // Array — filtered list (excludes errorGroup duplicates)
    { type, key, field, errorGroup, url }
  ],
  values: {                          // Object — current field values (session + errorValues merged)
    fieldId: "SW1A 2AA"
  },
  options: {                         // Object — full step config
    fields: {                        // field definitions for THIS step only
      fieldId: { type, validate, items, autocomplete, ... }
    },
    route: "/search",                // step route path
    next: [...],                     // next step config
    name: "address",                 // wizard name
    templatePath: "address"          // view lookup path
  },
  action: "/search",                 // current pathname (form action URL)
  nextPage: "/results",              // resolved next step URL
  baseUrl: "",                       // req.baseUrl
  backLink: "/prepopulate",          // previous step URL (or undefined)
  "csrf-token": "abc123..."          // CSRF token string
}
```

## 2. What `hmpo-components` Adds via `locals.js` Middleware

```js
{
  translate: (key, options) => {     // Translation function with Nunjucks rendering
    // 1. Calls req.translate(key, options) via hmpo-i18n
    // 2. Recursively renders Nunjucks {{ }} expressions in the result
    //    using res.locals as template context
    // Returns: rendered string
  },
  t: /* alias for translate */,
  ctx: (key) => {                    // Context accessor
    // ctx() → returns res.locals
    // ctx("values.addressSearch") → traverses dotted path
    // Used by hmpo macros to access form state
  }
}
```

## 3. What `hmpo-components` Adds via `globals.js` (Nunjucks Globals)

These are registered on the Nunjucks environment and called **inside** the hmpo macros:

| Global | Purpose |
|--------|---------|
| `hmpoGetParams(ctx, params, ...base)` | Merges macro params with `options.fields[id]` config |
| `hmpoGetValue(ctx, params)` | Returns `errorValues[id]` or `values[id]` |
| `hmpoGetError(ctx, params)` | Builds GOV.UK error message object from `errors[id]` |
| `hmpoGetErrorSummary(ctx)` | Builds error summary array from `errorlist` |
| `hmpoBuildErrorMessage(ctx, error, header)` | Resolves error text via translation cascade |
| `hmpoGetOptions(ctx, params, type, optional)` | Resolves label/hint/legend from params or translations |
| `hmpoGetItems(ctx, params, value, ...)` | Builds select/radio items with selected state |
| `hmpoGetAttributes(ctx, params, attrs)` | Merges HTML attributes |
| `hmpoGetValidatorAttribute(ctx, params, type, ...)` | Extracts validator args for HTML attributes |
| `merge(...src)` | Deep-clone-merge objects |
| `isArray(x)` / `isObject(x)` / `isString(x)` | Type checks |
| `startsWith(str, prefix)` / `substr(str, start, len)` | String utilities |
| `set(obj, key, value)` | Object property setter |

## 4. Template Inheritance Chain

```
Page view (e.g. search.njk)
  {% extends "base-form.njk" %}                    ← di-ipv-cri-common-express
    {% extends "identity-base-form.njk" %}         ← @govuk-one-login/frontend-ui
      {% extends "form-template.njk" %}            ← hmpo-components
        {% extends "app-template.njk" %}           ← hmpo-components
          {% extends "hmpo-template.njk" %}        ← hmpo-components
            {% extends "govuk/template.njk" %}     ← govuk-frontend
```

### What each template reads from `res.locals`:

#### `hmpo-template.njk`:
- `options.route` → derives `hmpoPageKey` via `| camelcase` filter
- `hmpoTitleKey` or `"pages." + hmpoPageKey + ".title"` → derives `hmpoTitle` via `translate()`
- `govukServiceNameKey` or `"govuk.serviceName"` → derives `govukServiceName`
- `errorlist.length` → prefixes "Error: " to page title
- `hmpoGetErrorSummary(ctx)` → renders error summary component
- `backLink` → renders back link
- `assetPath` → CSS/JS paths

#### `form-template.njk`:
- `options.fields` → iterates to find top-level fields
- `options.route` → generates `hmpoPageKey` via `| camelcase`
- `translate(...)` → checks for page heading translations

#### `identity-base-form.njk`:
- `MAY_2025_REBRAND_ENABLED` → sets `govukRebrand` and `assetPath`
- `errorlist.length` → "Error:" prefix in page title
- `hmpoTitle`, `govukServiceName` → page title construction
- `translations` → passed to `frontendUiCookieBanner`, `frontendUiHeader`, `frontendUiFooter`, `frontendUiPhaseBanner`, `frontendUiLanguageSelect`
- `currentUrl` → phase banner and language select
- `htmlLang` → language select active language
- `backLink` → back link rendering
- `cspNonce` → script nonce
- `ga4ContainerId`, `ga4Enabled`, `uaEnabled`, etc. → analytics
- `deviceIntelligenceEnabled`, `deviceIntelligenceDomain` → device intelligence
- `pageTitleKey` → GA4 on-page-load tracking (uses `| translate` filter)

## 5. Translation Key Conventions

### File Structure
```
src/locales/
├── en/
│   ├── fields.yml         # Field labels, hints, validation messages, radio items
│   ├── pages.yml          # Page titles, headings, content blocks
│   ├── default.yml        # Shared: buttons, links, govuk chrome, validation defaults
│   └── pages.errors.yml   # Error page content
└── cy/                    # Welsh translations (same structure)
```

### Key Patterns

| Pattern | Purpose | Example |
|---------|---------|---------|
| `pages.<pageKey>.title` | Page title / H1 | `pages.addressSearch.title` |
| `pages.<pageKey>.warning` | Warning text | `pages.address-confirm.warning` |
| `pages.<pageKey>.buttons.<action>` | Page-specific button text | `pages.address-confirm.buttons.next` |
| `pages.<pageKey>.content` | Body content (array → paragraphs) | `pages.addressProblem.content` |
| `fields.<fieldId>.label` | Field label text | `fields.addressSearch.label` |
| `fields.<fieldId>.hint` | Field hint text | `fields.addressSearch.hint` |
| `fields.<fieldId>.legend` | Fieldset legend (radios) | `fields.hasPreviousUKAddressWithinThreeMonths.label` |
| `fields.<fieldId>.validation.<type>` | Field-specific error message | `fields.addressSearch.validation.required` |
| `fields.<fieldId>.validation.default` | Field-specific fallback error | `fields.addressYearFrom.validation.default` |
| `fields.<fieldId>.items.<value>.label` | Radio/select item label | `fields.addressBreak.items.continue.label` |
| `fields.<fieldId>.items.<value>.hint` | Radio/select item hint | - |
| `buttons.<action>` | Shared button text | `buttons.find-address` |
| `links.<name>` | HTML link content (may contain Nunjucks) | `links.changePostcode` |
| `validation.<type>` | Generic validation fallback | `validation.required` → `"Enter your {{label}}"` |
| `validation.default` | Ultimate fallback | `"You must answer this question"` |
| `govuk.<key>` | GOV.UK chrome text | `govuk.errorSummaryTitle` |

### Translation Interpolation

Translation values can contain Nunjucks expressions rendered at runtime:

```yaml
links:
  changePostcode: >-
    <p>Postcode <br> <b>{{values.addressPostcode}}</b> ...
validation:
  required: "Enter your {{label}}"
```

The `translate()` function renders these using `res.locals` as context. The `{{label}}` in validation messages uses the field's translated label (lowercased).

### Validation Error Resolution Order

When building an error message for a field error, the translation cascade is:

1. `fields.<fieldId>.validation.<errorType>` — field-specific, type-specific
2. `validation.<fieldId>.<errorType>` — alternative namespace
3. `fields.<fieldId>.validation.default` — field-specific fallback
4. `validation.<errorType>` — generic type fallback (e.g., `validation.required`)
5. `validation.default` — ultimate fallback

Context passed to translation interpolation:
```js
{
  ...res.locals,
  error,                                          // the error object
  key: "fields.<fieldId>",                       // content key prefix
  label: translate("fields.<fieldId>.label").toLowerCase(),
  legend: translate("fields.<fieldId>.legend").toLowerCase(),
  name: translate(["fields.<fieldId>.name", "fields.<fieldId>.label", "fields.<fieldId>.legend"]).toLowerCase()
}
```

## 6. Per-Page Analysis (PoC Pages)

### 6.1 Address Search (`/search`)

**Step config:**
```js
"/search": {
  controller: AddressSearchController,
  fields: ["addressSearch"],
  next: [
    { field: "requestIsSuccessful", op: "===", value: true, next: "results" },
    "problem"
  ]
}
```

**Field definition (`addressSearch`):**
```js
{
  type: "text",
  autocomplete: "postal-code",
  formatter: [{ type: "removeSpaces", fn: (val) => val.replace(/\s+/g, "") }],
  validate: [
    { type: "required" },
    { type: "postcodeLength", fn: postcodeLength },
    { type: "alphaNumeric", fn: alphaNumeric },
    { type: "missingNumericOrAlpha", fn: missingAlphaOrNumeric },
    { type: "isUkPostcode", fn: isUkPostcode }
  ]
}
```

**Controller adds to locals:**
```js
res.locals.prepopulatedPostcode = req.session.prepopulatedPostcode; // boolean
```

**Template (`search.njk`) usage:**

| Element | Current macro | GOV.UK equivalent | Key params needed |
|---------|--------------|-------------------|-------------------|
| Form wrapper | `hmpoForm(ctx, {autocomplete: 'on'})` | Plain `<form>` | `action`, `csrf-token` |
| Postcode input | `hmpoText(ctx, {id: "addressSearch", label: {...}, classes: "govuk-!-width-one-half", hint: ..., autocomplete: "postal-code"})` | `govukInput({...})` | id, name, value, label.text, hint.text, errorMessage, classes, autocomplete |
| Submit button | `hmpoSubmit(ctx, {id: "continue", text: translate("buttons.find-address"), attributes: {...}})` | `govukButton({...})` | text, attributes |
| Inset text | `govukInsetText({text: ...})` | Same (already GOV.UK) | — |

**Translation keys used:**
- `pages.addressSearch.title` — H1 and page title
- `pages.addressSearch.drivingLicence` — inset text (conditional)
- `fields.addressSearch.label` — input label
- `fields.addressSearch.hint` — input hint
- `buttons.find-address` — submit button
- `fields.addressSearch.validation.required` (on error)
- `fields.addressSearch.validation.postcodeLength` (on error)
- `fields.addressSearch.validation.alphaNumeric` (on error)

---

### 6.2 Address Results (`/results`)

**Step config:**
```js
"/results": {
  controller: AddressResultsController,
  fields: ["addressResults"],
  next: "address"
}
```

**Field definition (`addressResults`):**
```js
{
  type: "list",
  validate: [{ type: "required" }]
}
```

**Controller adds to locals:**
```js
locals.addressPostcode = req.sessionModel.get("addressPostcode");  // string
locals.addresses = presenters.addressesToSelectItems({              // Array<{text, value}>
  addresses: req.sessionModel.get("searchResults"),
  translate: req.translate
});
// Shape: [{ text: "3 addresses found", value: "" }, { text: "Full address string", value: "Full address string" }, ...]
```

**Template (`results.njk`) usage:**

| Element | Current macro | GOV.UK equivalent | Key params needed |
|---------|--------------|-------------------|-------------------|
| Form wrapper | `hmpoForm(ctx, {autocomplete: 'on'})` | Plain `<form>` | `action`, `csrf-token` |
| Address dropdown | `hmpoSelect(ctx, {id: "addressResults", label: ..., hint: "", items: addresses})` | `govukSelect({...})` | id, name, value, items, label.text, errorMessage |
| Change postcode | `hmpoHtml(translate("links.changePostcode"))` | `{{ translate("links.changePostcode") \| safe }}` | Rendered HTML |
| Can't find link | `hmpoHtml(translate("links.cantFindAddress"))` | `{{ translate("links.cantFindAddress") \| safe }}` or render helper | Array → HTML |
| Submit button | `hmpoSubmit(ctx, {id: "continue", text: ...})` | `govukButton({...})` | text, attributes |

**Translation keys used:**
- `pages.address-results.title` — H1 and page title
- `links.changePostcode` — HTML block (contains `{{values.addressPostcode}}` interpolation)
- `fields.addressResults.label` — select label
- `links.cantFindAddress` — array of HTML paragraphs
- `buttons.select-address` — submit button
- `fields.addressResults.validation.required` (on error)

**Important note:** `links.changePostcode` contains `{{values.addressPostcode}}` which is rendered by the `translate()` function using `res.locals` as context. The adapter must preserve this interpolation behaviour.

---

### 6.3 Address Confirm (`/summary/confirm`)

**Step config:**
```js
"/confirm": {
  controller: AddressConfirmController,
  entryPoint: true,
  fields: [
    "addPrevious",
    "hasPreviousUKAddressWithinThreeMonths",
    "currentAddress",
    "previousAddress"
  ],
  next: [
    { field: "addPreviousAddresses", op: "===", value: true, next: "/previous" },
    "/oauth2/callback"
  ]
}
```

**Field definition (`hasPreviousUKAddressWithinThreeMonths`):**
```js
{
  type: "radios",
  items: ["yes", "no"],
  validate: []  // dynamically populated in controller.validateFields()
}
```

**Controller adds to locals:**
```js
locals.isMoreInfoRequired = boolean;            // controls radio visibility
locals.currentAddressRowValue = string;         // HTML: "Line1<br>Line2<br>Postcode"
locals.validFromRow = string;                   // Year: "2021"
locals.previousAddressRowValue = string | null; // HTML or null
locals.changeCurrentHref = "/address/edit?edit=true";
```

**Template (`address-confirm.njk`) usage:**

| Element | Current macro | GOV.UK equivalent | Key params needed |
|---------|--------------|-------------------|-------------------|
| Warning | `govukWarningText({text: ..., iconFallbackText: "Warning"})` | Same (already GOV.UK) | — |
| Summary list | `govukSummaryList({rows: [...]})` | Same (already GOV.UK) | — |
| Form wrapper | `hmpoForm(ctx)` | Plain `<form>` | `action`, `csrf-token` |
| Radio buttons | `hmpoRadios(ctx, {id: "hasPreviousUKAddressWithinThreeMonths", inline: true, legend: ..., ...})` | `govukRadios({...})` | name, value, items, fieldset.legend.text, classes, errorMessage |
| Submit button | `hmpoSubmit(ctx, {text: ..., id: "continue", ...})` | `govukButton({...})` | text, attributes |

**Translation keys used:**
- `pages.address-confirm.title` — H1 and page title
- `pages.address-confirm.warning` — warning text
- `fields.address-confirm.current` — summary list key
- `fields.address-confirm.year-current` — summary list key
- `fields.address-confirm.previous` — summary list key
- `fields.address-confirm.change.change-current-address` — change link HTML
- `fields.address-confirm.change.change-current-yearfrom` — change link HTML
- `fields.address-confirm.change.change-previous-address` — change link HTML
- `fields.hasPreviousUKAddressWithinThreeMonths.label` — radio legend
- `fields.hasPreviousUKAddressWithinThreeMonths.items.yes.label` — radio item
- `fields.hasPreviousUKAddressWithinThreeMonths.items.no.label` — radio item
- `pages.address-confirm.buttons.next` — submit button
- `fields.hasPreviousUKAddressWithinThreeMonths.validation.confirmationValidation` (on error)

---

## 7. Variables Set by Page Templates (for Analytics)

Every page view sets these template variables for the GA4 analytics layer in `identity-base-form.njk`:

```njk
{% set isPageDataSensitive = false %}
{% set statusCode = '200' %}
{% set pageTitleKey = "pages.addressSearch.title" %}
{% set contentID = "d29ae122-986d-4730-8dac-8798b79f7aba" %}
{% set taxLevel2 = 'address' %}
{% set isPageDynamic = false %}
{% set loggedInStatus = true %}
{% set gtmJourney = "address - start" %}
{% set hmpoPageKey = "addressSearch" %}
```

The replacement template must pass these through to the analytics block.

---

## 8. `hmpoHtml` Rendering Rules

The `hmpoHtml` macro renders translated content as structured HTML:

| Input | Output |
|-------|--------|
| `string` | `<p>string</p>` |
| `["str1", "str2"]` | `<p>str1</p><p>str2</p>` |
| `[["item1", "item2"]]` or `[{items: [...]}]` | `<ul class="govuk-list govuk-list--bullet"><li>item1</li><li>item2</li></ul>` |
| `{id: "html content"}` | `<p id="id">html content</p>` |
| String starting with `"> "` | Rendered as `govukInsetText` |
| String starting with `"## "` | Rendered as `<h2>` |
| String starting with `"### "` | Rendered as `<h3>` |

For the address-front PoC pages, `hmpoHtml` is used with:
- `translate("links.changePostcode")` — returns a string containing HTML (rendered as `<p>...</p>`)
- `translate("links.cantFindAddress")` — returns an **array** of strings (rendered as multiple `<p>` elements)

The simplest replacement is `{{ translate("key") | safe }}` for strings, and a small macro or loop for arrays.
