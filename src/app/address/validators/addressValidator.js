export function alphaNumericWithSpecialChars(val) {
  if (!val) {
    return true; // handle when field is optional
  }
  return !!val.match(/^[0-9A-Z'.,\\/* -]+$/i);
}

export function isPreviousYear(val) {
  return new Date(val).getFullYear() <= new Date().getFullYear();
}

export function isLessThanOneHundredYearsAgo(val) {
  return val > new Date().getFullYear() - 100;
}

export function ukBuildingAddressEmptyValidator(houseNumber, houseName) {
  const trimOrDefaultToEmpty = (value) =>
    value == null ? "" : String(value).trim();

  return trimOrDefaultToEmpty(houseNumber) || trimOrDefaultToEmpty(houseName);
}
