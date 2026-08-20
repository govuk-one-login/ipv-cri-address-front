import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  buildFormFields,
  buildErrorSummary,
  buildPageTitle,
  formFieldsMiddleware,
  resolveErrorMessage,
} from "./form-fields.js";

/**
 * Creates a mock translate function that returns translations from a map,
 * or returns `[key]` for unknown keys (mimicking hmpo-i18n behaviour).
 */
function createMockTranslate(translations = {}) {
  return (key, options = {}) => {
    // Handle array keys (try first that matches)
    if (Array.isArray(key)) {
      for (const k of key) {
        if (translations[k]) {
          let result = translations[k];
          if (options.context && typeof result === "string") {
            result = result.replace(
              /\{\{(\w+)\}\}/g,
              (_, name) => options.context[name] ?? ""
            );
          }
          return result;
        }
      }
      return options.self === false ? undefined : `[${key[0]}]`;
    }

    const result = translations[key];
    if (result !== undefined) {
      let text = result;
      if (options.context && typeof text === "string") {
        text = text.replace(
          /\{\{(\w+)\}\}/g,
          (_, name) => options.context[name] ?? ""
        );
      }
      return text;
    }
    return options.self === false ? undefined : `[${key}]`;
  };
}

describe("resolveErrorMessage", () => {
  it("returns error.message if already set", () => {
    const translate = createMockTranslate({});
    const result = resolveErrorMessage(translate, "myField", {
      type: "required",
      message: "Pre-set message",
    });
    expect(result).toBe("Pre-set message");
  });

  it("resolves field-specific error message first", () => {
    const translate = createMockTranslate({
      "fields.addressSearch.validation.required": "Enter your postcode",
      "validation.required": "Enter your {{label}}",
      "fields.addressSearch.label": "Postcode",
    });

    const result = resolveErrorMessage(translate, "addressSearch", {
      type: "required",
    });
    expect(result).toBe("Enter your postcode");
  });

  it("falls back to generic validation message with interpolation", () => {
    const translate = createMockTranslate({
      "validation.required": "Enter your {{label}}",
      "fields.myField.label": "Email address",
    });

    const result = resolveErrorMessage(translate, "myField", {
      type: "required",
    });
    expect(result).toBe("Enter your email address");
  });

  it("falls back to field default validation", () => {
    const translate = createMockTranslate({
      "fields.addressYearFrom.validation.default":
        "Enter the year using only 4 digits",
      "fields.addressYearFrom.label": "Year",
    });

    const result = resolveErrorMessage(translate, "addressYearFrom", {
      type: "date-year",
    });
    expect(result).toBe("Enter the year using only 4 digits");
  });

  it("falls back to validation.default as last resort", () => {
    const translate = createMockTranslate({
      "validation.default": "You must answer this question",
      "fields.unknownField.label": "Unknown",
    });

    const result = resolveErrorMessage(translate, "unknownField", {
      type: "obscureValidator",
    });
    expect(result).toBe("You must answer this question");
  });
});

describe("buildFormFields", () => {
  let translations;
  let translate;

  beforeEach(() => {
    translations = {
      "fields.addressSearch.label": "Enter your postcode",
      "fields.addressSearch.hint":
        "Enter the postcode of your current home address.",
      "fields.addressSearch.validation.required": "Enter your postcode",
      "fields.addressResults.label":
        "Choose your current home address from the list",
      "fields.addressResults.validation.required":
        "Choose an address from the list",
      "fields.hasPreviousUKAddressWithinThreeMonths.label":
        "Have you lived at another UK address in the past 3 months?",
      "fields.hasPreviousUKAddressWithinThreeMonths.hint":
        "We may need to ask for your previous address.",
      "fields.hasPreviousUKAddressWithinThreeMonths.items.yes.label": "Yes",
      "fields.hasPreviousUKAddressWithinThreeMonths.items.no.label": "No",
      "fields.hasPreviousUKAddressWithinThreeMonths.validation.confirmationValidation":
        "Select yes if you've lived at another UK address in the past three months.",
      "govuk.error": "Error",
      "validation.required": "Enter your {{label}}",
      "validation.default": "You must answer this question",
    };
    translate = createMockTranslate(translations);
  });

  describe("text fields", () => {
    it("builds govukInput params for a text field", () => {
      const result = buildFormFields({
        translate,
        fields: {
          addressSearch: {
            type: "text",
            autocomplete: "postal-code",
            validate: [{ type: "required" }],
          },
        },
        values: { addressSearch: "SW1A 2AA" },
        errors: {},
      });

      expect(result.addressSearch).toEqual({
        id: "addressSearch",
        name: "addressSearch",
        value: "SW1A 2AA",
        label: { text: "Enter your postcode" },
        hint: { text: "Enter the postcode of your current home address." },
        classes: "govuk-!-width-one-half",
        errorMessage: undefined,
        autocomplete: "postal-code",
      });
    });

    it("builds govukInput params with error", () => {
      const result = buildFormFields({
        translate,
        fields: {
          addressSearch: {
            type: "text",
            validate: [{ type: "required" }],
          },
        },
        values: { addressSearch: "" },
        errors: { addressSearch: { type: "required", key: "addressSearch" } },
      });

      expect(result.addressSearch.errorMessage).toEqual({
        text: "Enter your postcode",
        visuallyHiddenText: "Error",
      });
    });

    it("handles empty/null values", () => {
      const result = buildFormFields({
        translate,
        fields: {
          addressSearch: { type: "text" },
        },
        values: {},
        errors: {},
      });

      expect(result.addressSearch.value).toBe("");
    });
  });

  describe("number fields", () => {
    it("builds govukInput params with numeric inputmode", () => {
      const result = buildFormFields({
        translate: createMockTranslate({
          "fields.addressYearFrom.label": "Enter the year",
        }),
        fields: {
          addressYearFrom: { type: "number" },
        },
        values: { addressYearFrom: "2021" },
        errors: {},
      });

      expect(result.addressYearFrom.inputmode).toBe("numeric");
      expect(result.addressYearFrom.classes).toBe("govuk-input--width-4");
      expect(result.addressYearFrom.spellcheck).toBe(false);
    });
  });

  describe("select/list fields", () => {
    it("builds govukSelect params for a list field", () => {
      const result = buildFormFields({
        translate,
        fields: {
          addressResults: {
            type: "list",
            validate: [{ type: "required" }],
          },
        },
        values: { addressResults: "10 Downing Street" },
        errors: {},
      });

      expect(result.addressResults).toEqual({
        id: "addressResults",
        name: "addressResults",
        value: "10 Downing Street",
        label: {
          text: "Choose your current home address from the list",
        },
        errorMessage: undefined,
      });
    });

    it("builds govukSelect with items from field config", () => {
      const result = buildFormFields({
        translate: createMockTranslate({
          "fields.country.label": "Country",
          "fields.country.items.GB.label": "United Kingdom",
          "fields.country.items.FR.label": "France",
        }),
        fields: {
          country: {
            type: "select",
            items: ["GB", "FR"],
          },
        },
        values: { country: "GB" },
        errors: {},
      });

      expect(result.country.items).toEqual([
        { value: "GB", text: "United Kingdom" },
        { value: "FR", text: "France" },
      ]);
    });

    it("passes through pre-built item objects", () => {
      const items = [
        { text: "3 addresses found", value: "" },
        { text: "10 Downing Street, London", value: "10 Downing Street" },
      ];

      const result = buildFormFields({
        translate,
        fields: {
          addressResults: { type: "list", items },
        },
        values: {},
        errors: {},
      });

      expect(result.addressResults.items).toEqual(items);
    });

    it("builds govukSelect with error", () => {
      const result = buildFormFields({
        translate,
        fields: {
          addressResults: { type: "list" },
        },
        values: {},
        errors: {
          addressResults: { type: "required", key: "addressResults" },
        },
      });

      expect(result.addressResults.errorMessage).toEqual({
        text: "Choose an address from the list",
        visuallyHiddenText: "Error",
      });
    });
  });

  describe("radios fields", () => {
    it("builds govukRadios params", () => {
      const result = buildFormFields({
        translate,
        fields: {
          hasPreviousUKAddressWithinThreeMonths: {
            type: "radios",
            items: ["yes", "no"],
          },
        },
        values: { hasPreviousUKAddressWithinThreeMonths: "yes" },
        errors: {},
      });

      const radios = result.hasPreviousUKAddressWithinThreeMonths;
      expect(radios.idPrefix).toBe("hasPreviousUKAddressWithinThreeMonths");
      expect(radios.name).toBe("hasPreviousUKAddressWithinThreeMonths");
      expect(radios.value).toBe("yes");
      expect(radios.fieldset.legend.text).toBe(
        "Have you lived at another UK address in the past 3 months?"
      );
      expect(radios.hint.text).toBe(
        "We may need to ask for your previous address."
      );
      expect(radios.items).toEqual([
        { value: "yes", text: "Yes" },
        { value: "no", text: "No" },
      ]);
    });

    it("builds govukRadios with error", () => {
      const result = buildFormFields({
        translate,
        fields: {
          hasPreviousUKAddressWithinThreeMonths: {
            type: "radios",
            items: ["yes", "no"],
          },
        },
        values: {},
        errors: {
          hasPreviousUKAddressWithinThreeMonths: {
            type: "confirmationValidation",
            key: "hasPreviousUKAddressWithinThreeMonths",
          },
        },
      });

      expect(
        result.hasPreviousUKAddressWithinThreeMonths.errorMessage
      ).toEqual({
        text: "Select yes if you've lived at another UK address in the past three months.",
        visuallyHiddenText: "Error",
      });
    });

    it("applies inline class", () => {
      const result = buildFormFields({
        translate,
        fields: {
          hasPreviousUKAddressWithinThreeMonths: {
            type: "radios",
            items: ["yes", "no"],
            inline: true,
          },
        },
        values: {},
        errors: {},
      });

      expect(result.hasPreviousUKAddressWithinThreeMonths.classes).toBe(
        "govuk-radios--inline"
      );
    });
  });

  describe("journeyKey fields (meta fields)", () => {
    it("skips fields with journeyKey but no type", () => {
      const result = buildFormFields({
        translate,
        fields: {
          currentAddress: { journeyKey: "currentAddress", default: "" },
          addressSearch: { type: "text" },
        },
        values: {},
        errors: {},
      });

      expect(result.currentAddress).toBeUndefined();
      expect(result.addressSearch).toBeDefined();
    });
  });

  describe("missing fields", () => {
    it("returns empty object when fields is undefined", () => {
      const result = buildFormFields({
        translate,
        fields: undefined,
        values: {},
        errors: {},
      });

      expect(result).toEqual({});
    });

    it("returns empty object when fields is empty", () => {
      const result = buildFormFields({
        translate,
        fields: {},
        values: {},
        errors: {},
      });

      expect(result).toEqual({});
    });
  });
});

describe("buildErrorSummary", () => {
  const translate = createMockTranslate({
    "govuk.errorSummaryTitle": "There is a problem",
    "govuk.error": "Error",
    "fields.addressSearch.label": "Postcode",
    "fields.addressSearch.validation.required": "Enter your postcode",
    "fields.addressResults.label": "Address",
    "fields.addressResults.validation.required":
      "Choose an address from the list",
    "validation.required": "Enter your {{label}}",
    "validation.default": "You must answer this question",
  });

  it("returns null when errorlist is empty", () => {
    const result = buildErrorSummary({
      translate,
      errorlist: [],
      fields: {},
    });
    expect(result).toBeNull();
  });

  it("returns null when errorlist is undefined", () => {
    const result = buildErrorSummary({
      translate,
      errorlist: undefined,
      fields: {},
    });
    expect(result).toBeNull();
  });

  it("builds error summary with single error", () => {
    const result = buildErrorSummary({
      translate,
      errorlist: [
        { type: "required", key: "addressSearch", field: "addressSearch" },
      ],
      fields: { addressSearch: { type: "text" } },
    });

    expect(result).toEqual({
      titleText: "There is a problem",
      errorList: [{ href: "#addressSearch", text: "Enter your postcode" }],
    });
  });

  it("builds error summary with multiple errors", () => {
    const result = buildErrorSummary({
      translate,
      errorlist: [
        { type: "required", key: "addressSearch", field: "addressSearch" },
        { type: "required", key: "addressResults", field: "addressResults" },
      ],
      fields: {
        addressSearch: { type: "text" },
        addressResults: { type: "list" },
      },
    });

    expect(result.errorList).toHaveLength(2);
    expect(result.errorList[0]).toEqual({
      href: "#addressSearch",
      text: "Enter your postcode",
    });
    expect(result.errorList[1]).toEqual({
      href: "#addressResults",
      text: "Choose an address from the list",
    });
  });

  it("uses error.field for href when available", () => {
    const result = buildErrorSummary({
      translate,
      errorlist: [
        { type: "required", key: "addressSearch", field: "addressSearch" },
      ],
      fields: { addressSearch: { type: "text" } },
    });

    expect(result.errorList[0].href).toBe("#addressSearch");
  });

  it("falls back to error.key for href when field is not set", () => {
    const result = buildErrorSummary({
      translate,
      errorlist: [{ type: "required", key: "addressSearch" }],
      fields: { addressSearch: { type: "text" } },
    });

    expect(result.errorList[0].href).toBe("#addressSearch");
  });
});

describe("buildPageTitle", () => {
  const translate = createMockTranslate({
    "govuk.error": "Error",
    "govuk.serviceName": " ",
  });

  it("builds page title without error prefix when no errors", () => {
    const result = buildPageTitle({
      translate,
      errorlist: [],
      pageTitle: "Find your address",
    });

    expect(result).toBe("Find your address – GOV.UK One Login");
  });

  it("builds page title with error prefix when errors present", () => {
    const result = buildPageTitle({
      translate,
      errorlist: [{ type: "required", key: "field1" }],
      pageTitle: "Find your address",
    });

    expect(result).toBe("Error: Find your address – GOV.UK One Login");
  });

  it("includes service name when not blank", () => {
    const translateWithService = createMockTranslate({
      "govuk.error": "Error",
      "govuk.serviceName": "Prove your identity",
    });

    const result = buildPageTitle({
      translate: translateWithService,
      errorlist: [],
      pageTitle: "Find your address",
    });

    expect(result).toBe(
      "Find your address – Prove your identity – GOV.UK One Login"
    );
  });

  it("omits service name when it is whitespace-only", () => {
    const result = buildPageTitle({
      translate,
      errorlist: [],
      pageTitle: "Find your address",
    });

    // govuk.serviceName is " " (single space) - should be omitted
    expect(result).toBe("Find your address – GOV.UK One Login");
  });

  it("uses explicit serviceName param when provided", () => {
    const result = buildPageTitle({
      translate,
      errorlist: [],
      pageTitle: "Find your address",
      serviceName: "My Service",
    });

    expect(result).toBe("Find your address – My Service – GOV.UK One Login");
  });
});

describe("formFieldsMiddleware", () => {
  it("populates res.locals.formFields and errorSummary when render is called", () => {
    const translate = createMockTranslate({
      "fields.addressSearch.label": "Enter your postcode",
      "fields.addressSearch.hint": "UK postcode",
      "fields.addressSearch.validation.required": "Enter your postcode",
      "govuk.errorSummaryTitle": "There is a problem",
      "govuk.error": "Error",
    });

    const req = { translate };
    const originalRender = vi.fn();
    const res = {
      render: originalRender,
      locals: {},
    };
    const next = vi.fn();

    formFieldsMiddleware(req, res, next);
    expect(next).toHaveBeenCalledOnce();

    // Simulate wizard populating locals before render
    res.locals.translate = translate;
    res.locals.options = {
      fields: {
        addressSearch: { type: "text", autocomplete: "postal-code" },
      },
    };
    res.locals.values = { addressSearch: "SW1A 2AA" };
    res.locals.errors = {};
    res.locals.errorlist = [];
    res.locals["csrf-token"] = "token123";

    // Call res.render (as the wizard would)
    res.render("address/search");

    expect(res.locals.formFields).toBeDefined();
    expect(res.locals.formFields.addressSearch.id).toBe("addressSearch");
    expect(res.locals.formFields.addressSearch.value).toBe("SW1A 2AA");
    expect(res.locals.errorSummary).toBeNull();
    expect(res.locals.csrfToken).toBe("token123");
    expect(originalRender).toHaveBeenCalled();
    expect(originalRender.mock.calls[0][0]).toBe("address/search");
  });

  it("builds errorSummary when errors are present at render time", () => {
    const translate = createMockTranslate({
      "fields.addressSearch.label": "Enter your postcode",
      "fields.addressSearch.validation.required": "Enter your postcode",
      "govuk.errorSummaryTitle": "There is a problem",
      "govuk.error": "Error",
    });

    const req = { translate };
    const originalRender = vi.fn();
    const res = {
      render: originalRender,
      locals: {},
    };
    const next = vi.fn();

    formFieldsMiddleware(req, res, next);

    // Simulate wizard state with errors
    res.locals.translate = translate;
    res.locals.options = {
      fields: { addressSearch: { type: "text" } },
    };
    res.locals.values = {};
    res.locals.errors = {
      addressSearch: { type: "required", key: "addressSearch" },
    };
    res.locals.errorlist = [
      { type: "required", key: "addressSearch", field: "addressSearch" },
    ];
    res.locals["csrf-token"] = "token456";

    res.render("address/search");

    expect(res.locals.errorSummary).toEqual({
      titleText: "There is a problem",
      errorList: [{ href: "#addressSearch", text: "Enter your postcode" }],
    });
  });

  it("skips building when options.fields is not present at render time", () => {
    const req = {};
    const originalRender = vi.fn();
    const res = {
      render: originalRender,
      locals: {},
    };
    const next = vi.fn();

    formFieldsMiddleware(req, res, next);

    // Render without wizard state
    res.render("some-page");

    expect(res.locals.formFields).toBeUndefined();
    expect(originalRender).toHaveBeenCalled();
    expect(originalRender.mock.calls[0][0]).toBe("some-page");
  });

  it("uses req.translate as fallback when res.locals.translate is unavailable", () => {
    const translate = createMockTranslate({
      "fields.testField.label": "Test label",
    });

    const req = { translate };
    const originalRender = vi.fn();
    const res = {
      render: originalRender,
      locals: {},
    };
    const next = vi.fn();

    formFieldsMiddleware(req, res, next);

    res.locals.options = { fields: { testField: { type: "text" } } };
    res.locals.values = {};
    res.locals.errors = {};
    res.locals.errorlist = [];

    res.render("test-page");

    expect(res.locals.formFields.testField.label.text).toBe("Test label");
  });
});
