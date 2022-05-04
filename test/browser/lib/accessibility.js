module.exports = {
  const evntFunction = (pageFromLoadEvent) => {
    console.log(`page from load event: ${pageFromLoadEvent.url()}`);

    // const results = await new AxeBuilder({ page: this.page }).analyze();
    // console.log(Object.keys(results)); // eslint-disable-line
    // console.log(results.violations[0]); // eslint-disable-line
  };

}
