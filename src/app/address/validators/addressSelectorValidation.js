export function addressSelectorValidator(_, addressOne, addressTwo) {
  if (
    (!addressOne.uprn && !addressTwo.uprn) ||
    (addressOne.uprn === "" && addressTwo.uprn === "")
  ) {
    return true;
  }
  return addressOne.uprn !== addressTwo.uprn;
}
