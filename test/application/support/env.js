const { setWorldConstructor } = require("@cucumber/cucumber");

require("playwright");

const users = {
  "Erroring Ethem": {
    name: "Ethem E",
  },
  "Not found Nigel": {
    name: "Nigel N",
  },
  "Postcode mistmatch Peter": {
    name: "Peter P",
  },
  "Authenticalable Address Amy": {
    name: "Amy M",
  },
};

class CustomWorld {
  constructor() {
    this.allUsers = users;
  }
}

setWorldConstructor(CustomWorld);
