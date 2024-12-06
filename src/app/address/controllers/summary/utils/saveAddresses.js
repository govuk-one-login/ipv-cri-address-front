async function saveAddressess(req, addresses) {
  const {
    createPersonalDataHeaders,
  } = require("@govuk-one-login/frontend-passthrough-headers");
  const {
    API: {
      BASE_URL,
      PATHS: { SAVE_ADDRESS },
    },
  } = require("../../../../../lib/config");

  // set the headers to undefined will a fail a production level request but pass the browser tests for now.
  const headers = req.session.tokenId
    ? {
        session_id: req.session.tokenId,
        "session-id": req.session.tokenId,
        ...createPersonalDataHeaders(`${BASE_URL}${SAVE_ADDRESS}`, req),
      }
    : createPersonalDataHeaders(`${BASE_URL}${SAVE_ADDRESS}`, req);
  const resp = await req.axios.put(`${SAVE_ADDRESS}`, addresses, {
    headers,
  });

  return resp.data;
}

module.exports = saveAddressess;
