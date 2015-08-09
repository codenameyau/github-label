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
var system = require('../src/system');
var utils = require('../src/utils');
var pjson = require('../package.json');
var presets = requireDir('../presets');


/********************************************************************
* HELPER FUNCTIONS
*********************************************************************/
var OUTPUT = {
  created: '[+] Created label: %s',
  skipped: '[-] Skipped label: %s',
  removed: '[x] Removed label: %s',
};

var hasInvalidOptions = function(program) {
  return program.rawArgs.length < 3 || [
      program.preset,
      program.json
    ].some(function(option) {
      return option === true;
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
      system.exit('invalid login credentials.');
    } client.setupAuthClient(result.username, result.password);
    callback();
  });
};

var exitOn404 = function(error) {
  if (error && error.statusCode === 404) {
    system.exit('repository does not exist.');
  }
};

var showPresets = function(presetName) {
  if (typeof(presetName) === 'string') {
    // Print the labels in the preset.
    console.log('Preset: %s\n', presetName);
    var labels = presets[presetName];
    labels.forEach(function(value) {
      console.log('#%s - %s', value.color, value.name);
    });
  } else if (presetName === true) {
    // Only print the preset names.
    console.log('List of available presets:\n');
    for (var label in presets) {
      if (presets.hasOwnProperty(label)) {
        console.log(label);
      }
    }
  }
};

var getLabels = function(client, callback) {
  client.getLabels(function(error, data) {
    exitOn404(error);
    callback(data);
  });
};

var outputLabels = function(client) {
  getLabels(client, function(data) {
    data.forEach(function(element) {
      console.log('#%s - %s', element.color, element.name);
    });
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

var removeLabels = function(client, labels) {
  async.each(labels, function(item) {
    client.removeLabel(item.name, function(error) {
      if (error && error.statusCode === 404) {
        console.log(OUTPUT.skipped, item.name);
      } else {
        console.log(OUTPUT.removed, item.name);
      }
    });
  });
};

var removeAllLabels = function(client) {
  getLabels(client, function(data) {
    removeLabels(client, data);
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
  .option('-l, --list [value]', 'List the default preset.')
  .option('-j, --json [value]', 'Specify your own JSON label preset.')
  .option('-r, --remove', 'Remove a GitHub label preset.')
  .option('-R, --remove-all', 'Removes all labels.')
  .parse(process.argv);

var labelOption = program.preset;
var listOption = program.list;
var removeOption = program.remove;
var removeAllOption = program.removeAll;
var jsonOption = program.json;

// Show help if no arguments are provided.
if (hasInvalidOptions(program)) {
  program.help();
}

// List the default presets.
if (listOption) {
  showPresets(listOption);
  system.success();
}

// Validate that a repository is specified.
var repository = program.args[0];
if (!repository) {
  system.exit('please specify a repository like "user/repo"');
}

// Remove all labels.
if (removeAllOption) {
  sendClientRequest(repository, null, removeAllLabels);
}

// Read JSON file if specfied by user.
else if (jsonOption) {
  utils.readJSON(jsonOption, function(data) {
    if (removeOption) {
      sendClientRequest(repository, data, removeLabels);
    } else {
      sendClientRequest(repository, data, createLabels);
    }
  });
}

// Use one of the specified label preset.
else if (labelOption) {
  var labels = presets[labelOption];
  if (!labels) {
    system.exit(format('preset "%s" doesn\'t exist.', labelOption));
  } else if (removeOption) {
    sendClientRequest(repository, labels, removeLabels);
  } else {
    sendClientRequest(repository, labels, createLabels);
  }
}

// Output existing repository labels.
else {
  sendClientRequest(repository, null, outputLabels);
}
