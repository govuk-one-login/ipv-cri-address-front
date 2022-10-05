const { generateSearchResultString } = require("./addressPresenter");

module.exports = ({ addresses, translate }) => {
  const defaultMessage = {
    text: translate("addressSelect.addressFoundWithCount", {
      count: addresses.length,
    }),
    value: "",
  };

  if (!addresses || addresses.length <= 0) {
    return [defaultMessage];
  }

  const addressesAsItems = addresses.map((address) => {
    const textView = generateSearchResultString(address);

    return { ...address, text: textView, value: textView };
  });

  return [defaultMessage, ...addressesAsItems];
};
