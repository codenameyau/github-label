/*!
 * github-label
 * MIT License (c) 2015
 * https://github.com/codenameyau/github-label
 */
'use strict';

var requireDir = require('require-dir');
var program = require('commander');
var prompt = require('prompt');
var github = require('octonode');
var fs = require('fs');
var format = require('util').format;
var pjson = require('../package.json');
var labelPresets = requireDir('./presets');


/********************************************************************
* FUNCTION CONSTRUCTOR
*********************************************************************/
function GithubCLI() {
  // Command-line argument parser.
  this.program = program.version(pjson.version)
    .arguments('repo')
    .option('-p, --preset [value]', 'Specify a label preset.', 'default')
    .option('-j, --json [value]', 'Specify your own JSON label preset.')
    .option('-c, --clear [value]', 'Clear all GitHub labels.')
    .parse(process.argv);

  // Initialize values.
  this.repository = '';
  this.client = null;
  this.labels = [];

  // Setup octonode client.
  this.ACCESS_TOKEN = process.env.GITHUB_LABEL_TOKEN;
  this.validateArguments();
  this.setupLabels();
}


/********************************************************************
* PUBLIC METHODS
*********************************************************************/
GithubCLI.prototype.exit = function(message) {
  console.log('Exit: ' + message);
  process.exit(1);
};

GithubCLI.prototype.validateArguments = function() {
  // Show help if no options are specified.
  if (this.program.rawArgs.length < 3) {
    this.program.help();
  }

  // Validate that repository is specified.
  this.repository = this.program.args[0];
  if (!this.repository) {
    this.exit('please specify a repository like "user/repo"');
  }
};

GithubCLI.prototype.extendLabels = function(labels) {
  this.labels = this.labels.concat(labels);
};

GithubCLI.prototype.readLabels = function(filepath, callback) {
  var _this = this;
  fs.readFile(filepath, 'utf8', function(error, data) {
    if (error) {
      _this.exit('could not read file: ' + filepath);
    }
    _this.extendLabels(JSON.parse(data));
    callback();
  });
};

GithubCLI.prototype.setupLabels = function() {
  // Read user json labels.
  if (this.program.json) {
    this.readLabels(this.program.json, this.setupGithubClient.bind(this));
  }

  // Extend labels with preset.
  else {
    var preset = this.program.preset;
    var labels = labelPresets[preset];
    if (!labels) {
      this.exit(format('preset "%s" doesn\'t exist.', preset));
    }
    this.extendLabels(labels);
    this.setupGithubClient();
  }
};

GithubCLI.prototype.setupGithubClient = function() {
  console.log(this.labels);
  if (this.ACCESS_TOKEN) {
    this.setupTokenClient();
    this.submitLabelRequest();
  } else {
    this.getAuthCredentials(this.submitLabelRequest.bind(this));
  }
};

GithubCLI.prototype.setupTokenClient = function() {
  this.client = github.client(this.ACCESS_TOKEN);
};

GithubCLI.prototype.setupAuthClient = function(username, password) {
  this.client = github.client({
    username: username,
    password: password
  });
};

GithubCLI.prototype.getAuthCredentials = function(callback) {
  var _this = this;
  var authPrompt = [
    { name: 'username', type: 'string', required: true },
    { name: 'password', type: 'string', required: true, hidden: true }
  ];

  console.log('Please enter your GitHub credentials.\n');
  prompt.start();
  prompt.get(authPrompt, function(error, result) {
    if (error) {
      this.exit('invalid login credentials.');
    } _this.setupAuthClient(result.username, result.password);
    callback();
  });
};

GithubCLI.prototype.submitLabelRequest = function() {
  console.log(this.repository);
};

/********************************************************************
* MAIN PROGRAM
*********************************************************************/
var cli = new GithubCLI();
