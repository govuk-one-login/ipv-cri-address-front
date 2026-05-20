import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { createDefaultReqResNext } from "../../../../../test/utils/helpers";
const BaseController = require("hmpo-form-wizard").Controller;
const AddressSearchController = require("./search");

const testData = require("../../../../../test/data/testData");

const {
  API: {
    PATHS: { POSTCODE_LOOKUP },
  },
} = require("../../../../lib/config");

let req;
let res;
let next;
let addressSearch;
const sessionId = "session-id-123";

describe("Address Search controller", function () {
  beforeEach(() => {
    addressSearch = new AddressSearchController({ route: "/test" });
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
    expect(addressSearch).toBeInstanceOf(BaseController);
  });

  describe("saveValues", () => {
    let testPostcode;

    it("Should call api with a postcode", async () => {
      testPostcode = "myPostcode";

      req.body["addressSearch"] = testPostcode;

      await addressSearch.saveValues(req, res, next);

      const headers = {
        "session-id": sessionId,
        session_id: sessionId,
        "txma-audit-encoded": "dummy-txma-header",
        "x-forwarded-for": "127.0.0.1",
      };
      expect(req.axios.post).to.have.been.calledWith(
        `${POSTCODE_LOOKUP}`,
        {
          postcode: "myPostcode",
        },
        {
          headers,
        }
      );
    });

    describe("on api success", () => {
      let testPostcode;

      beforeEach(async () => {
        vi.fn().mockImplementation(BaseController.prototype.saveValues);

        req.axios.post = vi.fn().mockReturnValue(testData.apiResponse);

        testPostcode = "myPostcode";
        req.body["addressSearch"] = testPostcode;

        await addressSearch.saveValues(req, res, next);
      });

      afterEach(() => {
        vi.resetAllMocks();
      });

      it("should set requestIsSuccessful to be true", () => {
        expect(req.sessionModel.get("requestIsSuccessful")).toBe(true);
      });
      it("should set searchResults", () => {
        expect(req.sessionModel.get("searchResults")).to.deep.equal(
          testData.titleCasedAddresses
        );
      });
      it("should set addressPostcode", () => {
        expect(req.sessionModel.get("addressPostcode")).to.equal(testPostcode);
      });

      it("should call callback", () => {
        expect(next).to.have.been.calledOnce;
      });
    });

    describe("on api error", () => {
      beforeEach(async () => {
        req.axios.post = vi.fn().mockRejectedValue(new Error("Error!"));

        testPostcode = "myPostcode";
        req.body["addressSearch"] = testPostcode;

        await addressSearch.saveValues(req, res, next);
      });
      it("should set requestIsSuccessful to be false", () => {
        expect(req.sessionModel.get("requestIsSuccessful")).to.be.false;
      });
      it("should set searchResults", () => {
        expect(req.sessionModel.get("searchResults")).to.equal(undefined);
      });
      it("should set checkDetailsHeader", () => {
        expect(req.sessionModel.get("checkDetailsHeader")).to.equal(false);
      });
      it("should set addressPostcode", () => {
        expect(req.sessionModel.get("addressPostcode")).to.equal(testPostcode);
      });
      it("should call callback without an error", () => {
        expect(next).toHaveBeenCalled();
      });
    });
  });

  describe("titleCaseAddresses", () => {
    it("should title case addresses", () => {
      const returnedAddresses = addressSearch.titleCaseAddresses(
        testData.apiResponse.data
      );
      expect(returnedAddresses).to.deep.equal(testData.titleCasedAddresses);
    });

    it("should not title case postalCode fields", () => {
      const addresses = [
        {
          postalCode: "PoSt cOde",
        },
        {
          postalCode: "PO51 CDE",
        },
        {
          postalCode: "po51 cde",
        },
      ];
      const returnedAddresses = addressSearch.titleCaseAddresses(addresses);
      expect(returnedAddresses).to.deep.equal(addresses);
    });

    it("should not title case country field", () => {
      const addresses = [
        {
          addressCountry: "GB",
        },
      ];
      const returnedAddresses = addressSearch.titleCaseAddresses(addresses);
      expect(returnedAddresses).to.deep.equal(addresses);
    });

    it("should return empty array if addresses is empty", () => {
      const returnedAddresses = addressSearch.titleCaseAddresses([]);
      expect(returnedAddresses).to.deep.equal([]);
    });

    it("should not attempt to title case null fields", () => {
      const returnedAddresses = addressSearch.titleCaseAddresses([
        { buildingName: null },
      ]);
      expect(returnedAddresses).to.deep.equal([{ buildingName: null }]);
    });

    it("should not attempt to title case non string fields", () => {
      const returnedAddresses = addressSearch.titleCaseAddresses([
        { buildingNumber: 1, booleanField: true },
      ]);
      expect(returnedAddresses).to.deep.equal([
        { buildingNumber: 1, booleanField: true },
      ]);
    });
  });
});
