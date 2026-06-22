import { expect } from "@playwright/test";
export async function takeAndCompareScreenshots(page, name) {
  const screenshot = await page.screenshot({ fullPage: true, type: 'png' })
  expect(screenshot).toMatchSnapshot(`${name}.png`, {
    threshold: 0.25,
    maxDiffPixels: 2,
  })
}
