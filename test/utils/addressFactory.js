function addressFactory(quantity) {
  const addresses = [];
  for (let i = 0; i < quantity; i++) {
    const address = {
      streetName: `${i} street`,
      addressLocality: `${i} town`,
      postalCode: `${i} code`,
      validFrom: String(new Date().getFullYear()),
    };

    // factor in when an address has building name or building number or both
    if (i % 3 === 0) {
      address.buildingNumber = `${i}`;
    } else if (i % 3 === 1) {
      address.buildingName = `${i} house`;
    } else {
      address.buildingNumber = `${i}`;
      address.buildingName = `Manor house`;
    }
    addresses.push(address);
  }
  return addresses;
}

module.exports = addressFactory;
