#!/usr/bin/env node
'use strict';

var program = require('commander');
var prompt = require('prompt');
var requireDir = require('require-dir');
var format = require('util').format;
var logging = require('../src/logging');
var GithubClient = require('../src/client');
var utils = require('../src/utils');
var presets = requireDir('../src/presets');
var pjson = require('../package.json');


/********************************************************************
* HELPER FUNCTIONS
*********************************************************************/
var promptForCredentials = function(client, callback) {
  console.log('Please enter your GitHub credentials.\n');
  var authPrompt = [
    { name: 'username', type: 'string', required: true },
    { name: 'password', type: 'string', required: true, hidden: true }];
  prompt.start();
  prompt.get(authPrompt, function(error, result) {
    if (error) {
      logging.exit('invalid login credentials.');
    } client.setupAuthClient(result.username, result.password);
    callback();
  });
};

var createGithubLabels = function(repository, labels) {
  var client = new GithubClient();
  client.setRepository(repository);

  // TODO: Clean up labels for API here.
  // TODO: code

  // Authenticate client with access token.
  if (client.ACCESS_TOKEN) {
    client.setupTokenClient();
    client.postLabels(labels);
  }

  // Authenticate client with credentials.
  else {
    promptForCredentials(client, function() {
      client.postLabels(labels);
    });
  }
};


/********************************************************************
* MAIN CLI PROGRAM
*********************************************************************/
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

// Validate that a repository is specified.
var repository = program.args[0];
if (!repository) {
  logging.exit('please specify a repository like "user/repo"');
}

// Read JSON file if specfied by user.
if (program.json) {
  utils.readJSON(program.json, function(data) {
    createGithubLabels(repository, data);
  });
}

// Use one of the specified label preset.
else {
  var labelPreset = program.preset;
  var labels = presets[labelPreset];
  if (!labels) {
    logging.exit(format('preset "%s" doesn\'t exist.', labelPreset));
  } else {
    createGithubLabels(repository, labels);
  }
}
