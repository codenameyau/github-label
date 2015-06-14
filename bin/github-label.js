#!/usr/bin/env node
/*!
 * github-label
 * MIT License (c) 2015
 * https://github.com/codenameyau/github-label
 */
'use strict';

var program = require('commander');
var prompt = require('prompt');
var async = require('async');
var requireDir = require('require-dir');
var format = require('util').format;
var GithubClient = require('../src/client');
var logging = require('../src/logging');
var utils = require('../src/utils');
var pjson = require('../package.json');
var presets = requireDir('../presets');


/********************************************************************
* HELPER FUNCTIONS
*********************************************************************/
var OUTPUT = {
  created: '[+] Created label: %s',
  skipped: '[-] Skipped label: %s',
  removed: '[-] Removed label: %s',
};

var hasInvalidOptions = function(program) {
  return program.rawArgs.length < 3 || [
      program.preset,
      program.json
    ].some(function(element) {
      return element === true;
    });
};

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

var exitOn404 = function(error) {
  if (error && error.statusCode === 404) {
    logging.exit('repository does not exist.');
  }
};

var outputLabels = function(client) {
  client.getLabels(function(error, data) {
    exitOn404(error);
    console.log(data);
  });
};

var createLabels = function(client, labels) {
  async.each(labels, function(item) {
    client.postLabel(item, function(error, data) {
      exitOn404(error);
      if (error && error.statusCode === 422) {
        console.log(OUTPUT.skipped, item.name);
      } else if (data) {
        console.log(OUTPUT.created, data.name);
      }
    });
  });
};

var sendClientRequest = function(repository, labels, callback) {
  var client = new GithubClient();
  client.setRepository(repository);

  // Authenticate client with access token.
  if (client.ACCESS_TOKEN) {
    client.setupTokenClient();
    callback(client, labels);
  }

  // Authenticate client with credentials.
  else {
    promptForCredentials(client, function() {
      callback(client, labels);
    });
  }
};


/********************************************************************
* MAIN CLI PROGRAM
*********************************************************************/
program.version(pjson.version)
  .arguments('repo')
  .option('-p, --preset [value]', 'Specify a label preset.')
  .option('-j, --json [value]', 'Specify your own JSON label preset.')
  .option('-r, --remove [value]', 'Remove a GitHub label preset.')
  .parse(process.argv);

var labelPreset = program.preset;
var jsonFile = program.json;

// Show help if no arguments are provided.
if (hasInvalidOptions(program)) {
  program.help();
}

// Validate that a repository is specified.
var repository = program.args[0];
if (!repository) {
  logging.exit('please specify a repository like "user/repo"');
}

// Read JSON file if specfied by user.
if (jsonFile) {
  utils.readJSON(jsonFile, function(data) {
    sendClientRequest(repository, data, createLabels);
  });
}

// Use one of the specified label preset.
else if (labelPreset) {
  var labels = presets[labelPreset];
  if (!labels) {
    logging.exit(format('preset "%s" doesn\'t exist.', labelPreset));
  } else if (!labels.length) {
    logging.exit('labels are empty.');
  } else {
    sendClientRequest(repository, labels, createLabels);
  }
}

// Output existing repository labels.
else {
  sendClientRequest(repository, null, outputLabels);
}
