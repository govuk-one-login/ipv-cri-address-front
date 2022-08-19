// Steps for any background tasks we need to do pre tests
const { Given, When } = require("@cucumber/cucumber");

Given("They start with {string}", async function (lang) {
  await setLanguageCookie(lang, this.page.url(), this.context);
  await this.page.reload();
});

When("They set the language to {string}", async function (lang) {
  await setLanguageCookie(lang, this.page.url(), this.context);
  await this.page.reload();
});

async function setLanguageCookie(lang, url, context) {
  const code = lang.toLowerCase() === "welsh" ? "cy" : "en";
  const cookie = {
    name: "lang",
    value: code,
    url,
  };
  await context.addCookies([cookie]);
}
