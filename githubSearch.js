const axios = require("axios");

function GithubSearch() {}

GithubSearch.prototype.buildUrl = function(user, repo) {
  return `https://api.github.com/repos/${user}/${repo}`;
};

GithubSearch.prototype.search = function(user, repo){
  return axios.get(this.buildUrl(user, repo));
};

module.exports = GithubSearch;
