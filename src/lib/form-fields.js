/**
 * Form field adapter — transforms hmpo-form-wizard state into GOV.UK Design System
 * component parameters, removing the need for hmpo-components template macros.
 */

/**
 * Check if a translation result is a valid (found) translation.
 * hmpo-i18n returns undefined or strings starting with '[' for missing keys.
 */
function isValidTranslation(result) {
  if (result === undefined || result === null) return false;
  if (typeof result === "string" && result.startsWith("[")) return false;
  return true;
}

/**
 * Resolve an error message using a translation cascade:
 * 1. fields.{id}.validation.{errorType}
 * 2. validation.{id}.{errorType}
 * 3. fields.{id}.validation.default
 * 4. validation.{errorType}
 * 5. validation.default
 *
 * @param {Function} translate - Translation function
 * @param {string} fieldId - The field identifier
 * @param {object} error - Error object with .type and optionally .message, .arguments
 * @returns {string|undefined} Resolved error message or undefined
 */
export function resolveErrorMessage(translate, fieldId, error) {
  if (!error) return undefined;

  // If the error already has a pre-resolved message that isn't a key-miss
  if (error.message && isValidTranslation(error.message)) {
    return error.message;
  }

  const errorType = error.type || "default";
  const args = error.arguments;

  const cascade = [
    `fields.${fieldId}.validation.${errorType}`,
    `validation.${fieldId}.${errorType}`,
    `fields.${fieldId}.validation.default`,
    `validation.${errorType}`,
    `validation.default`,
  ];

  for (const key of cascade) {
    let result = translate(key, { self: false });
    if (isValidTranslation(result)) {
      // Interpolate arguments if present (e.g. {{count}})
      if (args !== undefined) {
        const argVal = Array.isArray(args) ? args[0] : args;
        result = result.replace(/\{\{[^}]+\}\}/g, String(argVal));
      }
      return result;
    }
  }

  return undefined;
}

/**
 * Build a hint object if the translation exists.
 */
function buildHint(translate, fieldId) {
  const hintText = translate(`fields.${fieldId}.hint`, { self: false });
  if (isValidTranslation(hintText)) {
    return { text: hintText };
  }
  return undefined;
}

/**
 * Build an errorMessage object for GOV.UK components.
 */
function buildErrorMessage(translate, fieldId, errors) {
  if (!errors || !errors[fieldId]) return undefined;

  const error = errors[fieldId];
  const text = resolveErrorMessage(translate, fieldId, error);
  if (!text) return undefined;

  const visuallyHiddenText = translate("govuk.error", { self: false });
  return {
    text,
    visuallyHiddenText: isValidTranslation(visuallyHiddenText)
      ? visuallyHiddenText
      : "Error",
  };
}

/**
 * Build form field parameters for a text/number input field.
 */
function buildInputField(translate, fieldId, fieldConfig, values, errors) {
  const isNumber = fieldConfig.type === "number";

  const params = {
    id: fieldId,
    name: fieldId,
    value: values?.[fieldId] ?? "",
    label: {
      text: translate(`fields.${fieldId}.label`) || fieldId,
    },
    classes: isNumber ? "govuk-input--width-4" : "govuk-!-width-one-half",
  };

  const hint = buildHint(translate, fieldId);
  if (hint) params.hint = hint;

  const errorMessage = buildErrorMessage(translate, fieldId, errors);
  if (errorMessage) params.errorMessage = errorMessage;

  if (fieldConfig.autocomplete) {
    params.autocomplete = fieldConfig.autocomplete;
  }

  if (isNumber) {
    params.inputmode = "numeric";
    params.spellcheck = false;
  }

  return params;
}

/**
 * Build form field parameters for a select/list field.
 */
function buildSelectField(translate, fieldId, fieldConfig, values, errors) {
  const params = {
    id: fieldId,
    name: fieldId,
    value: values?.[fieldId] ?? "",
    label: {
      text: translate(`fields.${fieldId}.label`) || fieldId,
    },
  };

  // Build items
  if (fieldConfig.items) {
    params.items = fieldConfig.items.map((item) => {
      if (typeof item === "object" && item.text !== undefined) {
        // Pre-built item objects (e.g. from addressesToSelectItems presenter)
        return item;
      }
      // String items — translate label
      const label = translate(`fields.${fieldId}.items.${item}.label`, {
        self: false,
      });
      return {
        text: isValidTranslation(label) ? label : item,
        value: item,
      };
    });
  } else {
    params.items = [];
  }

  const hint = buildHint(translate, fieldId);
  if (hint) params.hint = hint;

  const errorMessage = buildErrorMessage(translate, fieldId, errors);
  if (errorMessage) params.errorMessage = errorMessage;

  return params;
}

/**
 * Build form field parameters for a radios field.
 */
function buildRadiosField(translate, fieldId, fieldConfig, values, errors) {
  const params = {
    idPrefix: fieldId,
    name: fieldId,
    value: values?.[fieldId] ?? "",
    fieldset: {
      legend: {
        text: translate(`fields.${fieldId}.label`) || fieldId,
      },
    },
  };

  // Build items from field config items array
  if (fieldConfig.items) {
    params.items = fieldConfig.items.map((item) => {
      const itemValue = typeof item === "object" ? item.value : item;
      const label = translate(`fields.${fieldId}.items.${itemValue}.label`, {
        self: false,
      });
      return {
        text: isValidTranslation(label) ? label : itemValue,
        value: itemValue,
      };
    });
  } else {
    params.items = [];
  }

  const hint = buildHint(translate, fieldId);
  if (hint) params.hint = hint;

  const errorMessage = buildErrorMessage(translate, fieldId, errors);
  if (errorMessage) params.errorMessage = errorMessage;

  // Inline radios
  if (fieldConfig.inline) {
    params.classes = "govuk-radios--inline";
  }

  return params;
}

/**
 * Transform wizard state into GOV.UK component params for all fields.
 *
 * @param {object} options
 * @param {Function} options.translate - Translation function
 * @param {object} options.fields - Field definitions from wizard step config
 * @param {object} options.values - Current field values
 * @param {object} options.errors - Current validation errors
 * @returns {object} Map of fieldId → component params
 */
export function buildFormFields({ translate, fields, values, errors }) {
  if (!fields || typeof fields !== "object") return {};

  const result = {};

  for (const [fieldId, fieldConfig] of Object.entries(fields)) {
    if (!fieldConfig) continue;

    // Skip meta fields (have journeyKey but no type)
    if (fieldConfig.journeyKey && !fieldConfig.type) continue;

    // Skip fields without a type
    if (!fieldConfig.type) continue;

    const type = fieldConfig.type;

    if (type === "text" || type === "number") {
      result[fieldId] = buildInputField(
        translate,
        fieldId,
        fieldConfig,
        values,
        errors
      );
    } else if (type === "select" || type === "list") {
      result[fieldId] = buildSelectField(
        translate,
        fieldId,
        fieldConfig,
        values,
        errors
      );
    } else if (type === "radios") {
      result[fieldId] = buildRadiosField(
        translate,
        fieldId,
        fieldConfig,
        values,
        errors
      );
    }
  }

  return result;
}

/**
 * Build govukErrorSummary params from the wizard's errorlist.
 *
 * @param {object} options
 * @param {Function} options.translate - Translation function
 * @param {Array} options.errorlist - Array of error objects from wizard
 * @param {object} options.fields - Field definitions
 * @returns {object|null} Error summary params or null if no errors
 */
export function buildErrorSummary({ translate, errorlist, fields }) {
  if (!errorlist || !Array.isArray(errorlist) || errorlist.length === 0) {
    return null;
  }

  const titleText =
    translate("govuk.errorSummaryTitle", { self: false }) ||
    "There is a problem";

  const errorItems = errorlist.map((error) => {
    const fieldId = error.key || error.field;
    const text = resolveErrorMessage(translate, fieldId, error);

    // Determine the href — use the field key for the anchor
    const href = `#${fieldId}`;

    return {
      text: text || error.message || fieldId,
      href,
    };
  });

  return {
    titleText: isValidTranslation(titleText) ? titleText : "There is a problem",
    errorList: errorItems,
  };
}

/**
 * Build page title with optional 'Error:' prefix and service name.
 *
 * @param {object} options
 * @param {Function} options.translate - Translation function
 * @param {Array} options.errorlist - Error list (for prefix)
 * @param {string} options.pageTitle - Base page title
 * @param {string} options.serviceName - Service name to append
 * @returns {string} Formatted page title
 */
export function buildPageTitle({
  translate,
  errorlist,
  pageTitle,
  serviceName,
}) {
  let title = pageTitle || "";

  // Add 'Error:' prefix if there are errors
  const hasErrors =
    errorlist && Array.isArray(errorlist) && errorlist.length > 0;
  if (hasErrors) {
    const errorPrefix = translate("govuk.errorPrefix", { self: false });
    const prefix = isValidTranslation(errorPrefix) ? errorPrefix : "Error";
    title = `${prefix}: ${title}`;
  }

  // Append service name if present and non-whitespace
  if (serviceName && serviceName.trim()) {
    title = `${title} - ${serviceName.trim()}`;
  }

  // Append GOV.UK suffix
  title = `${title} - GOV.UK`;

  return title;
}

/**
 * Express middleware that wraps res.render() to inject formFields, errorSummary,
 * and csrfToken into the template locals at render time.
 *
 * This middleware must be mounted BEFORE hmpo-form-wizard because the wizard
 * calls res.render() internally. The wrapper intercepts that call and enriches
 * the locals.
 */
export function formFieldsMiddleware(req, res, next) {
  const originalRender = res.render.bind(res);

  res.render = function (view, options, callback) {
    // Normalize arguments — express allows (view, callback) or (view, options, callback)
    let opts = options || {};
    let cb = callback;
    if (typeof options === "function") {
      cb = options;
      opts = {};
    }

    // Merge res.locals into opts for access
    const locals = { ...res.locals, ...opts };

    // Only process if wizard has set options.fields
    const fields = locals.options?.fields;
    if (fields) {
      const translate = locals.translate || locals.t || ((key) => `[${key}]`);
      const values = locals.values || {};
      const errors = locals.errors || {};
      const errorlist = locals.errorlist || [];

      // Build form field params
      opts.formFields = buildFormFields({
        translate,
        fields,
        values,
        errors,
      });

      // Build error summary
      opts.errorSummary = buildErrorSummary({
        translate,
        errorlist,
        fields,
      });

      // Build page title
      const pageTitle = locals.pageTitle || "";
      const serviceName = locals.serviceName || "";
      opts.builtPageTitle = buildPageTitle({
        translate,
        errorlist,
        pageTitle,
        serviceName,
      });
    }

    // Pass through CSRF token
    if (locals["csrf-token"]) {
      opts.csrfToken = locals["csrf-token"];
    }

    originalRender(view, opts, cb);
  };

  next();
}
