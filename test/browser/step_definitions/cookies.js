const { Then } = require("@cucumber/cucumber");
const { expect } = require("chai");
const axios = require("axios");

Then("the {word} cookie has been set", async function (cookieName) {
  await this.page.waitForTimeout(5000);

  const content = await this.page.content();
  // console.log("🍏 content after going to second page", content);

  // try {
  //   const deviceIntelligenceJs = await axios.get(
  //     "http://localhost:5010/public/javascripts/all.js"
  //   );

  //   console.log("🍏 deviceIntelligenceJs", deviceIntelligenceJs.data);
  // } catch (e) {
  //   console.log("🍏 error", e);
  // }

  const cookies = await this.page.context().cookies();

  const expectedCookie = cookies.find((cookie) => cookie.name === cookieName);
  expect(expectedCookie).to.exist;
});
