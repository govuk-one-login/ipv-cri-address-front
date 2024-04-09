const { When, Then } = require("@cucumber/cucumber");
const { ErrorPage } = require("../pages");
const { expect } = require("chai");

When(
  /they set the language to "(.*)" using the toggle$/,
  async function (lang) {
    await setLanguageWithToggle(lang, this.page);
    await this.page.reload();
  }
);

Then(/^they (?:should )?see(?:ed)? the page in "(.*)"$/, async function (lang) {
  const errorPage = new ErrorPage(this.page);
  const errorTitle = await errorPage.getErrorTitle();

  expect(errorTitle).to.equal(
    errorPage.getLocalisedSomethingWentWrongMessage(lang)
  );
});

async function setLanguageWithToggle(lang, page) {
  const errorPage = new ErrorPage(page);
  const code = lang.toLowerCase() === "welsh" ? "cy" : "en";

  await errorPage.toggleLanguage(code);
}
