import { describe, it, expect, vi } from "vitest";
import {
  createTranslateMiddleware,
  registerTranslateFilter,
} from "./nunjucks-helpers.js";

function createMockApp(locals = {}) {
  return { locals };
}

function createMockReq(translations = {}) {
  return {
    translate: (key, opts) => {
      if (key in translations) return translations[key];
      return undefined;
    },
  };
}

function createMockRes(locals = {}) {
  return { locals: { ...locals } };
}

describe("createTranslateMiddleware", () => {
  it("sets translate and t on res.locals", () => {
    const app = createMockApp();
    const middleware = createTranslateMiddleware(app, {});
    const req = createMockReq({});
    const res = createMockRes();
    const next = vi.fn();

    middleware(req, res, next);

    expect(typeof res.locals.translate).toBe("function");
    expect(typeof res.locals.t).toBe("function");
    expect(res.locals.translate).toBe(res.locals.t);
    expect(next).toHaveBeenCalled();
  });

  it("translates a simple key", () => {
    const app = createMockApp();
    const middleware = createTranslateMiddleware(app, {});
    const req = createMockReq({ "pages.title": "My Page" });
    const res = createMockRes();
    const next = vi.fn();

    middleware(req, res, next);

    expect(res.locals.translate("pages.title")).toBe("My Page");
  });

  it("renders Nunjucks expressions in translation results", () => {
    const app = createMockApp();
    const middleware = createTranslateMiddleware(app, {});
    const req = createMockReq({
      greeting: "Hello {{userName}}",
    });
    const res = createMockRes({ userName: "Alice" });
    const next = vi.fn();

    middleware(req, res, next);

    expect(res.locals.translate("greeting")).toBe("Hello Alice");
  });

  it("handles array values by rendering each item", () => {
    const app = createMockApp();
    const middleware = createTranslateMiddleware(app, {});
    const req = createMockReq({
      items: ["Item {{num}}", "Plain text"],
    });
    const res = createMockRes({ num: "1" });
    const next = vi.fn();

    middleware(req, res, next);

    const result = res.locals.translate("items");
    expect(result).toEqual(["Item 1", "Plain text"]);
  });

  it("handles null translation result", () => {
    const app = createMockApp();
    const middleware = createTranslateMiddleware(app, {});
    const req = createMockReq({});
    const res = createMockRes();
    const next = vi.fn();

    middleware(req, res, next);

    expect(res.locals.translate("missing.key")).toBeUndefined();
  });

  it("respects noRender option", () => {
    const app = createMockApp();
    const middleware = createTranslateMiddleware(app, {}, { noRender: true });
    const req = createMockReq({
      key: "Hello {{name}}",
    });
    const res = createMockRes({ name: "Bob" });
    const next = vi.fn();

    middleware(req, res, next);

    // Should not render the Nunjucks expression
    expect(res.locals.translate("key")).toBe("Hello {{name}}");
  });

  it("uses custom context from res.locals for rendering", () => {
    const app = createMockApp();
    const middleware = createTranslateMiddleware(app, {});
    const req = createMockReq({
      msg: "Value is {{values.postcode}}",
    });
    const res = createMockRes({ values: { postcode: "SW1A 2AA" } });
    const next = vi.fn();

    middleware(req, res, next);

    expect(res.locals.translate("msg")).toBe("Value is SW1A 2AA");
  });

  it("copies app.locals to res.locals", () => {
    const app = createMockApp({ appSetting: "value123", shared: "from-app" });
    const middleware = createTranslateMiddleware(app, {});
    const req = createMockReq({});
    const res = createMockRes({ existing: "keep" });
    const next = vi.fn();

    middleware(req, res, next);

    expect(res.locals.appSetting).toBe("value123");
    expect(res.locals.shared).toBe("from-app");
    expect(res.locals.existing).toBe("keep");
  });

  it("sets ctx as dotted-path accessor", () => {
    const app = createMockApp();
    const middleware = createTranslateMiddleware(app, {});
    const req = createMockReq({});
    const res = createMockRes({
      options: { fields: { name: { type: "text" } } },
    });
    const next = vi.fn();

    middleware(req, res, next);

    expect(typeof res.locals.ctx).toBe("function");
    expect(res.locals.ctx("options.fields.name.type")).toBe("text");
    expect(res.locals.ctx("options.missing.path")).toBeUndefined();
  });

  it("returns key when req.translate is missing", () => {
    const app = createMockApp();
    const middleware = createTranslateMiddleware(app, {});
    const req = {}; // No translate function
    const res = createMockRes();
    const next = vi.fn();

    middleware(req, res, next);

    expect(res.locals.translate("any.key")).toBe("any.key");
  });
});

describe("registerTranslateFilter", () => {
  it("registers translate filter on the environment", () => {
    const env = { addFilter: vi.fn() };
    registerTranslateFilter(env);

    expect(env.addFilter).toHaveBeenCalledWith(
      "translate",
      expect.any(Function)
    );
  });

  it("returns key when no translate function on ctx", () => {
    const env = { addFilter: vi.fn() };
    registerTranslateFilter(env);

    // Get the filter function that was registered
    const filterFn = env.addFilter.mock.calls[0][1];

    // Call with a mock `this` context that has no translate
    const result = filterFn.call({ ctx: {} }, "some.key");
    expect(result).toBe("some.key");
  });
});
