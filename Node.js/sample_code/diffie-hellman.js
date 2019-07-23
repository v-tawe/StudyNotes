const crypto = require('crypto');

var ming = crypto.createDiffieHellman(128);
var ming_keys = ming.generateKeys();

var prime = ming.getPrime();
var generator = ming.getGenerator();

var hong = crypto.createDiffieHellman(prime, generator);
var hong_keys = hong.generateKeys();

var ming_secret = ming.computeSecret(hong_keys);
var hong_secret = hong.computeSecret(ming_keys);

console.log(ming_secret.toString('hex'));
console.log(hong_secret.toString('hex'));