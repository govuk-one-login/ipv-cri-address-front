import { setWorldConstructor } from "@cucumber/cucumber";

import "playwright";

const users = {
  "Erroring Ethem": {
    name: "Ethem E",
  },
  "Authenticalable Address Amy": {
    name: "Amy M",
  },
  "International Irene": {
    name: "Irene I",
  },
};

class CustomWorld {
  constructor() {
    this.allUsers = users;
  }
}

setWorldConstructor(CustomWorld);
