'use strict';

var fs = require('fs');
var system = require('./system');

exports.readJSON = function(filepath, callback) {
  fs.readFile(filepath, 'utf8', function(error, data) {
    if (error) {
      system.exit('could not read file: ' + filepath);
    } callback(JSON.parse(data));
  });
};
