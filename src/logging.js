'use strict';

exports.exit = function(message) {
  console.log('Exit: ' + message);
  process.exit(1);
};
