'use strict';

exports.exit = function(message) {
  if (message) {
    console.log('\nExit: ' + message);
  }
  process.exit(1);
};

exports.success = function(message) {
  if (message) {
    console.log('\nSuccess: ' + message);
  }
  process.exit(0);
};
