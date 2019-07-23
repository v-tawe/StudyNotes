const crypto = require('crypto');

function aesEncrypt(data, key) {
    const cipher = crypto.createCipher('aes192', key);
    var crypted = cipher.update(data, 'utf-8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function aesDecrypt(encryped, key) {
    const decipher = crypto.createDecipher('aes192', key);
    var decrypted = decipher.update(encryped, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

var
    data = 'Hello, world!',
    key = 'password',
    encrypted = aesEncrypt(data, key);
    decrypted = aesDecrypt(encrypted, key);

console.log('Plain text:' + data);
console.log('Encrypted text:' + encrypted);
console.log('Decrypted text:' + decrypted);