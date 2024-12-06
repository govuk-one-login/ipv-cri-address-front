module.exports = {
  generateSearchResultString: function (address) {
    const { buildingNames, streetNames, localityNames } =
      extractAddressFields(address);
    const fullBuildingName = buildingNames.join(" ");
    let fullStreetName;
    if (streetNames) {
      fullStreetName = streetNames.join(" ");
    }

    const fullLocality = localityNames.join(" ");
    if (fullStreetName) {
      return `${fullBuildingName} ${fullStreetName}, ${fullLocality}, ${address.postalCode}`.trim();
    } else {
      return `${fullBuildingName}, ${fullLocality}, ${address.postalCode}`.trim();
    }
  },
  generateHTMLofAddress: function (address) {
    const { buildingNames, streetNames, localityNames } =
      extractAddressFields(address);

    const fullBuildingName = buildingNames.join(" ");
    let fullStreetName;
    if (streetNames) {
      fullStreetName = streetNames.join(" ");
    }

    const fullLocality = localityNames.join(" ");

    if (fullStreetName) {
      return `${fullBuildingName}<br>${fullStreetName},<br>${fullLocality},<br>${address.postalCode}<br>`;
    } else {
      return `${fullBuildingName},<br>${fullLocality},<br>${address.postalCode}<br>`;
    }
  },
  generateHTMLofNonUKAddress: function (translate, address) {
    const countryList = require("../app/address/data/countries.json");

    let addressHTML = [];

    address.subBuildingName?.trim() &&
      addressHTML.push(address.subBuildingName);
    address.buildingNumber?.trim() && addressHTML.push(address.buildingNumber);
    address.buildingName?.trim() && addressHTML.push(address.buildingName);
    address.streetName?.trim() && addressHTML.push(address.streetName);
    address.addressLocality?.trim() &&
      addressHTML.push(address.addressLocality);
    address.postalCode?.trim() && addressHTML.push(address.postalCode);
    address.addressRegion?.trim() && addressHTML.push(address.addressRegion);
    if (address.addressCountry?.trim()) {
      const countryName = translate(
        countryList.find((country) => country.value === address.addressCountry)
          .key
      );
      addressHTML.push(countryName);
    }

    return addressHTML.join("<br>");
  },
};

function extractAddressFields(address) {
  let buildingNames = [];
  let streetNames = [];
  let localityNames = [];

  // handle building name
  if (address.departmentName) {
    buildingNames.push(address.departmentName);
  }
  if (address.organisationName) {
    buildingNames.push(address.organisationName);
  }
  if (address.subBuildingName) {
    buildingNames.push(address.subBuildingName);
  }
  if (address.buildingName) {
    buildingNames.push(address.buildingName);
  }

  // street names
  if (address.buildingNumber) {
    streetNames.push(address.buildingNumber);
  }
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
