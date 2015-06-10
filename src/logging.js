'use strict';

exports.exit = function(message) {
  console.log('\nExit: ' + message);
  process.exit(1);
};
