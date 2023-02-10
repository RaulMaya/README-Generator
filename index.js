const inquirer = require("inquirer");
const GithubSearch = require("./githubSearch");
const LicenseSearch = require("./availableLicenses");

// Node v10+ includes a promises module as an alternative to using callbacks with file system methods.
const { writeFile } = require("fs").promises;

// Use writeFileSync method to use promises instead of a callback function

const promptUser = (arr) => {
  return inquirer.prompt([
    {
      type: "input",
      name: "github",
      message: "Enter your GitHub username:",
    },
    {
      type: "input",
      name: "repository",
      message: "Enter your GitHub repository:",
    },
    {
      type: "input",
      name: "linkedin",
      message: "Enter your LinkedIn username:", //raul-maya
    },
    {
      type: "list",
      name: "licenses",
      message: "Select a license for your poject:",
      choices: arr, //raul-maya
    },
  ]);
};

const licenses = new LicenseSearch();
const repo = new GithubSearch();

const getLicense = () => {
  return licenses.search();
};

const extractingLicenses = (lic) => {
  const licArr = [];
  for (license of lic) {
    licArr.push(license.key);
  }
  return licArr;
};

//Nuevo_Leon_Elections
const callApi = ({ github, repository, linkedin }) => {
  repo
    .search(github, repository)
    .then((res) => writeFile("README.md", buildReadMe(res.data, linkedin)));
};

const buildReadMe = (
  {
    id,
    name,
    owner,
    html_url,
    description,
    created_at,
    updated_at,
    size,
    stargazers_count,
    language,
    forks_count,
    license,
  },
  linkedin
) =>
  `
  <!-- PROJECT LOGO -->
  <br />
  <div align="center">
    <a href="${html_url}">
      <img src="./assets/images/readMeGenerator.png" alt="Logo" width="200" height="200">
    </a>\n
  
  <h2 align="center">${name.split(/-|_/).join(" ")}</h2>\n
  <p align="center" style="color:#EAEAEA"> Project ID: ${id}</p>\n
  <hr>\n
  ![${language}](https://img.shields.io/badge/language-${language}-yellow.svg)
  ![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-orange.svg)
  [![License](https://img.shields.io/badge/license-${
    license.spdx_id
  }-blue.svg)](https://opensource.org/licenses/${license.spdx_id})\n

  <p align="center">
  ${description}
    <br />
    <br />
    <a href="${html_url}">Repository</a>    
    ·
    <a href="${owner.html_url}">Owner Github</a>
    ·
    <a href="https://www.linkedin.com/in/${linkedin}/">My LinkedIn</a>
  </p>
</div>
## :bookmark_tabs: Menu

* [Overview](#overview)
* [Doc](#doc)
* [Contributing](#contributing)
* [Extra](#extra)
* [Usage](#usage)

  Owner Name: ${owner.login}\n
  <img src="${owner.avatar_url}" style="border-radius:50%; width:50px">\n
  URL: ${html_url}\n
  Description: ${description}\n
  Created On: ${created_at}\n
  Last Update: ${updated_at}\n
  Main Language: ${language}\n
  Size: ${size} MB\n
  Starred: ${stargazers_count}\n
  Forks: ${forks_count}\n
  License: ${license.spdx_id}\n
  LinkedIn: https://www.linkedin.com/in/${linkedin}/\n
  `;

const init = () => {
  getLicense()
    .then((res) => extractingLicenses(res.data))
    .then((arr) => promptUser(arr))
    .then((answers) => callApi(answers))
    //.then((res) => writeFile("README.md", buildReadMe(res.data)))
    .then(() => console.log("Successfully wrote to README.md"))
    .catch((err) => console.error(err));
};

init();
