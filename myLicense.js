const axios = require("axios");

function myLicense() {}

myLicense.prototype.search = function (license) {
  return axios.get(`https://api.github.com/licenses/${license}`);
};

module.exports = myLicense;
