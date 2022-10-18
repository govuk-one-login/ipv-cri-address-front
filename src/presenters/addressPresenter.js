module.exports = {
  generateSearchResultString: function (address) {
    const { buildingNames, streetNames, localityNames } =
      extractAddressFields(address);
    const fullBuildingName = buildingNames.join(" ");
    const fullStreetName = streetNames.join(" ");
    const fullLocality = localityNames.join(" ");
    const text = `${fullBuildingName} ${fullStreetName}, ${fullLocality}, ${address.postalCode}`;

    return text;
  },
  generateHTMLofAddress: function (address) {
    const { buildingNames, streetNames, localityNames } =
      extractAddressFields(address);

    const fullBuildingName = buildingNames.join(" ");
    const fullStreetName = streetNames.join(" ");
    const fullLocality = localityNames.join(" ");

    const text = `${fullBuildingName}<br>${fullStreetName},<br>${fullLocality},<br>${address.postalCode}<br>`;

    return text;
  },
};

function extractAddressFields(address) {
  let buildingNames = [];
  let streetNames = [];
  let localityNames = [];

  // handle building name
  if (address.organisationName) {
    buildingNames.push(address.organisationName);
  }
  if (address.departmentName) {
    buildingNames.push(address.departmentName);
  }
  if (address.buildingName) {
    buildingNames.push(address.buildingName);
  }
  if (address.subBuildingName) {
    buildingNames.push(address.subBuildingName);
  }
  if (address.buildingNumber) {
    buildingNames.push(address.buildingNumber);
  }

  // street names
  if (address.dependentStreetName) {
    streetNames.push(address.dependentStreetName);
  }
  if (address.streetName) {
    streetNames.push(address.streetName);
  }

  // locality names
  if (address.doubleDependentAddressLocality) {
    localityNames.push(address.doubleDependentAddressLocality);
  }
  if (address.dependentAddressLocality) {
    localityNames.push(address.dependentAddressLocality);
  }
  if (address.addressLocality) {
    localityNames.push(address.addressLocality);
  }
  return { buildingNames, streetNames, localityNames };
}
