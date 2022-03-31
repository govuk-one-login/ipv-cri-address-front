const BaseController = require("hmpo-form-wizard").Controller;
const AddressConfirmController = require("./addressConfirm");
const addressFactory = require("../../../../test/utils/addressFactory");
const { expect } = require("chai");

const testData = require("../../../../test/data/testData");
const {
  API: {
    PATHS: { SAVE_ADDRESS },
  },
} = require("../../../lib/config");

let req;
let res;
let next;
let sandbox;
let addresses = [];
const sessionId = "session-id-123";

beforeEach(() => {
  sandbox = sinon.createSandbox();
  const setup = setupDefaultMocks();
  req = setup.req;
  res = setup.res;
  next = setup.next;
  req.session.tokenId = sessionId;
});

afterEach(() => {
  sandbox.restore();
});

describe("Address confirmation controller", () => {
  let addressConfirm;

  beforeEach(() => {
    addresses = addressFactory(3);
    req.sessionModel.set("addresses", addresses);
    addressConfirm = new AddressConfirmController({ route: "/test" });
  });

  it("should be an instance of BaseController", () => {
    expect(addressConfirm).to.be.an.instanceOf(BaseController);
  });

  it("Should format the current address and previous addresses in locals", async () => {
    // factor in the address might have building name or number or both
    const formattedAddresses = addresses.map((address) => {
      let buildingNameNumber;
      if (address.buildingName && address.buildingNumber) {
        buildingNameNumber = `${address.buildingNumber} ${address.buildingName}`;
      } else {
        buildingNameNumber = address.buildingName || address.buildingNumber;
      }

      return `${buildingNameNumber}<br>${address.thoroughfareName},<br>${address.postTown},<br>${address.postcode}<br>`;
    });

    const currentAddress = formattedAddresses.shift();
    const params = {
      formattedAddress: currentAddress,
      previousAddresses: formattedAddresses,
    };

    addressConfirm.locals(req, res, next);
    expect(next).to.have.been.calledOnce;
    expect(next).to.have.been.calledWith(null, params);
  });

  it("Should put address to address api and redirect back to callback", async () => {
    req.axios.put = sinon.fake.resolves(testData.addressApiResponse);

    const redirectURI = testData.addressApiResponse.data.redirect_uri;
    const code = testData.addressApiResponse.data.code;
    const state = testData.addressApiResponse.data.state;
    const expectedRedirectURI = `${redirectURI}?code=${code}&state=${state}&id=address`;

    await addressConfirm.saveValues(req, res, next);

    expect(req.axios.put).to.have.been.calledWith(SAVE_ADDRESS, addresses, {
      headers: {
        session_id: sessionId,
      },
    });

    // All methods which send a response emit an 'end' response
    // https://www.npmjs.com/package/reqres#usage
    res.on("end", () => {
      expect(res.redirect).to.have.been.calledWith(expectedRedirectURI);
    });
  });
});
