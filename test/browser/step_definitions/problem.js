import { When } from "@cucumber/cucumber";
import assert from "node:assert";
import { ProblemPage } from "../pages/index.js";

When(/they see the problem page$/, async function () {
  const problemPage = new ProblemPage(this.page);
  assert.strictEqual(problemPage.isCurrentPage(), true);
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
