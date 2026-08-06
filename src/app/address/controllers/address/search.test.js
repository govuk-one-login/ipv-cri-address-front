import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import FormWizard from "hmpo-form-wizard";

import { createDefaultReqResNext } from "../../../../../test/utils/helpers.js";
import { AddressSearchController } from "./search.js";
import {
  apiResponse,
  titleCasedAddresses,
} from "../../../../../test/data/testData.js";
import { config } from "../../../../lib/config.js";

const { mockLogger } = vi.hoisted(() => ({
  mockLogger: {
    warn: vi.fn(),
    debug: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@govuk-one-login/di-ipv-cri-common-express", () => ({
  default: {
    bootstrap: {
      logger: {
        get: vi.fn(() => mockLogger),
      },
    },
  },
}));

const postcodeLookupPath = config.API.PATHS.POSTCODE_LOOKUP;

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
    expect(addressSearch).toBeInstanceOf(FormWizard.Controller);
  });

  describe("locals", () => {
    it("sets prepopulatedPostcode on res.locals", () => {
      req.session.prepopulatedPostcode = true;
      res.locals = {};

      const superLocalsSpy = vi
        .spyOn(FormWizard.Controller.prototype, "locals")
        .mockReturnValue({});

      addressSearch.locals(req, res);

      expect(res.locals.prepopulatedPostcode).to.equal(true);
      expect(superLocalsSpy).to.have.been.calledOnce;
    });
  });

  describe("search", () => {
    it("searches without a session token", async () => {
      delete req.session.tokenId;

      req.customFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue([
          {
            buildingName: "test",
          },
        ]),
      });

      await addressSearch.search(req, "SW1A1AA");

      expect(req.customFetch).to.have.been.calledOnce;
    });

    it("handles unsuccessful address lookup responses", async () => {
      req.customFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: vi.fn().mockResolvedValue([]),
      });

      await addressSearch.search(req, "SW1A1AA");

      expect(req.customFetch).to.have.been.calledOnce;
    });

    it("handles empty address results", async () => {
      req.customFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue([]),
      });

      const results = await addressSearch.search(req, "SW1A1AA");

      expect(results).to.deep.equal([]);
    });
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
      expect(req.customFetch).to.have.been.calledWith(postcodeLookupPath, {
        method: "POST",
        jsonBody: {
          postcode: "myPostcode",
        },
        headers,
      });
    });
    it("should remove a previously selected address when searching using a different postcode", async () => {
      req.sessionModel.set("address", {
        buildingName: "East Zzz",
        postalCode: "ZZ1 1ZZ",
      });

      req.body["addressSearch"] = "E1 8QS";

      req.customFetch = vi
        .fn()
        .mockResolvedValue(new Response(JSON.stringify(apiResponse.data)));

      await addressSearch.saveValues(req, res, next);

      expect(req.sessionModel.get("address")).toBeUndefined();
      expect(req.sessionModel.get("addressPostcode")).toBe("E1 8QS");
    });

    describe("on api success", () => {
      let testPostcode;

      beforeEach(async () => {
        vi.fn().mockImplementation(FormWizard.Controller.prototype.saveValues);

        req.customFetch = vi
          .fn()
          .mockResolvedValue(new Response(JSON.stringify(apiResponse.data)));

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
          titleCasedAddresses
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
        const error = new Error("Address lookup failed");
        error.address = {
          postcode: "SW1A 1AA",
          buildingName: "Buckingham Palace",
        };
        req.customFetch = vi.fn().mockRejectedValue(error);

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
      it("should only log the error message", () => {
        expect(mockLogger.warn).toHaveBeenCalledWith(
          {
            component: "AddressSearchController",
            message: "Address lookup failed",
          },
          "Error searching for address"
        );
      });

      it("should not log PII from the error object", () => {
        const loggedPayload = mockLogger.warn.mock.calls[0][0];

        expect(loggedPayload).toEqual({
          component: "AddressSearchController",
          message: "Address lookup failed",
        });

        expect(JSON.stringify(loggedPayload)).not.toContain("SW1A 1AA");
        expect(JSON.stringify(loggedPayload)).not.toContain(
          "Buckingham Palace"
        );
      });
    });
  });

  describe("titleCaseAddresses", () => {
    it("should title case addresses", () => {
      const returnedAddresses = addressSearch.titleCaseAddresses(
        apiResponse.data
      );
      expect(returnedAddresses).to.deep.equal(titleCasedAddresses);
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
