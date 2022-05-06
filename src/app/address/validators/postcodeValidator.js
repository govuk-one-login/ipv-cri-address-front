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
    const ukPostcodeRegex =
      /^(([A-Z]{1,2}[0-9][A-Z0-9]?|ASCN|STHL|TDCU|BBND|[BFS]IQQ|PCRN|TKCA) ?[0-9][A-Z]{2}|BFPO ?[0-9]{1,4}|(KY[0-9]|MSR|VG|AI)[ -]?[0-9]{4}|[A-Z]{2} ?[0-9]{2}|GE ?CX|GIR ?0A{2}|SAN ?TA1)$/i;

    return val.match(ukPostcodeRegex) ? true : false;
  },
};
