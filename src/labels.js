'use strict';

var requireDir = require('require-dir');
var github = require('octonode');
var fs = require('fs');
var format = require('util').format;
var logging = require('./logging');
var labelPresets = requireDir('./presets');


/********************************************************************
* FUNCTION CONSTRUCTOR
*********************************************************************/
function GithubCLI() {
  // Initialize values.
  this.repository = '';
  this.client = null;
  this.ghrepo = null;
  this.labels = [];

  // Setup octonode client.
  this.ACCESS_TOKEN = process.env.GITHUB_LABEL_TOKEN;
  this.validateArguments();
  this.setupLabels();
}


/********************************************************************
* PUBLIC METHODS
*********************************************************************/
GithubCLI.prototype.extendLabels = function(labels) {
  this.labels = this.labels.concat(labels);
};

GithubCLI.prototype.readLabels = function(filepath, callback) {
  var _this = this;
  fs.readFile(filepath, 'utf8', function(error, data) {
    if (error) {
      logging.exit('could not read file: ' + filepath);
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
      logging.exit(format('preset "%s" doesn\'t exist.', preset));
    }
    this.extendLabels(labels);
    this.setupGithubClient();
  }
};

GithubCLI.prototype.setupGithubClient = function() {
  if (this.ACCESS_TOKEN) {
    this.setupTokenClient();
    this.submitLabel();
  } else {
    this.getAuthCredentials(this.submitLabel.bind(this));
  }
};

GithubCLI.prototype.setupTokenClient = function() {
  this.client = github.client(this.ACCESS_TOKEN);
  this.setupGithubRepo();
};

GithubCLI.prototype.setupAuthClient = function(username, password) {
  this.client = github.client({
    username: username,
    password: password
  });
  this.setupGithubRepo();
};

GithubCLI.prototype.setupGithubRepo = function() {
  this.ghrepo = this.client.repo(this.repository);
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
      logging.exit('invalid login credentials.');
    } _this.setupAuthClient(result.username, result.password);
    callback();
  });
};

GithubCLI.prototype.getLabels = function(callback) {
  this.ghrepo.labels(function(blank, data, header) {
    callback(data, header);
  });
};

/********************************************************************
* MAIN PROGRAM
*********************************************************************/
var cli = new GithubCLI();
