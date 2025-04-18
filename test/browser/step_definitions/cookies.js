const { Then } = require("@cucumber/cucumber");
const { expect } = require("chai");

Then("the {word} cookie has been set", async function (cookieName) {
  await this.page.waitForTimeout(1000);

  const href = await this.page.evaluate(() => {
    // eslint-disable-next-line no-undef
    return document.location.href;
  });

  console.log("🍏 href", href);

  const content = await this.page.content();
  console.log("🍏 content", content);

  const cookies = await this.page.context().cookies();

  console.log("🍏 cookies", cookies);

  const expectedCookie = cookies.find((cookie) => cookie.name === cookieName);
  expect(expectedCookie).to.exist;
});
