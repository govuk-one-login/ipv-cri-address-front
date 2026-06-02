import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import FormWizard from "hmpo-form-wizard";

import { NonUKAddressConfirmController } from "./nonUKConfirm.js";
import { config } from "../../../../lib/config.js";
import { createDefaultReqResNext } from "../../../../../test/utils/helpers.js";
import { addressFactory } from "../../../../../test/utils/addressFactory.js";
import { addressApiResponse } from "../../../../../test/data/testData.js";

const saveAddressPath = config.API.PATHS.SAVE_ADDRESS;
let req;
let res;
let next;
let addresses = [];
let addressConfirm;
const sessionId = "session-id-123";

describe("Non UK Address confirmation controller", () => {
  beforeEach(() => {
    const setup = createDefaultReqResNext();

    req = setup.req;
    res = setup.res;
    next = setup.next;
    req.session.tokenId = sessionId;
    req.session.authParams = {};
    req.translate = vi.fn();
    req.translate.mockReturnValue("United Kingdom");

    addresses = addressFactory(1);
    req.journeyModel.set("currentAddress", addresses[0]);
    addressConfirm = new NonUKAddressConfirmController({ route: "/test" });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should be an instance of BaseController", () => {
    expect(addressConfirm).to.be.an.instanceOf(FormWizard.Controller);
  });

  describe("locals", () => {
    it("Should format the current address in locals", async () => {
      const params = {
        currentAddressRowValue:
          "flat 1<br>1<br>street1<br>town1<br>postcode1<br>United Kingdom",
        validFromRow: new Date().getFullYear(),
        changeCurrentHref: "/enter-non-UK-address?edit=true",
      };

      addressConfirm.locals(req, res, next);
      expect(next).to.have.been.calledOnce;
      expect(next).to.have.been.calledWith(null, params);
    });

    it("Should call callback with an error when no address is found", async () => {
      req.journeyModel.set("currentAddress", null);
      addressConfirm.locals(req, res, next);

      const errMessage = "No address found";
      const callbackError = next.mock.calls[0][0];
      expect(next).toHaveBeenCalledTimes(1);
      expect(callbackError).toBeInstanceOf(Error);
      expect(callbackError.message).toBe(errMessage);
    });
  });

  describe("saveValues", () => {
    it("Should put address to address api and redirect back to callback", async () => {
      req.axios.put = vi.fn().mockResolvedValue(addressApiResponse);

      const headers = {
        "session-id": sessionId,
        session_id: sessionId,
        "txma-audit-encoded": "dummy-txma-header",
        "x-forwarded-for": "127.0.0.1",
      };

      await addressConfirm.saveValues(req, res, next);
      expect(req.axios.put).to.have.been.calledWith(
        saveAddressPath,
        addresses,
        {
          headers,
        }
      );

      expect(next).to.have.been.calledWith();
    });

    it("should return an error when no addresses are found", async () => {
      req.journeyModel.set("currentAddress", null);

      await addressConfirm.saveValues(req, res, next);

      const errMessage = "No address found";
      const callbackError = next.mock.calls[0][0];
      expect(next).toHaveBeenCalledTimes(1);
      expect(callbackError).toBeInstanceOf(Error);
      expect(callbackError.message).toBe(errMessage);
    });
  });

  it("Should handle put address throwing an error and redirect back to callback", async () => {
    req.axios.put = vi.fn().mockThrow(new Error("Some error"));

    await addressConfirm.saveValues(req, res, next);

    const errMessage = "Some error";
    const callbackError = next.mock.calls[0][0];
    expect(next).toHaveBeenCalledTimes(1);
    expect(callbackError).toBeInstanceOf(Error);
    expect(callbackError.message).toBe(errMessage);
  });
});
