'use strict';

var github = require('octonode');


/********************************************************************
* FUNCTION CONSTRUCTOR
*********************************************************************/
function GithubClient() {
  // Only true if environment variable exists.
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
  ghrepo.labels(function(error, data, header) {
    callback(error, data, header);
  });
};

GithubClient.prototype.postLabel = function(label, callback) {
  var ghrepo = this.client.repo(this.repository);
  ghrepo.label(label, function(error, data, header) {
    callback(error, data, header);
  });
};

GithubClient.prototype.removeLabel = function(labelName, callback) {
  var ghlabel = this.client.label(this.repository, labelName);
  ghlabel.delete(function(error, data, header) {
    callback(error, data, header);
  });
};


/********************************************************************
* MODULE EXPORT
*********************************************************************/
module.exports = GithubClient;
