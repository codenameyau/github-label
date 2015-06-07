/*!
 * github-label
 * MIT License (c) 2015
 * https://github.com/codenameyau/github-label
 */
'use strict';

// Dependencies.
var requireDir = require('require-dir');
var program = require('commander');
var prompt = require('prompt');
var github = require('octonode');
var fs = require('fs');

// JSON and constants.
var pjson = require('../package.json');
var presetLabels = requireDir('./presets');
var ACCESS_TOKEN = process.env.GITHUB_LABEL_TOKEN;


/********************************************************************
* INTERNAL FUNCTIONS
*********************************************************************/

// Pass if repository, key, user, and pw
var postGithubLabels = function(labels) {

};

var _exitMessage = function(msg) {
  console.log(msg);
  process.exit(1);
};

var _readUserLabels = function(filepath) {
  fs.readFile(filepath, function(error, data) {
    if (error) {
      _exitMessage('Could not read file: ' + filepath);
    }

    // Let GitHub handle the validation.
    postGithubLabels(JSON.parse(data));
  }, 'utf8');
};

var _getAuthCredentials = function(callback) {
  var authPrompt = [
    { name: 'username' },
    { name: 'password', hidden: true }
  ];

  prompt.start();
  prompt.get(authPrompt, function(error, result) {
    if (error) {
      _exitMessage('Exit: invalid login credentials.');
    } callback(results);
  });
};


/********************************************************************
* MAIN PROGRAM
*********************************************************************/
program.version(pjson.version)
  .option('-r, --repository [value]', 'Specify a GitHub repository.')
  .option('-p, --preset [value]', 'Specify a labels preset.')
  .option('-j, --json [value]', 'Specify your own JSON label preset.')
  .parse(process.argv);

// Show help if no options are specified.
if (program.rawArgs.length < 3) {
  program.help();
}

// Validate that repository is specified.
if (!program.repository) {
  _exitMessage('option: -r, --repository is required.');
}

// Validate that either acess token or username is specified.
if (!ACCESS_TOKEN) {
  _getAuthCredentials();
}

// Grab label preset by default.
var presetName = program.option.preset || 'default';

// Use user's JSON label preset if specified.
if (program.json) {
  _readUserLabels(program.json);
} else {
  var labels = presetLabels[presetName];
  postGithubLabels(labels);
}
