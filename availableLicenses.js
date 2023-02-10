const axios = require("axios");

function LicenseSearch() {}

LicenseSearch.prototype.search = function () {
  return axios.get("https://api.github.com/licenses");
};

module.exports = LicenseSearch;
