import { expect } from "@playwright/test";
import assert from "node:assert";

export class CountryPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.paths = ["/what-country"];
  }

  async continue() {
    await this.page.click("#continue");
  }

  isCurrentPage() {
    const { pathname } = new URL(this.page.url());

    return this.paths.findIndex((val) => val === pathname) !== -1;
  }

  async returnCountrySelectItem(country) {
    // The country selector is not a select component when javascript is enabled
    const input = this.page.locator("#country");
    await input.waitFor({ state: "visible", timeout: 500 });
    await input.pressSequentially(country);
    await this.page
      .locator("#country__option--0")
      .waitFor({ state: "visible" });
    return this.page.textContent("#country__option--0");
  }

  async validateCountrySelectSpanInlineStyles() {
    const spanElement = this.page.locator("#country__option--0 span");
    await spanElement.waitFor({ state: "visible", timeout: 500 });

    const expectedStyle =
      "border:0;clip:rect(0 0 0 0);height:1px;marginBottom:-1px;marginRight:-1px;overflow:hidden;padding:0;position:absolute;whiteSpace:nowrap;width:1px";

    assert.strictEqual(await spanElement.getAttribute("style"), expectedStyle);

    // getAttribute() returns the given value regardless of CSP errors on Chromium
    // therefore also spot-check the computed styles
    await expect(spanElement).toHaveCSS("clip", "rect(0px, 0px, 0px, 0px)");
    await expect(spanElement).toHaveCSS("overflow", "hidden");
    await expect(spanElement).toHaveCSS("position", "absolute");
  }

  async selectCountry(value) {
    // The country selector is not a select component when javascript is enabled
    const input = this.page.locator("#country");
    await input.waitFor({ state: "visible", timeout: 500 });
    await input.pressSequentially(value);
    await this.page
      .locator("#country__option--0")
      .waitFor({ state: "visible" });
    await this.page.click("#country__option--0");
  }

  async getSelectedCountry() {
    const select = this.page.locator("select");
    const text = await select.locator("option:checked").textContent();

    return text.trim();
  }

  getErrorSummary() {
    return this.page.textContent(".govuk-error-summary");
  }
}
