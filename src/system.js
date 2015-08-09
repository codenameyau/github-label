'use strict';

exports.exit = function(message) {
  if (message) {
    console.log('Exit: ' + message);
  }
  process.exit(1);
};

exports.success = function(message) {
  if (message) {
    console.log('Success: ' + message);
  }
  process.exit(0);
};
