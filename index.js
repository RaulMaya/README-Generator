const inquirer = require("inquirer");
const GithubSearch = require("./githubSearch");

// Node v10+ includes a promises module as an alternative to using callbacks with file system methods.
const { writeFile } = require("fs").promises;

// Use writeFileSync method to use promises instead of a callback function

const promptUser = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "github",
      message: "Enter your GitHub Username:",
    },
    {
      type: "input",
      name: "repository",
      message: "Enter your GitHub Repository:",
    },
    {
      type: "input",
      name: "linkedin",
      message: "Enter your LinkedIn Username:",
      //raul-maya
    },
  ]);
};

const repo = new GithubSearch();
//Nuevo_Leon_Elections
const callApi = ({ github, repository, linkedin }) => {
  repo.search(github, repository).then((res) => writeFile("README.md", buildReadMe(res.data, linkedin)));
};

const buildReadMe = ({
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
}, linkedin) =>
  `
  ID: ${id}\n
  Project Name: ${name.split(/-|_/).join(' ')}\n
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
  promptUser()
    .then((answers) => callApi(answers))
    //.then((res) => writeFile("README.md", buildReadMe(res.data)))
    .then(() => console.log("Successfully wrote to README.md"))
    .catch((err) => console.error(err));
};

init();
