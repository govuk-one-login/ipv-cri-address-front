import { describe, it, expect, vi } from "vitest";
import {
  resolveErrorMessage,
  buildFormFields,
  buildErrorSummary,
  buildPageTitle,
  formFieldsMiddleware,
} from "./form-fields.js";

/**
 * Creates a mock translate function mimicking hmpo-i18n behaviour.
 * @param {object} translations - Map of key → translated string
 * @returns {Function} translate(key, opts) — returns `[key]` for unknown keys
 *   when self !== false, undefined when self === false
 */
function createMockTranslate(translations = {}) {
  return (key, opts = {}) => {
    if (key in translations) {
      return translations[key];
    }
    // When self is explicitly false, return undefined for missing keys
    if (opts.self === false) {
      return undefined;
    }
    // Default: return bracketed key (hmpo-i18n default behaviour)
    return `[${key}]`;
  };
}

describe("resolveErrorMessage", () => {
  it("returns pre-set message from error object", () => {
    const translate = createMockTranslate({});
    const error = { type: "required", message: "Field is required" };
    expect(resolveErrorMessage(translate, "name", error)).toBe(
      "Field is required"
    );
  });

  it("resolves field-specific validation key", () => {
    const translate = createMockTranslate({
      "fields.email.validation.required": "Enter your email",
    });
    const error = { type: "required" };
    expect(resolveErrorMessage(translate, "email", error)).toBe(
      "Enter your email"
    );
  });

  it("resolves generic validation key with interpolation", () => {
    const translate = createMockTranslate({
      "validation.maxLength": "Must be {{count}} characters or less",
    });
    const error = { type: "maxLength", arguments: [30] };
    expect(resolveErrorMessage(translate, "field1", error)).toBe(
      "Must be 30 characters or less"
    );
  });

  it("resolves field default when specific type not found", () => {
    const translate = createMockTranslate({
      "fields.username.validation.default": "Username is invalid",
    });
    const error = { type: "obscureValidator" };
    expect(resolveErrorMessage(translate, "username", error)).toBe(
      "Username is invalid"
    );
  });

  it("falls back to validation.default as ultimate fallback", () => {
    const translate = createMockTranslate({
      "validation.default": "There is a problem with this field",
    });
    const error = { type: "unknownType" };
    expect(resolveErrorMessage(translate, "unknownField", error)).toBe(
      "There is a problem with this field"
    );
  });
});

describe("buildFormFields - text fields", () => {
  it("builds basic text field params", () => {
    const translate = createMockTranslate({
      "fields.postcode.label": "Postcode",
    });
    const result = buildFormFields({
      translate,
      fields: { postcode: { type: "text", autocomplete: "postal-code" } },
      values: { postcode: "SW1A 2AA" },
      errors: {},
    });

    expect(result.postcode).toMatchObject({
      id: "postcode",
      name: "postcode",
      value: "SW1A 2AA",
      label: { text: "Postcode" },
      classes: "govuk-!-width-one-half",
      autocomplete: "postal-code",
    });
  });

  it("includes error message when field has error", () => {
    const translate = createMockTranslate({
      "fields.postcode.label": "Postcode",
      "fields.postcode.validation.required": "Enter your postcode",
      "govuk.error": "Error",
    });
    const result = buildFormFields({
      translate,
      fields: { postcode: { type: "text" } },
      values: {},
      errors: { postcode: { type: "required" } },
    });

    expect(result.postcode.errorMessage).toEqual({
      text: "Enter your postcode",
      visuallyHiddenText: "Error",
    });
  });

  it("uses empty string for undefined values", () => {
    const translate = createMockTranslate({
      "fields.name.label": "Name",
    });
    const result = buildFormFields({
      translate,
      fields: { name: { type: "text" } },
      values: {},
      errors: {},
    });

    expect(result.name.value).toBe("");
  });
});

describe("buildFormFields - number fields", () => {
  it("sets inputmode and width-4 classes for number type", () => {
    const translate = createMockTranslate({
      "fields.year.label": "Year",
    });
    const result = buildFormFields({
      translate,
      fields: { year: { type: "number" } },
      values: { year: "2024" },
      errors: {},
    });

    expect(result.year.inputmode).toBe("numeric");
    expect(result.year.classes).toBe("govuk-input--width-4");
    expect(result.year.spellcheck).toBe(false);
  });
});

describe("buildFormFields - select/list", () => {
  it("builds basic select field params", () => {
    const translate = createMockTranslate({
      "fields.addressResults.label": "Select an address",
    });
    const result = buildFormFields({
      translate,
      fields: { addressResults: { type: "list" } },
      values: {},
      errors: {},
    });

    expect(result.addressResults).toMatchObject({
      id: "addressResults",
      name: "addressResults",
      label: { text: "Select an address" },
      items: [],
    });
  });

  it("passes through pre-built item objects", () => {
    const translate = createMockTranslate({
      "fields.addressResults.label": "Select an address",
    });
    const items = [
      { text: "1 High Street", value: "addr-1" },
      { text: "2 High Street", value: "addr-2" },
    ];
    const result = buildFormFields({
      translate,
      fields: { addressResults: { type: "list", items } },
      values: { addressResults: "addr-1" },
      errors: {},
    });

    expect(result.addressResults.items).toEqual(items);
    expect(result.addressResults.value).toBe("addr-1");
  });

  it("translates string items via config", () => {
    const translate = createMockTranslate({
      "fields.country.label": "Country",
      "fields.country.items.GB.label": "United Kingdom",
      "fields.country.items.US.label": "United States",
    });
    const result = buildFormFields({
      translate,
      fields: { country: { type: "select", items: ["GB", "US"] } },
      values: {},
      errors: {},
    });

    expect(result.country.items).toEqual([
      { text: "United Kingdom", value: "GB" },
      { text: "United States", value: "US" },
    ]);
  });

  it("includes error message for select fields", () => {
    const translate = createMockTranslate({
      "fields.addressResults.label": "Select",
      "fields.addressResults.validation.required": "Select an address",
      "govuk.error": "Error",
    });
    const result = buildFormFields({
      translate,
      fields: { addressResults: { type: "list" } },
      values: {},
      errors: { addressResults: { type: "required" } },
    });

    expect(result.addressResults.errorMessage).toEqual({
      text: "Select an address",
      visuallyHiddenText: "Error",
    });
  });
});

describe("buildFormFields - radios", () => {
  it("builds basic radios params with translated items", () => {
    const translate = createMockTranslate({
      "fields.choice.label": "What would you like to do?",
      "fields.choice.items.continue.label": "Continue",
      "fields.choice.items.retry.label": "Try again",
    });
    const result = buildFormFields({
      translate,
      fields: { choice: { type: "radios", items: ["continue", "retry"] } },
      values: { choice: "continue" },
      errors: {},
    });

    expect(result.choice).toMatchObject({
      idPrefix: "choice",
      name: "choice",
      value: "continue",
      fieldset: { legend: { text: "What would you like to do?" } },
      items: [
        { text: "Continue", value: "continue" },
        { text: "Try again", value: "retry" },
      ],
    });
  });

  it("includes error message for radios", () => {
    const translate = createMockTranslate({
      "fields.choice.label": "Choose",
      "fields.choice.items.a.label": "A",
      "fields.choice.validation.required": "Select an option",
      "govuk.error": "Error",
    });
    const result = buildFormFields({
      translate,
      fields: { choice: { type: "radios", items: ["a"] } },
      values: {},
      errors: { choice: { type: "required" } },
    });

    expect(result.choice.errorMessage).toEqual({
      text: "Select an option",
      visuallyHiddenText: "Error",
    });
  });

  it("adds inline class when field is inline", () => {
    const translate = createMockTranslate({
      "fields.yesNo.label": "Yes or no?",
      "fields.yesNo.items.yes.label": "Yes",
      "fields.yesNo.items.no.label": "No",
    });
    const result = buildFormFields({
      translate,
      fields: {
        yesNo: { type: "radios", items: ["yes", "no"], inline: true },
      },
      values: {},
      errors: {},
    });

    expect(result.yesNo.classes).toBe("govuk-radios--inline");
  });
});

describe("buildFormFields - journeyKey fields", () => {
  it("skips fields with journeyKey but no type (meta fields)", () => {
    const translate = createMockTranslate({});
    const result = buildFormFields({
      translate,
      fields: {
        context: { journeyKey: "context" },
        postcode: { type: "text" },
      },
      values: {},
      errors: {},
    });

    expect(result.context).toBeUndefined();
    expect(result.postcode).toBeDefined();
  });
});

describe("buildFormFields - missing/empty", () => {
  it("returns empty object for undefined fields", () => {
    const translate = createMockTranslate({});
    const result = buildFormFields({
      translate,
      fields: undefined,
      values: {},
      errors: {},
    });
    expect(result).toEqual({});
  });

  it("returns empty object for empty fields", () => {
    const translate = createMockTranslate({});
    const result = buildFormFields({
      translate,
      fields: {},
      values: {},
      errors: {},
    });
    expect(result).toEqual({});
  });
});

describe("buildErrorSummary", () => {
  it("returns null for empty errorlist", () => {
    const translate = createMockTranslate({});
    const result = buildErrorSummary({
      translate,
      errorlist: [],
      fields: {},
    });
    expect(result).toBeNull();
  });

  it("returns null for undefined errorlist", () => {
    const translate = createMockTranslate({});
    const result = buildErrorSummary({
      translate,
      errorlist: undefined,
      fields: {},
    });
    expect(result).toBeNull();
  });

  it("builds summary for a single error", () => {
    const translate = createMockTranslate({
      "fields.email.validation.required": "Enter your email",
      "govuk.errorSummaryTitle": "There is a problem",
    });
    const result = buildErrorSummary({
      translate,
      errorlist: [{ key: "email", type: "required" }],
      fields: { email: { type: "text" } },
    });

    expect(result.titleText).toBe("There is a problem");
    expect(result.errorList).toHaveLength(1);
    expect(result.errorList[0]).toEqual({
      text: "Enter your email",
      href: "#email",
    });
  });

  it("builds summary for multiple errors", () => {
    const translate = createMockTranslate({
      "fields.name.validation.required": "Enter your name",
      "fields.email.validation.required": "Enter your email",
      "govuk.errorSummaryTitle": "There is a problem",
    });
    const result = buildErrorSummary({
      translate,
      errorlist: [
        { key: "name", type: "required" },
        { key: "email", type: "required" },
      ],
      fields: { name: { type: "text" }, email: { type: "text" } },
    });

    expect(result.errorList).toHaveLength(2);
    expect(result.errorList[0].text).toBe("Enter your name");
    expect(result.errorList[1].text).toBe("Enter your email");
  });

  it("uses field key for href", () => {
    const translate = createMockTranslate({
      "fields.postcode.validation.required": "Enter postcode",
      "govuk.errorSummaryTitle": "There is a problem",
    });
    const result = buildErrorSummary({
      translate,
      errorlist: [{ key: "postcode", type: "required" }],
      fields: { postcode: { type: "text" } },
    });

    expect(result.errorList[0].href).toBe("#postcode");
  });

  it("falls back to key when no field key available", () => {
    const translate = createMockTranslate({
      "govuk.errorSummaryTitle": "There is a problem",
    });
    const result = buildErrorSummary({
      translate,
      errorlist: [{ field: "unknown", type: "required" }],
      fields: {},
    });

    expect(result.errorList[0].href).toBe("#unknown");
    expect(result.errorList[0].text).toBe("unknown");
  });
});

describe("buildPageTitle", () => {
  it("builds title without errors", () => {
    const translate = createMockTranslate({});
    const result = buildPageTitle({
      translate,
      errorlist: [],
      pageTitle: "Enter your postcode",
      serviceName: "",
    });
    expect(result).toBe("Enter your postcode - GOV.UK");
  });

  it("adds Error prefix when errors present", () => {
    const translate = createMockTranslate({
      "govuk.errorPrefix": "Error",
    });
    const result = buildPageTitle({
      translate,
      errorlist: [{ key: "x", type: "required" }],
      pageTitle: "Enter your postcode",
      serviceName: "",
    });
    expect(result).toBe("Error: Enter your postcode - GOV.UK");
  });

  it("appends service name", () => {
    const translate = createMockTranslate({});
    const result = buildPageTitle({
      translate,
      errorlist: [],
      pageTitle: "Enter your postcode",
      serviceName: "Prove your identity",
    });
    expect(result).toBe("Enter your postcode - Prove your identity - GOV.UK");
  });

  it("omits whitespace-only service name", () => {
    const translate = createMockTranslate({});
    const result = buildPageTitle({
      translate,
      errorlist: [],
      pageTitle: "Enter your postcode",
      serviceName: "   ",
    });
    expect(result).toBe("Enter your postcode - GOV.UK");
  });

  it("uses explicit serviceName value", () => {
    const translate = createMockTranslate({});
    const result = buildPageTitle({
      translate,
      errorlist: [],
      pageTitle: "Page",
      serviceName: "My Service",
    });
    expect(result).toBe("Page - My Service - GOV.UK");
  });
});

describe("formFieldsMiddleware", () => {
  it("populates formFields at render time", () => {
    const translate = createMockTranslate({
      "fields.name.label": "Full name",
    });
    const originalRender = vi.fn();
    const res = {
      locals: {
        translate,
        options: { fields: { name: { type: "text" } } },
        values: { name: "Alice" },
        errors: {},
        errorlist: [],
      },
      render: originalRender,
    };
    const next = vi.fn();
    formFieldsMiddleware({}, res, next);
    expect(next).toHaveBeenCalled();

    // Call the wrapped render (simulating wizard calling res.render)
    res.render("view", {});

    const passedOpts = originalRender.mock.calls[0][1];
    expect(passedOpts.formFields.name).toMatchObject({
      id: "name",
      value: "Alice",
      label: { text: "Full name" },
    });
  });

  it("builds errorSummary at render time", () => {
    const translate = createMockTranslate({
      "fields.email.validation.required": "Enter email",
      "govuk.errorSummaryTitle": "There is a problem",
    });
    const originalRender = vi.fn();
    const res = {
      locals: {
        translate,
        options: { fields: { email: { type: "text" } } },
        values: {},
        errors: { email: { type: "required" } },
        errorlist: [{ key: "email", type: "required" }],
      },
      render: originalRender,
    };
    const next = vi.fn();
    formFieldsMiddleware({}, res, next);

    res.render("view", {});
    const opts = originalRender.mock.calls[0][1];
    expect(opts.errorSummary).not.toBeNull();
    expect(opts.errorSummary.errorList[0].text).toBe("Enter email");
  });

  it("skips processing when no options.fields", () => {
    const originalRender = vi.fn();
    const res = {
      locals: { values: {}, errors: {} },
      render: originalRender,
    };
    const next = vi.fn();
    formFieldsMiddleware({}, res, next);

    res.render("view", { someData: true });
    const opts = originalRender.mock.calls[0][1];
    expect(opts.formFields).toBeUndefined();
    expect(opts.someData).toBe(true);
  });

  it("uses fallback translate when none available", () => {
    const originalRender = vi.fn();
    const res = {
      locals: {
        options: { fields: { x: { type: "text" } } },
        values: {},
        errors: {},
        errorlist: [],
      },
      render: originalRender,
    };
    const next = vi.fn();
    formFieldsMiddleware({}, res, next);

    res.render("view", {});
    const opts = originalRender.mock.calls[0][1];
    // Should still produce formFields using the fallback translate
    expect(opts.formFields.x).toBeDefined();
    expect(opts.formFields.x.label.text).toBe("[fields.x.label]");
  });
});
