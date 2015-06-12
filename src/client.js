'use strict';

var github = require('octonode');
var format = require('util').format;

/********************************************************************
* FUNCTION CONSTRUCTOR
*********************************************************************/
function GithubClient() {
  // Only specified if environment variable exists.
  this.ACCESS_TOKEN = process.env.GITHUB_LABEL_TOKEN;
  this.repository = '';
  this.client = null;
}


/********************************************************************
* PUBLIC METHODS
*********************************************************************/
GithubClient.prototype.setRepository = function(repository) {
  this.repository = repository;
};

GithubClient.prototype.getRepository = function() {
  return this.repository;
};

GithubClient.prototype.setupTokenClient = function() {
  this.client = github.client(this.ACCESS_TOKEN);
};

GithubClient.prototype.setupAuthClient = function(username, password) {
  this.client = github.client({
    username: username,
    password: password
  });
};

GithubClient.prototype.getLabels = function(callback) {
  var ghrepo = this.client.repo(this.repository);
  ghrepo.labels(function(blank, data, header) {
    callback(data, header);
  });
};

GithubClient.prototype.postLabels = function(labels) {
  var ghrepo = this.client.repo(this.repository);
  for (var i=0; i<labels.length; i++) {
    var label = labels[i];
    ghrepo.label(label, function(error, data) {
      if (!error && data) {
        console.log('[+] Created label: %s - #%s', data.name, data.color);
      }
    });
  }
};


/********************************************************************
* MODULE EXPORT
*********************************************************************/
module.exports = GithubClient;
