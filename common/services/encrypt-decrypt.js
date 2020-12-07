var SimpleCrypto = require('simple-crypto-js').default;
var secretKey = 'd0aafd6c38a2d836310067e13462b113541acb0267d50c5657fceb1b2cac9e38wr1t89pDG/jKzKuZRI1UvQ==';
var simpleCrypto = new SimpleCrypto(secretKey);
var utils = require('./utils');
exports.getCipherText = (input) => {
  if (utils.getIsObject(input)) {
    return simpleCrypto.encryptObject(input);
  }
  return simpleCrypto.encrypt(input);
}

exports.getNormalText = (input) => {
  if (utils.getIsObject(input)) {
    return simpleCrypto.decryptObject(input);
  }
  return simpleCrypto.decrypt(input);
}
