function addressFactory(quantity) {
  const addresses = [
    {
      subBuildingName: "flat 1",
      buildingNumber: "1",
      streetName: "street1",
      addressLocality: "town1",
      postalCode: "postcode1",
      country: "GB",
      validFrom: String(new Date().getFullYear()),
    },
    {
      buildingName: "farm2",
      addressLocality: "town2",
      postalCode: "postcode2",
      validFrom: String(new Date().getFullYear()),
    },
  ];

  return addresses.slice(0, quantity);
}

module.exports = addressFactory;
