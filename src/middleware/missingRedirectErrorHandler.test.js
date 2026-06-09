import { describe, it, beforeEach, expect } from "vitest";
import { createDefaultReqResNext } from "../../test/utils/helpers.js";
import { missingRedirectErrorHandler } from "./missingRedirectErrorHandler.js";

describe("Missing Redirect Error Handler Middleware", () => {
  let err, req, res, next;

  beforeEach(() => {
    const setup = createDefaultReqResNext();
    err = setup.err;
    req = setup.req;
    res = setup.res;
    next = setup.next;
  });

  it("exports a function with length 4 - express identifies error handling middleware by its arguments length", async () => {
    expect(missingRedirectErrorHandler).toBeInstanceOf(Function);
    expect(missingRedirectErrorHandler.length).toEqual(4);
  });

  it("should return 400 and render error page if error has the message Missing redirect_uri", async () => {
    err.message = "Missing redirect_uri";
    await missingRedirectErrorHandler(err, req, res, next);
    expect(res.status).to.have.been.calledWith(400);
    expect(res.render).to.have.been.calledWith("errors/error");
  });

  it("should call next if the error does not have the message Missing redirect_uri", async () => {
    await missingRedirectErrorHandler(err, req, res, next);
    expect(next).to.have.been.calledWith(err);
  });

  it("should call next if the error has a different message to Missing redirect_uri", async () => {
    err.message = "I'm a different type of error";
    await missingRedirectErrorHandler(err, req, res, next);
    expect(next).to.have.been.calledWith(err);
  });
});
