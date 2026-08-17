import { describe, it, expect, vi, beforeEach } from "vitest";
import nunjucks from "nunjucks";
import {
  createTranslateMiddleware,
  registerTranslateFilter,
} from "./nunjucks-helpers.js";

describe("createTranslateMiddleware", () => {
  let app;
  let env;
  let middleware;

  beforeEach(() => {
    app = { locals: { baseUrl: "/", assetPath: "/public" } };
    env = nunjucks.configure([], { autoescape: false });
    middleware = createTranslateMiddleware(app, env, { noCache: true });
  });

  it("sets res.locals.translate and res.locals.t", () => {
    const req = { translate: (key) => `translated:${key}` };
    const res = { locals: {} };
    const next = vi.fn();

    middleware(req, res, next);

    expect(res.locals.translate).toBeTypeOf("function");
    expect(res.locals.t).toBe(res.locals.translate);
    expect(next).toHaveBeenCalledOnce();
  });

  it("translates a simple key without Nunjucks expressions", () => {
    const req = { translate: (key) => "Enter your postcode" };
    const res = { locals: {} };
    const next = vi.fn();

    middleware(req, res, next);

    expect(res.locals.translate("fields.addressSearch.label")).toBe(
      "Enter your postcode"
    );
  });

  it("renders Nunjucks expressions in translation values", () => {
    const req = {
      translate: (key) => {
        if (key === "links.changePostcode")
          return "<b>{{values.addressPostcode}}</b>";
        return key;
      },
    };
    const res = { locals: {} };
    const next = vi.fn();

    middleware(req, res, next);

    // Set values on locals (as wizard would)
    res.locals.values = { addressPostcode: "SW1A 2AA" };

    const result = res.locals.translate("links.changePostcode");
    expect(result).toBe("<b>SW1A 2AA</b>");
  });

  it("handles array translation values (renders each item)", () => {
    const req = {
      translate: (key) => {
        if (key === "links.cantFindAddress")
          return ["<p>First paragraph</p>", "<p>Second: {{values.foo}}</p>"];
        return key;
      },
    };
    const res = { locals: {} };
    const next = vi.fn();

    middleware(req, res, next);

    res.locals.values = { foo: "bar" };

    const result = res.locals.translate("links.cantFindAddress");
    expect(result).toEqual([
      "<p>First paragraph</p>",
      "<p>Second: bar</p>",
    ]);
  });

  it("returns undefined for null/undefined/false translations", () => {
    const req = {
      translate: () => null,
    };
    const res = { locals: {} };
    const next = vi.fn();

    middleware(req, res, next);

    expect(res.locals.translate("missing.key")).toBeUndefined();
  });

  it("skips rendering when noRender option is set", () => {
    const req = {
      translate: () => "Value with {{nunjucks}}",
    };
    const res = { locals: {} };
    const next = vi.fn();

    middleware(req, res, next);

    const result = res.locals.translate("key", { noRender: true });
    expect(result).toBe("Value with {{nunjucks}}");
  });

  it("uses custom context when provided", () => {
    const req = {
      translate: () => "Hello {{name}}",
    };
    const res = { locals: {} };
    const next = vi.fn();

    middleware(req, res, next);

    const result = res.locals.translate("key", {
      context: { name: "World" },
    });
    expect(result).toBe("Hello World");
  });

  it("copies app.locals to res.locals", () => {
    const req = { translate: (key) => key };
    const res = { locals: {} };
    const next = vi.fn();

    middleware(req, res, next);

    expect(res.locals.baseUrl).toBe("/");
    expect(res.locals.assetPath).toBe("/public");
  });

  it("sets res.locals.ctx as a dotted-path accessor", () => {
    const req = { translate: (key) => key };
    const res = { locals: {} };
    const next = vi.fn();

    middleware(req, res, next);

    res.locals.values = { addressSearch: "SW1A" };
    res.locals.nested = { deep: { value: 42 } };

    expect(res.locals.ctx("values.addressSearch")).toBe("SW1A");
    expect(res.locals.ctx("nested.deep.value")).toBe(42);
    expect(res.locals.ctx("nonexistent.path")).toBeUndefined();
    expect(res.locals.ctx()).toBe(res.locals);
  });

  it("handles req.translate being undefined gracefully", () => {
    const req = {};
    const res = { locals: {} };
    const next = vi.fn();

    middleware(req, res, next);

    // When req.translate is missing, returns the key itself
    expect(res.locals.translate("my.key")).toBe("my.key");
  });
});

describe("registerTranslateFilter", () => {
  it("registers a translate filter on the nunjucks environment", () => {
    const env = nunjucks.configure([], { autoescape: false });
    registerTranslateFilter(env);

    // Render a template that uses the translate filter
    // The filter accesses this.ctx.translate, which is set on the template context
    const template = new nunjucks.Template(
      '{{ "my.key" | translate }}',
      env
    );
    const result = template.render({
      translate: (key) => `Translated: ${key}`,
    });

    expect(result).toBe("Translated: my.key");
  });

  it("returns the key unchanged when translate is not on context", () => {
    const env = nunjucks.configure([], { autoescape: false });
    registerTranslateFilter(env);

    const template = new nunjucks.Template(
      '{{ "my.key" | translate }}',
      env
    );
    const result = template.render({});

    expect(result).toBe("my.key");
  });
});
