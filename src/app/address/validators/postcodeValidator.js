module.exports = {
  postcodeLength: function (val) {
    return val.length >= 5 && val.length <= 7;
  },
  alphaNumeric: function (val) {
    return !!val.match(/^[a-z0-9]+$/i);
  },
  missingAlphaOrNumeric: function (val) {
    if (val.match(/^[A-Za-z]+$/)) {
      return false; // missing numbers
    } else if (val.match(/^[0-9]+$/)) {
      return false; // missing alphas
    } else {
      return true;
    }
  },
  isUkPostcode: function (val) {
    // taken from https://en.wikipedia.org/wiki/Postcodes_in_the_United_Kingdom#Validation
    // simpler regex to just validate the postcode format

    // 1 or 2 letters followed by a number
    // optionally a letter or number
    // A optional space followed by a number and two letters
    const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
    return val.match(ukPostcodeRegex) ? true : false;
  },
};
