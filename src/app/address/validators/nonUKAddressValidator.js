module.exports = {
  buildingAddressEmptyValidator: function (
    apartmentNumber,
    buildingNumber,
    buildingName
  ) {
    const trimOrDefaultToEmpty = (value) =>
      value != null ? String(value).trim() : "";

    return (
      trimOrDefaultToEmpty(apartmentNumber) ||
      trimOrDefaultToEmpty(buildingNumber) ||
      trimOrDefaultToEmpty(buildingName)
    );
  },
};
