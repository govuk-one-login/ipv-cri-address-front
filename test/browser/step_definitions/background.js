// Steps for any background tasks we need to do pre tests
const { Given } = require("@cucumber/cucumber");

Given("they have Welsh language set", async function () {
  const cookie = {
    name: "lang",
    value: "cy",
    url: this.page.url(),
  };
  await this.context.addCookies([cookie]);
  await this.page.reload();
});

Given("they have English language set", async function () {
  const cookie = {
    name: "lang",
    value: "en",
    url: this.page.url(),
  };
  await this.context.addCookies([cookie]);
  await this.page.reload();
});
