function addressFactory(quantity) {
  const addresses = [];
  for (let i = 0; i < quantity; i++) {
    addresses.push({
      buildingNumber: `${i} house`,
      thoroughfareName: `${i} street`,
      postTown: `${i} town`,
      postcode: `${i} code`,
    });
  }
  return addresses;
}

module.exports = addressFactory;
