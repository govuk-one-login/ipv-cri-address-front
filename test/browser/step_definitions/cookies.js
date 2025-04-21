const { Then } = require("@cucumber/cucumber");
const { expect } = require("chai");

Then("the {word} cookie has been set", async function (cookieName) {
  const cookies = await this.page.context().cookies();
  const expectedCookie = cookies.find((cookie) => cookie.name === cookieName);
  expect(expectedCookie).to.exist;
});
