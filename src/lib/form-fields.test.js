import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  buildFormFields,
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

describe("formFieldsMiddleware", () => {
  it("populates res.locals.formFields from wizard state", () => {
    const translate = createMockTranslate({
      "fields.addressSearch.label": "Enter your postcode",
      "fields.addressSearch.hint": "UK postcode",
    });

    const req = { translate };
    const res = {
      locals: {
        translate,
        options: {
          fields: {
            addressSearch: { type: "text", autocomplete: "postal-code" },
          },
        },
        values: { addressSearch: "SW1A 2AA" },
        errors: {},
        "csrf-token": "token123",
      },
    };
    const next = vi.fn();

    formFieldsMiddleware(req, res, next);

    expect(res.locals.formFields).toBeDefined();
    expect(res.locals.formFields.addressSearch.id).toBe("addressSearch");
    expect(res.locals.formFields.addressSearch.value).toBe("SW1A 2AA");
    expect(res.locals.csrfToken).toBe("token123");
    expect(next).toHaveBeenCalledOnce();
  });

  it("skips building when options.fields is not present", () => {
    const req = {};
    const res = { locals: {} };
    const next = vi.fn();

    formFieldsMiddleware(req, res, next);

    expect(res.locals.formFields).toBeUndefined();
    expect(next).toHaveBeenCalledOnce();
  });

  it("uses req.translate as fallback when res.locals.translate is unavailable", () => {
    const translate = createMockTranslate({
      "fields.testField.label": "Test label",
    });

    const req = { translate };
    const res = {
      locals: {
        options: { fields: { testField: { type: "text" } } },
        values: {},
        errors: {},
      },
    };
    const next = vi.fn();

    formFieldsMiddleware(req, res, next);

    expect(res.locals.formFields.testField.label.text).toBe("Test label");
  });
});
