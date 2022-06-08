module.exports = {
  confirmationValidation: function (val, isPreviousJourney) {
    if (isPreviousJourney) {
      return true; // pass validation when in previous journey
    }
    return !!val;
  },
};
