/**
 * Form Fields Middleware
 *
 * Transforms hmpo-form-wizard session state (res.locals.errors, values, options.fields)
 * into pre-built GOV.UK Frontend component params on res.locals.formFields.
 *
 * Views can then call GOV.UK macros directly:
 *   {{ govukInput(formFields.addressSearch) }}
 *   {{ govukSelect(formFields.addressResults) }}
 *   {{ govukRadios(formFields.hasPreviousUKAddressWithinThreeMonths) }}
 */

/**
 * Resolves an error message for a given field error using the translation cascade.
 *
 * Resolution order:
 * 1. fields.<fieldId>.validation.<errorType>
 * 2. validation.<fieldId>.<errorType>
 * 3. fields.<fieldId>.validation.default
 * 4. validation.<errorType>
 * 5. validation.default
 *
 * @param {Function} translate - The req.translate function
 * @param {string} fieldId - The field identifier
 * @param {object} error - The error object from hmpo-form-wizard
 * @returns {string} The resolved error message text
 */
export function resolveErrorMessage(translate, fieldId, error) {
  if (error.message) {
    return error.message;
  }

  const errorType = error.type || "default";

  const keys = [
    `fields.${fieldId}.validation.${errorType}`,
    `validation.${fieldId}.${errorType}`,
    `fields.${fieldId}.validation.default`,
    `validation.${errorType}`,
    `validation.default`,
  ];

  // Build context for interpolation (e.g., {{label}} in "Enter your {{label}}")
  const label =
    translate(`fields.${fieldId}.label`, { self: false }) ||
    translate(`fields.${fieldId}.legend`, { self: false }) ||
    fieldId;

  const context = {
    label: typeof label === "string" ? label.toLowerCase() : fieldId,
    ...(error.args || {}),
  };

  // Try each key in order, return first that resolves to something meaningful
  for (const key of keys) {
    const result = translate(key, { self: false, context });
    if (result && result !== `[${key}]` && !result.startsWith("[")) {
      return result;
    }
  }

  return translate("validation.default", { context }) || "There is a problem";
}

/**
 * Builds a GOV.UK errorMessage object for a field, or undefined if no error.
 *
 * @param {Function} translate - The req.translate function
 * @param {string} fieldId - The field identifier
 * @param {object|undefined} error - The error object, or undefined
 * @param {object} fieldConfig - The field configuration from options.fields
 * @returns {object|undefined} GOV.UK errorMessage params or undefined
 */
function buildErrorMessage(translate, fieldId, error, fieldConfig) {
  if (!error) return undefined;

  // If this field belongs to an errorGroup, just signal error state (boolean true)
  // The group field handles the actual message
  if (fieldConfig.errorGroup) {
    return error ? { text: "" } : undefined;
  }

  const text = resolveErrorMessage(translate, fieldId, error);
  return {
    text,
    visuallyHiddenText: translate("govuk.error", { self: false }) || "Error",
  };
}

/**
 * Resolves label text for a field.
 *
 * @param {Function} translate - The req.translate function
 * @param {string} fieldId - The field identifier
 * @param {object} overrides - Any label overrides from the view
 * @returns {object} GOV.UK label params
 */
function buildLabel(translate, fieldId, overrides) {
  if (overrides && (overrides.text || overrides.html)) {
    return overrides;
  }

  const text = translate(`fields.${fieldId}.label`, { self: false });
  const resolved =
    text && !text.startsWith("[") ? text : overrides?.text || fieldId;

  return {
    text: resolved,
    ...(overrides?.classes ? { classes: overrides.classes } : {}),
    ...(overrides?.isPageHeading ? { isPageHeading: true } : {}),
  };
}

/**
 * Resolves hint text for a field.
 *
 * @param {Function} translate - The req.translate function
 * @param {string} fieldId - The field identifier
 * @returns {object|undefined} GOV.UK hint params or undefined
 */
function buildHint(translate, fieldId) {
  const text = translate(`fields.${fieldId}.hint`, { self: false });
  if (text && !text.startsWith("[")) {
    return { text };
  }
  return undefined;
}

/**
 * Builds govukInput params for a text/number field.
 */
function buildInputParams(translate, fieldId, fieldConfig, value, error) {
  const params = {
    id: fieldId,
    name: fieldId,
    value: value !== undefined && value !== null ? String(value) : "",
    label: buildLabel(translate, fieldId),
    classes: fieldConfig.classes || "govuk-!-width-one-half",
    errorMessage: buildErrorMessage(translate, fieldId, error, fieldConfig),
  };

  const hint = buildHint(translate, fieldId);
  if (hint) {
    params.hint = hint;
  }

  if (fieldConfig.autocomplete) {
    params.autocomplete = fieldConfig.autocomplete;
  }

  if (fieldConfig.type === "number") {
    params.inputmode = "numeric";
    params.classes = fieldConfig.classes || "govuk-input--width-4";
    params.spellcheck = false;
  }

  if (fieldConfig.inputmode) {
    params.inputmode = fieldConfig.inputmode;
  }

  return params;
}

/**
 * Builds govukSelect params for a select/list field.
 */
function buildSelectParams(translate, fieldId, fieldConfig, value, error) {
  const params = {
    id: fieldId,
    name: fieldId,
    value: value !== undefined && value !== null ? String(value) : "",
    label: buildLabel(translate, fieldId),
    errorMessage: buildErrorMessage(translate, fieldId, error, fieldConfig),
  };

  const hint = buildHint(translate, fieldId);
  if (hint) {
    params.hint = hint;
  }

  if (fieldConfig.classes) {
    params.classes = fieldConfig.classes;
  }

  // Items can come from field config or be set later by the controller
  if (fieldConfig.items) {
    params.items = buildSelectItems(translate, fieldId, fieldConfig.items);
  }

  return params;
}

/**
 * Builds items array for a select component.
 */
function buildSelectItems(translate, fieldId, items) {
  if (!items || !Array.isArray(items)) return [];

  return items.map((item) => {
    if (typeof item === "object" && item.text) {
      // Already in { text, value } format (e.g., from presenter)
      return item;
    }

    if (typeof item === "string") {
      const labelKey = `fields.${fieldId}.items.${item}.label`;
      const text = translate(labelKey, { self: false });
      return {
        value: item,
        text: text && !text.startsWith("[") ? text : item,
      };
    }

    return item;
  });
}

/**
 * Builds govukRadios params for a radios field.
 */
function buildRadiosParams(translate, fieldId, fieldConfig, value, error) {
  const legendText = translate(`fields.${fieldId}.label`, { self: false });
  const hintText = translate(`fields.${fieldId}.hint`, { self: false });

  const params = {
    idPrefix: fieldId,
    name: fieldId,
    value: value !== undefined && value !== null ? String(value) : undefined,
    fieldset: {
      legend: {
        text: legendText && !legendText.startsWith("[") ? legendText : fieldId,
        classes: "govuk-fieldset__legend--m",
      },
    },
    errorMessage: buildErrorMessage(translate, fieldId, error, fieldConfig),
  };

  if (hintText && !hintText.startsWith("[")) {
    params.hint = { text: hintText };
  }

  if (fieldConfig.classes) {
    params.classes = fieldConfig.classes;
  }

  if (fieldConfig.inline) {
    params.classes = (params.classes || "") + " govuk-radios--inline";
    params.classes = params.classes.trim();
  }

  // Build items from field config
  if (fieldConfig.items) {
    params.items = buildRadioItems(translate, fieldId, fieldConfig.items);
  }

  return params;
}

/**
 * Builds items array for a radios component.
 */
function buildRadioItems(translate, fieldId, items) {
  if (!items || !Array.isArray(items)) return [];

  return items.map((item) => {
    if (typeof item === "object" && (item.text || item.html)) {
      return item;
    }

    const itemValue = typeof item === "string" ? item : item?.value || item;
    const labelKey = `fields.${fieldId}.items.${itemValue}.label`;
    const hintKey = `fields.${fieldId}.items.${itemValue}.hint`;

    const text = translate(labelKey, { self: false });
    const hint = translate(hintKey, { self: false });

    const radioItem = {
      value: itemValue,
      text: text && !text.startsWith("[") ? text : itemValue,
    };

    if (hint && !hint.startsWith("[") && hint.trim()) {
      radioItem.hint = { text: hint };
    }

    return radioItem;
  });
}

/**
 * Builds all form field params for the current wizard step.
 *
 * @param {object} options - Options
 * @param {Function} options.translate - The req.translate function
 * @param {object} options.fields - The field definitions from options.fields
 * @param {object} options.values - Current form values
 * @param {object} options.errors - Current validation errors
 * @returns {object} Map of fieldId → GOV.UK component params
 */
export function buildFormFields({ translate, fields, values, errors }) {
  if (!fields) return {};

  const formFields = {};

  for (const [fieldId, fieldConfig] of Object.entries(fields)) {
    // Skip journey/meta fields that don't render
    if (fieldConfig.journeyKey && !fieldConfig.type) continue;

    const value = values?.[fieldId];
    const error = errors?.[fieldId];
    const type = fieldConfig.type || "text";

    switch (type) {
      case "text":
      case "number":
        formFields[fieldId] = buildInputParams(
          translate,
          fieldId,
          fieldConfig,
          value,
          error
        );
        break;

      case "select":
      case "list":
        formFields[fieldId] = buildSelectParams(
          translate,
          fieldId,
          fieldConfig,
          value,
          error
        );
        break;

      case "radios":
        formFields[fieldId] = buildRadiosParams(
          translate,
          fieldId,
          fieldConfig,
          value,
          error
        );
        break;

      default:
        // For unknown types, build as text input
        formFields[fieldId] = buildInputParams(
          translate,
          fieldId,
          fieldConfig,
          value,
          error
        );
        break;
    }
  }

  return formFields;
}

/**
 * Builds the govukErrorSummary params from the wizard's errorlist.
 *
 * @param {object} options
 * @param {Function} options.translate - The translate function
 * @param {Array} options.errorlist - The filtered error list from hmpo-form-wizard
 * @param {object} options.fields - The field definitions from options.fields
 * @returns {object|null} GOV.UK Error Summary params, or null if no errors
 */
export function buildErrorSummary({ translate, errorlist, fields }) {
  if (!errorlist || errorlist.length === 0) {
    return null;
  }

  const titleText =
    translate("govuk.errorSummaryTitle", { self: false }) ||
    "There is a problem";

  const errorList = errorlist.map((error) => {
    const fieldId = error.field || error.key;
    const text = resolveErrorMessage(translate, fieldId, error);
    return {
      href: `#${fieldId}`,
      text,
    };
  });

  return {
    titleText,
    errorList,
  };
}

/**
 * Builds the page title string following the GOV.UK pattern:
 *   "Error: Page Title – Service Name – GOV.UK One Login"
 *
 * @param {object} options
 * @param {Function} options.translate - The translate function
 * @param {Array} options.errorlist - The error list (to determine "Error:" prefix)
 * @param {string} options.pageTitle - The page title text
 * @param {string} [options.serviceName] - The service name (defaults to translation)
 * @returns {string} The full page title string
 */
export function buildPageTitle({
  translate,
  errorlist,
  pageTitle,
  serviceName,
}) {
  const errorPrefix =
    errorlist && errorlist.length > 0
      ? (translate("govuk.error", { self: false }) || "Error") + ": "
      : "";

  const resolvedServiceName =
    serviceName ||
    translate("govuk.serviceName", { self: false }) ||
    "";

  const serviceNameSuffix =
    resolvedServiceName && resolvedServiceName.trim()
      ? ` – ${resolvedServiceName}`
      : "";

  return `${errorPrefix}${pageTitle}${serviceNameSuffix} – GOV.UK One Login`;
}

/**
 * Express middleware that builds form field params on res.locals.formFields.
 *
 * Must be mounted AFTER hmpo-form-wizard has populated res.locals
 * (i.e., after the wizard's GET handler has run).
 *
 * Usage:
 *   router.use(formFieldsMiddleware);
 *   // or after wizard:
 *   app.use(formFieldsMiddleware);
 */
export function formFieldsMiddleware(req, res, next) {
  // Only build if the wizard has populated options (i.e., this is a wizard-controlled route)
  if (!res.locals.options?.fields) {
    return next();
  }

  const translate = res.locals.translate || req.translate || ((key) => key);

  res.locals.formFields = buildFormFields({
    translate,
    fields: res.locals.options.fields,
    values: res.locals.values || {},
    errors: res.locals.errors || {},
  });

  // Build error summary
  res.locals.errorSummary = buildErrorSummary({
    translate,
    errorlist: res.locals.errorlist || [],
    fields: res.locals.options.fields,
  });

  // Expose CSRF token under a cleaner name
  res.locals.csrfToken = res.locals["csrf-token"];

  next();
}
