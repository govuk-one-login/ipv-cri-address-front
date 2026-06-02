import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
const BaseController = require("hmpo-form-wizard").Controller;
const WhatCountryController = require("./whatCountry");

const address = new WhatCountryController({ route: "/test" });

describe("whatCountryController", () => {
  let req,
    res = null;

  beforeEach(() => {
    req = {
      sessionModel: {
        get: vi.fn(),
        set: vi.fn(),
      },
    };
  });

  afterEach(() => vi.resetAllMocks());

  it("should set country to empty string", () => {
    BaseController.prototype.getValues = vi
      .fn()
      .mockImplementation((_, __, callback) => {
        callback(null, {});
      });

    req.sessionModel.set("country", "test");
    address.getValues(req, res, (err, values) => {
      expect(values.country).toBe("");
    });
  });

  it("should call callback with error if there is one present", () => {
    BaseController.prototype.getValues = vi
      .fn()
      .mockImplementation((_, __, callback) => {
        callback(error, {});
      });
    const error = new Error("dummy-error");

    req.sessionModel.set("country", "test");

    address.getValues(req, res, (err, values) => {
      expect(err).toEqual(error);
      expect(values.country).toBe("");
    });
  });

  it("should call callback without error if there is none present", () => {
    BaseController.prototype.getValues = vi
      .fn()
      .mockImplementation((_, __, callback) => {
        callback(null, {});
      });
    req.sessionModel.set("country", "test");

    address.getValues(req, res, (err, values) => {
      expect(err).to.equal(null);
      expect(values.country).to.be.eq("");
    });
  });
});
