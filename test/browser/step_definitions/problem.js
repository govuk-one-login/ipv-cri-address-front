const { When } = require("@cucumber/cucumber");
const { ProblemPage } = require("../pages");
const { expect } = require("chai");

When(/they see the problem page$/, async function () {
  const problemPage = new ProblemPage(this.page);
  expect(problemPage.isCurrentPage()).to.be.true;
});

When(/they choose manual entry/, async function () {
  const problemPage = new ProblemPage(this.page);

  await problemPage.chooseManualEntry();
  await problemPage.continue();
});

When(/they choose go back to search/, async function () {
  const problemPage = new ProblemPage(this.page);

  await problemPage.chooseGoBackToSearch();
  await problemPage.continue();
});
