const inquirer = require("inquirer");
const GithubSearch = require("./githubSearch");
const LicenseSearch = require("./availableLicenses");
const MyLicense = require("./myLicense");
let licencia;

// Node v10+ includes a promises module as an alternative to using callbacks with file system methods.
const { writeFile } = require("fs").promises;

// Use writeFileSync method to use promises instead of a callback function

const promptUser = (arr) => {
  return inquirer.prompt([
    {
      type: "input",
      name: "realname",
      message: "Enter your name:",
    },
    {
      type: "input",
      name: "email",
      message: "Enter your email:",
    },
    {
      type: "number",
      name: "number",
      message: "Enter your phone number:",
    },
    {
      type: "input",
      name: "github",
      message: "Enter your GitHub username:",
    },
    {
      type: "input",
      name: "repository",
      message: "Enter the GitHub project repository:",
    },
    {
      type: "input",
      name: "linkedin",
      message: "Enter your LinkedIn username:", //raul-maya
    },
    {
      type: "list",
      name: "licenses",
      message: "Select a license for your project:",
      choices: arr, //raul-maya
    },
  ]);
};

const licenses = new LicenseSearch();
const repo = new GithubSearch();
const mylicense = new MyLicense();

const extractLicense = (licenses) => {
  console.log(licenses);
  return mylicense.search(licenses);
};

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
const callApi = ({
  realname,
  email,
  number,
  github,
  repository,
  linkedin,
  licenses,
}) => {
  extractLicense(licenses).then((lic) =>
    repo
      .search(github, repository)
      .then((res) =>
        writeFile(
          "README.md",
          buildReadMe(res.data, realname, email, number, linkedin, lic.data)
        )
      )
  );
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
  realname,
  email,
  number,
  linkedin,
  newLicense
) => {
  license = newLicense;

  return `
  <!-- PROJECT LOGO -->
  <br />
  <div align="center">
    <a href="${html_url}">
      <img src="./assets/images/readMeGenerator.png" alt="Logo" width="200" height="200">
    </a>\n
  
  <h2 align="center">${name.split(/-|_/).join(" ")}</h2>\n
  > README.md generated by README-Generator App powered by Node.js
  <p align="center" style="color:#EAEAEA"> Project ID: ${id}</p>\n
  <hr>\n
  ![${language}](https://img.shields.io/badge/language-${language}-yellow.svg)\n
  ![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-orange.svg)\n
  [![License](https://img.shields.io/badge/license-${license.name}-blue.svg)](https://opensource.org/licenses/${license.spdx_id}) \n

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
</div>\n
## :bookmark_tabs: Menu
* [Overview](#overview)
* [Installation](#installation)
* [Usage](#usage)
* [License](#license)
* [Contributing](#contributing)
* [Tests](#test)
* [Contact](#contact)

## Overview\n
|Key|Value|
|:---:|:---:|
|Created On:|${new Date(created_at)}|
|Last Update:|${new Date(updated_at)}|
|Main Language:|${language}|
|Size:|${size} MB|
|Starred:|${stargazers_count}|
|Forks:|${forks_count}|

Description: ${description}\n

## Installation\n

## Usage\n

## License\n
${license.spdx_id} License\n
  [![License](https://img.shields.io/badge/license-${
    license.name
  }-blue.svg)](https://opensource.org/licenses/${license.spdx_id})\n
About the license:\n
${license.description}

## Contributing\n

1. Clone repo and create a new branch: $ git checkout ${html_url} -b <name_for_new_branch.
2. Make changes and test
3. Submit Pull Request with comprehensive description of changes

## Tests\n

## Contact\n
* Username: ${owner.login} <img src="${
    owner.avatar_url
  }" style="border-radius:50%; width:25px">\n
* Name: ${realname}\n
* Email: <${email}>\n
* Phone: ${number}\n
* URL: ${html_url}\n
* LinkedIn: https://www.linkedin.com/in/${linkedin}/\n
  `;
};

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
