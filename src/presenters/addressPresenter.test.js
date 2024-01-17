const { expect } = require("chai");
const {
  generateSearchResultString,
  generateHTMLofAddress,
} = require("./addressPresenter");

const address = {
  organisationName: "Company",
  departmentName: "Department",
  buildingName: "Building",
  subBuildingName: "Room 5",
  buildingNumber: "1",
  dependentStreetName: "Outer street",
  doubleDependentAddressLocality: "Double dependent town",
  dependentAddressLocality: "Dependent town",
  addressLocality: "Town",
  postalCode: "Code",
};

const addressWithStreet = {
  ...address,
  streetName: "Inner street",
};

const buildingText = [
  address.departmentName,
  address.organisationName,
  address.subBuildingName,
  address.buildingName,
].join(" ");

const localityText = [
  address.doubleDependentAddressLocality,
  address.dependentAddressLocality,
  address.addressLocality,
].join(" ");

describe("Generate search result string", () => {
  const streetText = [
    buildingText,
    address.buildingNumber,
    address.dependentStreetName,
  ].join(" ");

  it("should generate search result string without street name", () => {
    expect(generateSearchResultString(address)).to.equal(
      [streetText, localityText, address.postalCode].join(", ")
    );
  });

  it("should generate search result string with street name", () => {
    expect(generateSearchResultString(addressWithStreet)).to.equal(
      [
        [streetText, addressWithStreet.streetName].join(" "),
        localityText,
        address.postalCode,
      ].join(", ")
    );
  });
});

describe("Generate HTML of address", () => {
  it("should generate HTML without street name", () => {
    expect(generateHTMLofAddress(address)).to.equal(
      [
        [
          buildingText,
          [address.buildingNumber, address.dependentStreetName].join(" "),
        ].join("<br>"),
        localityText,
        address.postalCode,
      ]
        .join(",<br>")
        .concat("<br>")
    );
  });

  it("should generate HTML with street name", () => {
    expect(generateHTMLofAddress(addressWithStreet)).to.equal(
      [
        [
          buildingText,
          [
            address.buildingNumber,
            address.dependentStreetName,
            addressWithStreet.streetName,
          ].join(" "),
        ].join("<br>"),
        localityText,
        address.postalCode,
      ]
        .join(",<br>")
        .concat("<br>")
    );
  });
});
