import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import FormWizard from "hmpo-form-wizard";

import { createDefaultReqResNext } from "../../../../../test/utils/helpers.js";
import { AddressPrepopulateController } from "./prepopulate.js";
import { config } from "../../../../lib/config.js";

const getAddressesPath = config.API.PATHS.GET_ADDRESSES;

let req;
let res;
let next;
const sessionId = "session-id-123";

describe("Prepopulate controller", () => {
  let addressPrepopulateController;

  beforeEach(() => {
    addressPrepopulateController = new AddressPrepopulateController({
      route: "/test",
    });
    const setup = createDefaultReqResNext();

    req = setup.req;
    res = setup.res;
    next = setup.next;
    req.session.tokenId = sessionId;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should be an instance of BaseController", () => {
    expect(addressPrepopulateController).to.be.an.instanceOf(
      FormWizard.Controller
    );
  });

  describe("#saveValues", () => {
    it("should retrieve addresses", async () => {
      await addressPrepopulateController.saveValues(req, res, next);

      expect(req.customFetch).to.have.been.calledWith(getAddressesPath, {
        method: "GET",
        headers: {
          session_id: sessionId,
        },
      });
    });

    it("should not retrieve addresses if there is no session", async () => {
      await addressPrepopulateController.saveValues(
        { ...req, session: {} },
        res,
        next
      );

      expect(req.customFetch).to.have.callCount(0);
    });

    describe("on success", () => {
      beforeEach(() => {
        vi.spyOn(
          FormWizard.Controller.prototype,
          "saveValues"
        ).mockImplementation(() => {
          FormWizard.Controller.prototype.saveValues();
        });
      });

      afterEach(() => {
        vi.resetAllMocks();
      });

      describe("with empty addresses", () => {
        beforeEach(async () => {
          req.customFetch = vi
            .fn()
            .mockResolvedValue(new Response(JSON.stringify([])));

          await addressPrepopulateController.saveValues(req, res, next);
        });

        it("should set not addressPostcode", () => {
          expect(req.sessionModel.get("addressSearch")).to.be.undefined;
        });

        it("should set prepopulatedPostcode to be false", () => {
          expect(req.session.prepopulatedPostcode).to.be.false;
        });

        it("should call callback", async () => {
          expect(next).to.have.been.calledOnce;
        });
      });
    });

    describe("with addresses", () => {
      beforeEach(async () => {
        req.customFetch = vi
          .fn()
          .mockResolvedValue(
            new Response(
              JSON.stringify({ addresses: [{ postalCode: "Q1 1AB" }] })
            )
          );

        await addressPrepopulateController.saveValues(req, res, next);
      });

      it("should set prepopulatedPostcode to be true", () => {
        expect(req.session.prepopulatedPostcode).to.be.true;
        expect(req.sessionModel.get("context")).to.be.undefined;
      });

      it("should set addressPostcode using first postcode in results", () => {
        expect(req.sessionModel.get("addressSearch")).to.equal("Q1 1AB");
      });

      it("should call callback", async () => {
        expect(next).to.have.been.calledOnce;
      });
    });

    describe("with context", () => {
      beforeEach(async () => {
        req.customFetch = vi.fn().mockResolvedValue(
          new Response(
            JSON.stringify({
              addresses: [{ postalCode: "Q1 1AB" }],
              context: "international_user",
            })
          )
        );

        await addressPrepopulateController.saveValues(req, res, next);
      });

      it("should set context", () => {
        expect(req.sessionModel.get("context")).to.equal("international_user");
      });

      it("should call callback", async () => {
        expect(next).to.have.been.calledOnce;
      });
    });

    describe("on error", () => {
      beforeEach(async () => {
        req.customFetch = vi.fn().mockRejectedValue(new Error("Error"));

        await addressPrepopulateController.saveValues(req, res, next);
      });

      it("should call callback", () => {
        expect(next).to.have.been.calledOnce;
      });
    });
  });
});
