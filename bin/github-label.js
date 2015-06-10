#!/usr/bin/env node
var program = require('commander');
var prompt = require('prompt');
var logging = require('../src/logging');
// var labels = require('../src/labels');
var pjson = require('../package.json');

// Command-line argument parser.
program.version(pjson.version)
  .arguments('repo')
  .option('-p, --preset [value]', 'Specify a label preset.', 'default')
  .option('-j, --json [value]', 'Specify your own JSON label preset.')
  .option('-c, --clear [value]', 'Clear all GitHub labels.')
  .parse(process.argv);

// Show help if no options are specified.
if (program.rawArgs.length < 3) {
  program.help();
}

// Validate that repository is specified.
var repository = program.args[0];
if (!repository) {
  logging.exit('please specify a repository like "user/repo"');
}


console.log(program);
