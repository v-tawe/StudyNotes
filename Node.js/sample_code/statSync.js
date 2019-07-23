'use strict'

try {
    var fs = require('fs');

    var statSync = fs.statSync('sample.txt')

    console.log(JSON.stringify(statSync));
} catch(e) {
    console.log(e);
}
