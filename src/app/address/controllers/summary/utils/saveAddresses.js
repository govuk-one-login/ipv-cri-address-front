import { createPersonalDataHeaders } from "@govuk-one-login/frontend-passthrough-headers";
import { config } from "../../../../../lib/config.js";

const baseUrl = config.API.BASE_URL;
const saveAddressPath = config.API.PATHS.SAVE_ADDRESS;

export async function saveAddresses(req, addresses) {
  // set the headers to undefined will a fail a production level request but pass the browser tests for now.
  const headers = req.session.tokenId
    ? {
        session_id: req.session.tokenId,
        "session-id": req.session.tokenId,
        ...createPersonalDataHeaders(`${baseUrl}${saveAddressPath}`, req),
      }
    : createPersonalDataHeaders(`${baseUrl}${saveAddressPath}`, req);
  const resp = await req.customFetch(saveAddressPath, {
    method: "PUT",
    jsonBody: addresses,
    headers,
  });

  return await resp.json();
}
