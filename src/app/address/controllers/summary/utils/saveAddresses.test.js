import { describe, it, beforeEach, expect, vi, afterEach } from "vitest";

import { saveAddresses } from "./saveAddresses.js";
import { config } from "../../../../../lib/config.js";
import { addressApiResponse } from "../../../../../../test/data/testData.js";
import { addressFactory } from "../../../../../../test/utils/addressFactory.js";
import { createDefaultReqResNext } from "../../../../../../test/utils/helpers.js";

const saveAddressPath = config.API.PATHS.SAVE_ADDRESS;

describe("saveAddresses", () => {
  let req;
  let addresses;
  let sessionId;

  beforeEach(() => {
    const setup = createDefaultReqResNext();
    sessionId = "session-id-123";
    req = setup.req;
    addresses = addressFactory(1);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("Should put address to address api and redirect back to callback", async () => {
    addresses = addressFactory(1);

    req.customFetch = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(addressApiResponse.data)));
    req.session.tokenId = sessionId;

    const headers = {
      "session-id": sessionId,
      session_id: sessionId,
      "txma-audit-encoded": "dummy-txma-header",
      "x-forwarded-for": "127.0.0.1",
    };

    await saveAddresses(req, [addresses[0]]);
    expect(req.customFetch).to.have.been.calledWith(saveAddressPath, {
      method: "PUT",
      jsonBody: addresses,
      headers,
    });
  });

  it("Should put multiple addresses to address api and redirect back to callback", async () => {
    addresses = addressFactory(2);

    req.customFetch = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(addressApiResponse.data)));
    req.session.tokenId = sessionId;

    const headers = {
      "session-id": sessionId,
      session_id: sessionId,
      "txma-audit-encoded": "dummy-txma-header",
      "x-forwarded-for": "127.0.0.1",
    };

    await saveAddresses(req, addresses);
    expect(req.customFetch).to.have.been.calledWith(saveAddressPath, {
      method: "PUT",
      jsonBody: addresses,
      headers,
    });
  });

  it("Should put address", async () => {
    req.customFetch = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(addressApiResponse.data)));

    const headers = {
      "txma-audit-encoded": "dummy-txma-header",
      "x-forwarded-for": "127.0.0.1",
    };

    await saveAddresses(req, [addresses[0]]);
    expect(req.customFetch).to.have.been.calledWith(saveAddressPath, {
      method: "PUT",
      jsonBody: addresses,
      headers,
    });
  });

  it("Should not read or parse the body when the api returns an empty body", async () => {
    req.customFetch = vi.fn().mockResolvedValue(new Response(""));

    await expect(saveAddresses(req, [addresses[0]])).resolves.not.toThrow();
  });
});
