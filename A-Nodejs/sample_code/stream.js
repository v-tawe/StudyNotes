'use strict'

var fs = require('fs');

var rs1 = fs.createReadStream('./sample.txt', 'utf-8');
var ws1 = fs.createWriteStream('./sample-write.txt', 'utf-8');

rs1.on('data', (x) => { console.log('DATA:'), console.log(x); });
rs1.on('end', () => { console.log('END'); });

ws1.write('Testing for write stream!');
//ws1.end();

// readable.pipe(writeable, {end: false});
rs1.pipe(ws1, false);
//rs1.read();