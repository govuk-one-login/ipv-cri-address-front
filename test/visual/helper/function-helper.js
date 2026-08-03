import { getStartingURL } from "../../browser/support/journey-setup.js";

export async function goToAddressStart(page, journey, lang) {
  const startingUrl = await getStartingURL(journey);
  await page.goto(startingUrl.toString());

  if (lang) {
    const url = new URL(page.url());
    url.searchParams.set("lng", lang);
    await page.goto(url.toString());
    await page.reload();
  }
}
