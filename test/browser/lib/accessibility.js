const { default: AxeBuilder } = require("@axe-core/playwright");

const analysePage = async (page) => {
  if (!process.env.TEST_ACCESSIBILITY) {
    return;
  }

  console.log("analysePage");
  const results = await new AxeBuilder({ page }).analyze();
  console.log(Object.keys(results)); // eslint-disable-line
  console.log(results.violations[0]); // eslint-disable-line

  return true;
};

const handlePageLoad = async (pageFromLoadEvent) => {
  console.log(`page from load event: ${pageFromLoadEvent.url()}`);

  // pageFromLoadEvent.waitForFunction(analysePage(pageFromLoadEvent))
  await analysePage(pageFromLoadEvent);
};

module.exports = {
  analysePage,
  handlePageLoad,
};
