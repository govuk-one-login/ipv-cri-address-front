const testData = require("../../../../../../test/data/testData");

const {
  API: {
    PATHS: { SAVE_ADDRESS },
  },
} = require("../../../../../lib/config");

const addressFactory = require("../../../../../../test/utils/addressFactory");
const saveAddressess = require("./saveAddresses");

describe("saveAddresses", () => {
  let sandbox;
  let req;
  let addresses;
  let sessionId;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    const setup = setupDefaultMocks();
    sessionId = "session-id-123";
    req = setup.req;
    addresses = addressFactory(1);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("Should put address to address api and redirect back to callback", async () => {
    addresses = addressFactory(1);

    req.axios.put = sinon.fake.resolves(testData.addressApiResponse);
    req.session.tokenId = sessionId;

    const headers = {
      "session-id": sessionId,
      session_id: sessionId,
      "txma-audit-encoded": "dummy-txma-header",
      "x-forwarded-for": "127.0.0.1",
    };

    const response = await saveAddressess(req, [addresses[0]]);
    expect(req.axios.put).to.have.been.calledWith(SAVE_ADDRESS, addresses, {
      headers,
    });

    expect(response).to.equal(testData.addressApiResponse.data);
  });

  it("Should put multiple addresses to address api and redirect back to callback", async () => {
    addresses = addressFactory(2);

    req.axios.put = sinon.fake.resolves(testData.addressApiResponse);
    req.session.tokenId = sessionId;

    const headers = {
      "session-id": sessionId,
      session_id: sessionId,
      "txma-audit-encoded": "dummy-txma-header",
      "x-forwarded-for": "127.0.0.1",
    };

    const response = await saveAddressess(req, addresses);
    expect(req.axios.put).to.have.been.calledWith(SAVE_ADDRESS, addresses, {
      headers,
    });

    expect(response).to.equal(testData.addressApiResponse.data);
  });

  it("Should put address", async () => {
    req.axios.put = sinon.fake.resolves(testData.addressApiResponse);

    const headers = {
      "txma-audit-encoded": "dummy-txma-header",
      "x-forwarded-for": "127.0.0.1",
    };

    const response = await saveAddressess(req, [addresses[0]]);
    expect(req.axios.put).to.have.been.calledWith(SAVE_ADDRESS, addresses, {
      headers,
    });

    expect(response).to.equal(testData.addressApiResponse.data);
  });
});
