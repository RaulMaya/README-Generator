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
    url,
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
  ID: ${id}\n
  Project Name: ${name.split(/-|_/).join(" ")}\n
  Owner Name: ${owner.login}\n
  Owner Avatar: ${owner.avatar_url}\n
  URL: ${url}\n
  Description: ${description}\n
  Created On: ${created_at}\n
  Last Update: ${updated_at}\n
  Main Language: ${language}\n
  Size: ${size} MB\n
  Starred: ${stargazers_count}\n
  Forks: ${forks_count}\n
  License: ${license.name}\n
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
