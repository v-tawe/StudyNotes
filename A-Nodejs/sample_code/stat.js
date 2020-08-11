'use strict'

var fs = require('fs');

fs.stat('./sample.txt', function (err, status) {
    if (err) {
        console.log(err);
    } else {
        console.log(status.isFile());
    }
})