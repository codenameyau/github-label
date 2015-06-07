/*!
 * github-label
 * MIT License (c) 2015
 * https://github.com/codenameyau/github-label
 */
'use strict';

var requireDir = require('require-dir');
var program = require('commander');
var github = require('octonode');
var pjson = require('../package.json');
var presetLabels = requireDir('./presets');
var ACCESS_TOKEN = process.env.GITHUB_LABEL_TOKEN;


/********************************************************************
* INTERNAL FUNCTIONS
*********************************************************************/
var _exitMessage = function(msg) {
  console.log(msg);
  process.exit(1);
};


/********************************************************************
* MAIN PROGRAM
*********************************************************************/
program.version(pjson.version)
  .option('-u, --username [value]', 'Specify your GitHub username.')
  .option('-r, --repository [value]', 'Specify a GitHub repository.')
  .option('-p, --preset [value]', 'Specify a labels preset.')
  .option('-j, --json [value]', 'Specify your own JSON label preset.')
  .parse(process.argv);

// Validate that options are specified.
if (program.rawArgs.length < 3) {
  program.help();
}

// Validate that repository is specified.
if (!program.repository) {
  _exitMessage('option: -r, --repository is required.');
}

// Validate that either acess token or username is specified.
if (!ACCESS_TOKEN && !program.user) {
  _exitMessage('option: -u, --username is required.');
}

// Grab label preset by default.
var presetName = program.option.preset || 'default';
var labels = presetLabels[presetName];

console.log(program.repository);
console.log(labels);
