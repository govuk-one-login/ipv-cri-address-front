module.exports = {
  confirmationValidation: function (
    val,
    isPreviousJourney,
    isMoreInfoRequired
  ) {
    if (isPreviousJourney) {
      return true; // pass validation when in previous journey
    }

    if (!isMoreInfoRequired) {
      return true;
    }

    return !!val;
    // return true;
  },
};
