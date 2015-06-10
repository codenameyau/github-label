'use strict';

var fs = require('fs');
var logging = require('./logging');

exports.readJSON = function(filepath, callback) {
  fs.readFile(filepath, 'utf8', function(error, data) {
    if (error) {
      logging.exit('could not read file: ' + filepath);
    } callback(JSON.parse(data));
  });
};
