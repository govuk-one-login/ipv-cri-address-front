export function postcodeLength(val) {
  return val.length >= 5 && val.length <= 7;
}

export function alphaNumeric(val) {
  return !!val.match(/^[a-z0-9]+$/i);
}

export function missingAlphaOrNumeric(val) {
  if (val.match(/^[A-Za-z]+$/)) {
    return false; // missing numbers
  } else if (val.match(/^\d+$/)) {
    return false; // missing alphas
  } else {
    return true;
  }
}

export function isUkPostcode(val) {
  // taken from https://en.wikipedia.org/wiki/Postcodes_in_the_United_Kingdom#Validation
  // simpler regex to just validate the postcode format

  // 1 or 2 letters followed by a number
  // optionally a letter or number
  // A optional space followed by a number and two letters
  const ukPostcodeRegex = /^[A-Z]{1,2}\d[A-Z0-9]? ?\d[A-Z]{2}$/i;
  return !!val.match(ukPostcodeRegex);
}
