const BaseController = require("hmpo-form-wizard").Controller;
const AddressConfirmController = require("./confirm");
const addressFactory = require("../../../../../test/utils/addressFactory");
const { expect } = require("chai");

const testData = require("../../../../../test/data/testData");
const {
  API: {
    PATHS: { SAVE_ADDRESS },
  },
} = require("../../../../lib/config");

let req;
let res;
let next;
let sandbox;
let addresses = [];
let addressConfirm;
const sessionId = "session-id-123";

describe("Address confirmation controller", () => {
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    const setup = setupDefaultMocks();

    req = setup.req;
    res = setup.res;
    next = setup.next;
    req.session.tokenId = sessionId;
    req.session.authParams = {};

    addresses = addressFactory(2);
    req.journeyModel.set("currentAddress", addresses[0]);
    req.journeyModel.set("previousAddress", addresses[1]);
    addressConfirm = new AddressConfirmController({ route: "/test" });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should be an instance of BaseController", () => {
    expect(addressConfirm).to.be.an.instanceOf(BaseController);
  });

  describe("locals", () => {
    it("Should format the current address and previous addresses in locals", async () => {
      // factor in the address might have building name or number or both
      const params = {
        currentAddressRowValue: "flat 1<br>1 street1<br>town1<br>postcode1",
        validFromRow: String(new Date().getFullYear()),
        previousAddressRowValue: "farm2<br>town2<br>postcode2",
        changeCurrentHref: "/address/edit?edit=true",
      };

      addressConfirm.locals(req, res, next);
      expect(next).to.have.been.calledOnce;
      expect(next).to.have.been.calledWith(null, params);
    });

    it("Should call callback with an error when no address is found", async () => {
      req.journeyModel.set("currentAddress", null);
      addressConfirm.locals(req, res, next);

      const errMessage = "No address found";
      const callbackError = next.firstArg;
      expect(next).to.have.been.calledOnce;
      expect(callbackError).to.be.instanceOf(Error);
      expect(callbackError.message).to.equal(errMessage);
    });
  });

  describe("saveValues", () => {
    it("Should put address to address api and redirect back to callback", async () => {
      req.axios.put = sinon.fake.resolves(testData.addressApiResponse);

      const headers = {
        "session-id": sessionId,
        session_id: sessionId,
        "txma-audit-encoded": "dummy-txma-header",
        "x-forwarded-for": "127.0.0.1",
      };

      await addressConfirm.saveValues(req, res, next);
      expect(req.axios.put).to.have.been.calledWith(SAVE_ADDRESS, addresses, {
        headers,
      });

      expect(next).to.have.been.calledWith();
    });

    it("Should reset journey wide variables and enter previous journey when user has previous UK address within 3 months", async () => {
      req.form.values.hasPreviousUKAddressWithinThreeMonths = "yes";
      await addressConfirm.saveValues(req, res, next);
      expect(req.session.test.addPreviousAddresses).to.equal(true);
    });

    it("should return an error when no addresses are found", async () => {
      req.journeyModel.set("currentAddress", null);
      req.journeyModel.set("previousAddress", null);

      await addressConfirm.saveValues(req, res, next);

      const errMessage = "No address found";
      const callbackError = next.firstArg;
      expect(next).to.have.been.calledOnce;
      expect(callbackError).to.be.instanceOf(Error);
      expect(callbackError.message).to.equal(errMessage);
      expect(next).to.have.been.calledWith();
    });
  });

  describe("isMoreInfoRequired", () => {
    const testData = [
      {
        fakeToday: new Date(),
        yearFrom: 2020,
        expect: false,
        message: "is more than 3 months ago",
      },
      {
        fakeToday: new Date(2022, 1),
        yearFrom: 2021,
        expect: true,
        message: "is within the last 3 months",
      },
      {
        fakeToday: new Date(2022, 3, 1),
        yearFrom: 2021,
        expect: false,
        message: "is exactly 3 months ago",
      },
      {
        fakeToday: new Date(2022, 2, 31),
        yearFrom: 2021,
        expect: true,
        message: "is 1 day less than 3 months ago",
      },
      {
        fakeToday: new Date(2024, 3, 1),
        yearFrom: 2023,
        expect: false,
        message: "is exactly 3 months ago - leap year",
      },
      {
        fakeToday: new Date(2024, 2, 31),
        yearFrom: 2024,
        expect: true,
        message: "is 1 day less than 3 months ago - leap year",
      },
    ];

    testData.forEach((data) => {
      const todayMessage = data.fakeToday.toISOString().split("T")[0];
      it(`should return ${data.expect} when today is ${todayMessage} and yearFrom is ${data.yearFrom} which means residency ${data.message}`, () => {
        expect(
          addressConfirm.isMoreInfoRequired(data.yearFrom, data.fakeToday)
        ).to.equal(data.expect);
      });
    });
  });
});
