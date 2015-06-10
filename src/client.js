'use strict';

var github = require('octonode');

/********************************************************************
* FUNCTION CONSTRUCTOR
*********************************************************************/
function GithubClient() {
  // Only specified if environment variable exists.
  this.ACCESS_TOKEN = process.env.GITHUB_LABEL_TOKEN;
  this.repository = '';
  this.client = null;
  this.ghrepo = null;
}


/********************************************************************
* PUBLIC METHODS
*********************************************************************/
GithubClient.prototype.setRepository = function(repository) {
  this.repository = repository;
  this.ghrepo = this.client.repo(this.repository);
};

GithubClient.prototype.getRepository = function() {
  return this.repository;
};

GithubClient.prototype.setupTokenClient = function() {
  this.client = github.client(this.ACCESS_TOKEN);
  this.setupGithubRepo();
};

GithubClient.prototype.setupAuthClient = function(username, password) {
  this.client = github.client({
    username: username,
    password: password
  });
  this.setupGithubRepo();
};

GithubClient.prototype.getLabels = function(callback) {
  this.ghrepo.labels(function(blank, data, header) {
    callback(data, header);
  });
};

GithubClient.prototype.postLabels = function(labels) {
  console.log('TODO: Send post request');
};


/********************************************************************
* MODULE EXPORT
*********************************************************************/
module.exports = GithubClient;
