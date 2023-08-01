const BaseController = require("hmpo-form-wizard").Controller;
const AddressResultController = require("./results");

const presenters = require("../../../../presenters");

const testData = require("../../../../../test/data/testData");

let req;
let res;
let next;
let sandbox;

describe("Address result controller", () => {
  let addressResult;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    const setup = setupDefaultMocks();
    req = setup.req;
    req.i18n = {
      t: sinon.stub(),
    };

    res = setup.res;
    next = setup.next;

    sinon.stub(presenters, "addressesToSelectItems");

    addressResult = new AddressResultController({ route: "/test" });
  });

  afterEach(() => {
    sandbox.restore();
    presenters.addressesToSelectItems.restore();
  });

  it("should be an instance of BaseController", () => {
    expect(addressResult).to.be.an.instanceOf(BaseController);
  });

  describe("#locals", () => {
    let prototypeSpy;

    beforeEach(() => {
      prototypeSpy = sinon.stub(BaseController.prototype, "locals");
      BaseController.prototype.locals.callThrough();

      req.sessionModel.set("addressPostcode", "E1 8QS");
      req.sessionModel.set("searchResults", [
        { postcode: "Q1 1AB" },
        { postcode: "Q2 2AB" },
      ]);

      presenters.addressesToSelectItems.returns([
        { text: "nn addresses found", value: "" },
      ]);
    });

    afterEach(() => {
      prototypeSpy.restore();
    });

    it("should call locals first with a callback", () => {
      addressResult.locals(req, res, next);

      expect(prototypeSpy).to.have.been.calledBefore(next);
    });

    it("should add postcode from session into locals", () => {
      addressResult.locals(req, res, next);

      expect(next).to.have.been.calledWith(
        null,
        sinon.match({ addressPostcode: "E1 8QS" }),
      );
    });

    it("should add addres as select items data into locals", () => {
      presenters.addressesToSelectItems.returns([
        { text: "nn addresses found", value: "" },
      ]);

      addressResult.locals(req, res, next);

      expect(next).to.have.been.calledWith(
        null,
        sinon.match({ addresses: [{ text: "nn addresses found", value: "" }] }),
      );
    });
    context("with error on callback", () => {
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
        BaseController.prototype.locals.yields(error, superLocals);

        await addressResult.locals(req, res, next);
      });

      it("should call callback with error and existing locals", () => {
        expect(next).to.have.been.calledWith(error, superLocals);
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
        expectedResponse.buildingNumber,
      );

      expect(req.session.test.address.streetName).to.equal(
        expectedResponse.streetName,
      );
      expect(req.session.test.address.postCode).to.equal(
        expectedResponse.postCode,
      );
      expect(req.session.test.address.postTown).to.equal(
        expectedResponse.postTown,
      );
    });
  });
});
