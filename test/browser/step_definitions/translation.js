const { Given, When, Then } = require("@cucumber/cucumber");
const { SearchPage } = require("../pages");
const { expect } = require("chai");

Given("They start with {string}", async function (lang) {
  await setLanguageCookie(lang, this.page.url(), this.context);
  await this.page.reload();
});

When("They set the language to {string}", async function (lang) {
  await setLanguageCookie(lang, this.page.url(), this.context);
  await this.page.reload();
});

Then(/^the page's language property should be "(.*)"$/, async function (lang) {
  const code = lang.toLowerCase() === "welsh" ? "cy" : "en";
  const hasLanguageCorrectCode = await this.page
    .locator(`html[lang="${code}"]`)
    .count();
  expect(hasLanguageCorrectCode).to.equal(1);
});

When(
  /they set the language to "(.*)" using the toggle$/,
  async function (lang) {
    await setLanguageWithToggle(lang, this.page);
    await this.page.reload();
  }
);

async function setLanguageCookie(lang, url, context) {
  const code = lang.toLowerCase() === "welsh" ? "cy" : "en";
  const cookie = {
    name: "lng",
    value: code,
    url,
  };
  await context.addCookies([cookie]);
}

async function setLanguageWithToggle(lang, page) {
  const searchPage = new SearchPage(page);
  const code = lang.toLowerCase() === "welsh" ? "cy" : "en";

  await searchPage.toggleLanguage(code);
}
