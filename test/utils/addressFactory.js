function addressFactory(quantity) {
  const addresses = [];
  for (let i = 0; i < quantity; i++) {
    addresses.push({
      addressLine1: `${i} house`,
      addressLine2: `${i} street`,
      addressTown: `${i} town`,
      addressPostcode: `${i} code`,
    });
  }
  return addresses;
}

module.exports = addressFactory;
