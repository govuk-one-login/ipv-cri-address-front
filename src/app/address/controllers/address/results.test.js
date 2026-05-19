import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { createDefaultReqResNext } from "../../../../../test/utils/helpers";
const BaseController = require("hmpo-form-wizard").Controller;
const AddressResultController = require("./results");

const presenters = require("../../../../presenters");

const testData = require("../../../../../test/data/testData");

let req;
let res;
let next;

describe("Address result controller", () => {
  let addressResult;

  beforeEach(() => {
    const setup = createDefaultReqResNext();
    req = setup.req;
    req.i18n = {
      t: vi.fn(),
    };

    res = setup.res;
    next = setup.next;

    vi.spyOn(presenters, "addressesToSelectItems").mockImplementation(() => {});

    addressResult = new AddressResultController({ route: "/test" });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should be an instance of BaseController", () => {
    expect(addressResult).to.be.an.instanceOf(BaseController);
  });

  describe("#locals", () => {
    let prototypeSpy;

    beforeEach(() => {
      prototypeSpy = vi.spyOn(BaseController.prototype, "locals");

      req.sessionModel.set("addressPostcode", "E1 8QS");
      req.sessionModel.set("searchResults", [
        { postcode: "Q1 1AB" },
        { postcode: "Q2 2AB" },
      ]);

      vi.spyOn(presenters, "addressesToSelectItems").mockReturnValue([
        { text: "nn addresses found", value: "" },
      ]);
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    it("should call locals first with a callback", () => {
      addressResult.locals(req, res, next);
      expect(
        prototypeSpy.mock.invocationCallOrder[0] <
          next.mock.invocationCallOrder[0]
      ).toBe(true);
    });

    it("should add postcode from session into locals", () => {
      addressResult.locals(req, res, next);

      expect(next).to.have.been.calledWith(
        null,
        expect.objectContaining({ addressPostcode: "E1 8QS" })
      );
    });

    it("should add addres as select items data into locals", () => {
      vi.spyOn(presenters, "addressesToSelectItems").mockReturnValue([
        { text: "nn addresses found", value: "" },
      ]);

      addressResult.locals(req, res, next);

      expect(next).to.have.been.calledWith(
        null,
        expect.objectContaining({
          addresses: [{ text: "nn addresses found", value: "" }],
        })
      );
    });
    describe("with error on callback", () => {
      let error;
      let locals;
      let superLocals;

      beforeEach(async () => {
        error = new Error("Random error");
        superLocals = {
          superKey: "superValue",
        };

        locals = {
          key: "value",
        };
        res.locals = locals;

        vi.spyOn(BaseController.prototype, "locals").mockImplementation(
          (res, req, next) => {
            next(error, superLocals);
          }
        );

        await addressResult.locals(req, res, next);
      });

      it("should call callback with error and existing locals", () => {
        expect(next).toHaveBeenCalledWith(error, superLocals);
      });
    });
  });

  describe("#saveValues", () => {
    it("Should set the chosen address in the session", async () => {
      const expectedResponse = testData.formattedAddressed[1];

      req.form.values.addressResults = expectedResponse.value;

      req.sessionModel.set("searchResults", testData.formattedAddressed);

      await addressResult.saveValues(req, res, next);

      expect(next).to.have.been.calledOnce;
      expect(req.session.test.address.buildingNumber).to.equal(
        expectedResponse.buildingNumber
      );

      expect(req.session.test.address.streetName).to.equal(
        expectedResponse.streetName
      );
      expect(req.session.test.address.postCode).to.equal(
        expectedResponse.postCode
      );
      expect(req.session.test.address.postTown).to.equal(
        expectedResponse.postTown
      );
    });
  });
});
