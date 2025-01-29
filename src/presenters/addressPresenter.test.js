const { expect } = require("chai");
const {
  generateSearchResultString,
  generateHTMLofAddress,
  generateHTMLofNonUKAddress,
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

const nonUKAddress = {
  subBuildingName: "Flat 1",
  buildingNumber: "1",
  buildingName: "Building",
  streetName: "Street",
  addressLocality: "Town",
  postalCode: "PO51 CDE",
  addressRegion: "Region",
  addressCountry: "FR",
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
      ].join("<br>")
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
      ].join("<br>")
    );
  });
});

describe("Generate HTML of non UK address", () => {
  let translate;
  let sandbox;
  let modifiedNonUKAddress;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    translate = sinon.stub();
    translate.returns("France");
    modifiedNonUKAddress = { ...nonUKAddress };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("Full address", () => {
    expect(generateHTMLofNonUKAddress(translate, nonUKAddress)).to.equal(
      "Flat 1<br>1<br>Building<br>Street<br>Town<br>PO51 CDE<br>Region<br>France"
    );
  });

  it("Address without subBuildingName", () => {
    const expectedHtml =
      "1<br>Building<br>Street<br>Town<br>PO51 CDE<br>Region<br>France";

    modifiedNonUKAddress.subBuildingName = null;
    expect(
      generateHTMLofNonUKAddress(translate, modifiedNonUKAddress)
    ).to.equal(expectedHtml);

    modifiedNonUKAddress.subBuildingName = " ";
    expect(
      generateHTMLofNonUKAddress(translate, modifiedNonUKAddress)
    ).to.equal(expectedHtml);
  });

  it("Address without buildingNumber", () => {
    const expectedHtml =
      "Flat 1<br>Building<br>Street<br>Town<br>PO51 CDE<br>Region<br>France";

    modifiedNonUKAddress.buildingNumber = null;
    expect(
      generateHTMLofNonUKAddress(translate, modifiedNonUKAddress)
    ).to.equal(expectedHtml);

    modifiedNonUKAddress.buildingNumber = " ";
    expect(
      generateHTMLofNonUKAddress(translate, modifiedNonUKAddress)
    ).to.equal(expectedHtml);
  });

  it("Address without buildingName", () => {
    const expectedHtml =
      "Flat 1<br>1<br>Street<br>Town<br>PO51 CDE<br>Region<br>France";

    modifiedNonUKAddress.buildingName = null;
    expect(
      generateHTMLofNonUKAddress(translate, modifiedNonUKAddress)
    ).to.equal(expectedHtml);

    modifiedNonUKAddress.buildingName = " ";
    expect(
      generateHTMLofNonUKAddress(translate, modifiedNonUKAddress)
    ).to.equal(expectedHtml);
  });

  it("Address without streetName", () => {
    const expectedHtml =
      "Flat 1<br>1<br>Building<br>Town<br>PO51 CDE<br>Region<br>France";

    modifiedNonUKAddress.streetName = null;
    expect(
      generateHTMLofNonUKAddress(translate, modifiedNonUKAddress)
    ).to.equal(expectedHtml);

    modifiedNonUKAddress.streetName = " ";
    expect(
      generateHTMLofNonUKAddress(translate, modifiedNonUKAddress)
    ).to.equal(expectedHtml);
  });

  it("Address without addressLocality", () => {
    const expectedHtml =
      "Flat 1<br>1<br>Building<br>Street<br>PO51 CDE<br>Region<br>France";

    modifiedNonUKAddress.addressLocality = null;
    expect(
      generateHTMLofNonUKAddress(translate, modifiedNonUKAddress)
    ).to.equal(expectedHtml);

    modifiedNonUKAddress.addressLocality = " ";
    expect(
      generateHTMLofNonUKAddress(translate, modifiedNonUKAddress)
    ).to.equal(expectedHtml);
  });

  it("Address without postalCode", () => {
    const expectedHtml =
      "Flat 1<br>1<br>Building<br>Street<br>Town<br>Region<br>France";

    modifiedNonUKAddress.postalCode = null;
    expect(
      generateHTMLofNonUKAddress(translate, modifiedNonUKAddress)
    ).to.equal(expectedHtml);

    modifiedNonUKAddress.postalCode = " ";
    expect(
      generateHTMLofNonUKAddress(translate, modifiedNonUKAddress)
    ).to.equal(expectedHtml);
  });

  it("Address without addressRegion", () => {
    const expectedHtml =
      "Flat 1<br>1<br>Building<br>Street<br>Town<br>PO51 CDE<br>France";

    modifiedNonUKAddress.addressRegion = null;
    expect(
      generateHTMLofNonUKAddress(translate, modifiedNonUKAddress)
    ).to.equal(expectedHtml);

    modifiedNonUKAddress.addressRegion = " ";
    expect(
      generateHTMLofNonUKAddress(translate, modifiedNonUKAddress)
    ).to.equal(expectedHtml);
  });

  it("Address without addressCountry", () => {
    const expectedHtml =
      "Flat 1<br>1<br>Building<br>Street<br>Town<br>PO51 CDE<br>Region";

    modifiedNonUKAddress.addressCountry = null;
    expect(
      generateHTMLofNonUKAddress(translate, modifiedNonUKAddress)
    ).to.equal(expectedHtml);

    modifiedNonUKAddress.addressCountry = " ";
    expect(
      generateHTMLofNonUKAddress(translate, modifiedNonUKAddress)
    ).to.equal(expectedHtml);
  });

  it("Empty address", () => {
    expect(generateHTMLofNonUKAddress(translate, [])).to.equal("");
  });
});
