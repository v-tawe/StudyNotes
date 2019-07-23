const
    fs = require('fs'),
    crypto = require('crypto');

function loadKey(file) {
    return fs.readFileSync(file, 'utf-8');
}

let 
    prvKey = loadKey('./rsa-prv.pem'),
    pubKey = loadKey('./rsa-pub.pem'),
    message = 'Hello Word!';

// 使用私钥加密
let enc_by_prv = crypto.privateEncrypt(prvKey, Buffer.from(message, 'utf-8'));
console.log(enc_by_prv.toString('hex'));

// 使用公钥解密
let dec_by_pub = crypto.publicDecrypt(pubKey, enc_by_prv);
console.log('decrypted by public key:' + dec_by_pub.toString('utf-8'));

// 使用公钥加密
let enc_by_pub = crypto.publicEncrypt(pubKey, Buffer.from(message, 'utf-8'));
console.log(enc_by_pub.toString('hex'));

// 使用私钥解密
let dec_by_prv = crypto.privateDecrypt(prvKey, enc_by_pub);
console.log('decrypted by public key:' + dec_by_prv.toString('utf-8'));