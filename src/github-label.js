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
var pjson = require('../package.json');
var labelPresets = requireDir('./presets');


/********************************************************************
* FUNCTION CONSTRUCTOR
*********************************************************************/
function GithubCLI() {
  // Command-line argument parser.
  this.program = program.version(pjson.version)
    .arguments('repo')
    .option('-r, --repository [value]', 'Specify a GitHub repository.')
    .option('-p, --preset <items>', 'Specify a label preset.')
    .option('-j, --json [value]', 'Specify your own JSON label preset.')
    .parse(process.argv);

  // Setup octonode client.
  this.ACCESS_TOKEN = process.env.GITHUB_LABEL_TOKEN;
  this.client = null;
  this.validateArguments();
}


/********************************************************************
* PUBLIC METHODS
*********************************************************************/
GithubCLI.prototype.exit = function(message) {
  console.log('Exit: ' + message);
  process.exit(1);
};

GithubCLI.prototype.setupAuthClient = function(username, password) {
  this.client = github.client({
    username: username,
    password: password
  });
};

GithubCLI.prototype.setupTokenClient = function() {
  this.client = github.client(this.ACCESS_TOKEN);
};

GithubCLI.prototype.getAuthCredentials = function() {
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
  });
};

GithubCLI.prototype.validateArguments = function() {
  // Show help if no options are specified.
  if (this.program.rawArgs.length < 3) {
    this.program.help();
  }

  // Validate that repository is specified.
  if (!this.program.repository) {
    this.exit('option --repository is required.');
  }

  // Validate either access token or credentials.
  this.setupGithubClient();
};

GithubCLI.prototype.setupGithubClient = function() {
  if (this.ACCESS_TOKEN) {
    this.setupTokenClient();
  } else {
    this.getAuthCredentials();
  }
};

GithubCLI.prototype.getLabels = function() {
  return labelPresets[this.program.preset];
};

GithubCLI.prototype.readLabels = function(filepath, cb) {
  var _this = this;
  fs.readFile(filepath, function(error, data) {
    if (error) {
      _this.exit('could not read file: ' + filepath);
    } cb(data);
  }, 'utf8');
};


/********************************************************************
* MAIN PROGRAM
*********************************************************************/
var cli = new GithubCLI();
